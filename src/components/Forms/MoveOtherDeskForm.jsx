import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useHideForms from '../../hooks/useHideForms'
import { updateLink } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
import { usePreferencesStore } from '../../store/preferences'
import { useTopLevelCategoriesStore } from '../../store/useTopLevelCategoriesStore'
import FolderIcon from '../Icons/folder'
import styles from './MoveOtherDeskForm.module.css'

// Componente recursivo para renderizar categorías anidadas
function CategoryItem ({ category, allCategories, onSelect, currentCategoryId, isTopLevel = false }) {
  const childCategories = allCategories.filter(cat => cat.parentId === category._id)
  const hasChildren = childCategories.length > 0
  // Las categorías top-level no son seleccionables, las demás sí (aunque tengan hijos)
  const isSelectable = !isTopLevel

  // Debug log
  console.log('📂 CategoryItem:', {
    name: category.name,
    isTopLevel,
    hasChildren,
    isSelectable,
    childrenCount: childCategories.length,
    willRenderClickableSpan: hasChildren && isSelectable
  })

  const togglePanel = (liElement) => {
    const panel = liElement.querySelector(':scope > ul')
    if (!panel) return

    const isExpanding = !panel.style.maxHeight

    if (isExpanding) {
      panel.style.maxHeight = panel.scrollHeight + 'px'
      // Actualizar los acordeones padres para que acomoden el nuevo contenido
      let parentLi = liElement.parentElement?.closest('li')
      while (parentLi) {
        const parentPanel = parentLi.querySelector(':scope > ul')
        if (parentPanel && parentPanel.style.maxHeight) {
          parentPanel.style.maxHeight = parentPanel.scrollHeight + panel.scrollHeight + 'px'
        }
        parentLi = parentLi.parentElement?.closest('li')
      }
    } else {
      // Al colapsar, también reducir la altura de los padres
      const collapsingHeight = panel.scrollHeight
      panel.style.maxHeight = null
      let parentLi = liElement.parentElement?.closest('li')
      while (parentLi) {
        const parentPanel = parentLi.querySelector(':scope > ul')
        if (parentPanel && parentPanel.style.maxHeight) {
          const currentHeight = parseInt(parentPanel.style.maxHeight)
          parentPanel.style.maxHeight = (currentHeight - collapsingHeight) + 'px'
        }
        parentLi = parentLi.parentElement?.closest('li')
      }
    }
  }

  const handleToggleAccordion = (event) => {
    event.stopPropagation()
    // Si es seleccionable, buscar el span hijo y simular el evento de selección
    if (isSelectable) {
      const spanElement = event.currentTarget.querySelector(':scope > span.destination')
      if (spanElement) {
        onSelect({ ...event, currentTarget: spanElement })
      }
    }
    togglePanel(event.currentTarget)
  }

  const handleSelect = (event) => {
    event.stopPropagation()
    console.log('🎯 handleSelect ejecutado para:', category.name)
    // Pasar el span directamente a onSelect
    onSelect(event)
    // También hacer toggle del acordeón si tiene hijos
    if (hasChildren) {
      const liElement = event.currentTarget.closest('li')
      togglePanel(liElement)
    }
  }

  // Para categorías sin hijos que son seleccionables
  const handleClickLeaf = (event) => {
    if (isSelectable) {
      onSelect(event)
    }
  }

  return (
    <li
      key={category._id}
      onClick={hasChildren ? handleToggleAccordion : handleClickLeaf}
      className={hasChildren ? styles.accordion : ''}
      id={category._id}
      data-db={category.escritorio}
    >
      {hasChildren && <FolderIcon className='uiIcon' />}
      <span
        className={`${styles.categoryName} ${isSelectable ? 'destination' : ''}`.trim()}
        onClick={isSelectable ? handleSelect : undefined}
      >
        {category.name}
      </span>
      {hasChildren && (
        <ul>
          {childCategories.map(childCat => (
            <CategoryItem
              key={childCat._id}
              category={childCat}
              allCategories={allCategories}
              onSelect={onSelect}
              currentCategoryId={currentCategoryId}
              isTopLevel={false}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function MoveOtherDeskForm ({ moveFormVisible, setMoveFormVisible, params }) {
  const visibleClass = moveFormVisible ? styles.flex : styles.hidden
  const moveFormRef = useRef()
  const { desktopName } = useParams()
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  useHideForms({ form: moveFormRef.current, setFormVisible: setMoveFormVisible })
  const topLevelCategoriesStore = useTopLevelCategoriesStore(state => state.topLevelCategoriesStore)
  const globalError = useGlobalStore(state => state.globalError)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)

  // Combinar top-level categories con las columnas para tener el árbol completo
  const allCategories = [...topLevelCategoriesStore, ...globalColumns]

  // Obtener la categoría actual del enlace a mover
  const currentCategoryId = Array.isArray(params)
    ? globalLinks.find(link => link._id === params[0])?.categoryId
    : params?.categoryId

  const selectDest = (event) => {
    event.stopPropagation?.()
    // El targetElement ahora es el span, el id está en el li padre
    const spanElement = event.currentTarget
    const liElement = spanElement.closest('li')
    const categoryId = liElement?.id
    const selectedCategory = allCategories.find(cat => cat._id === categoryId)
    console.log('📁 Categoría seleccionada como destino:', {
      id: categoryId,
      name: selectedCategory?.name,
      level: selectedCategory?.level,
      parentId: selectedCategory?.parentId
    })
    const destinations = document.querySelectorAll('.destination')
    destinations.forEach((destination) => {
      if (destination === spanElement) {
        destination.style.backgroundColor = 'var(--accentColor)'
        destination.classList.add('selected')
      } else {
        destination.style.backgroundColor = ''
        destination.classList.remove('selected')
      }
    })
  }

  const handleMove = async () => {
    setMoveFormVisible(false)
    const previousLinks = [...globalLinks]
    const linksToEdit = Array.isArray(params) ? params : [params._id]
    const firstLink = globalLinks.find(link => link._id === linksToEdit[0])
    const columnSelected = document.querySelector('.selected')

    if (!columnSelected) {
      toast('Selecciona una categoría de destino')
      return
    }

    // El span seleccionado está dentro del li que tiene el id
    const targetCategoryId = columnSelected.closest('li')?.id
    const sourceCategoryId = firstLink?.categoryId

    const newLinkBrothers = globalLinks.filter(link => link.categoryId === targetCategoryId)
    const oldLinkBrothers = globalLinks.filter(link =>
      link.categoryId === sourceCategoryId && !linksToEdit.includes(link._id)
    )

    let startingOrder = newLinkBrothers.length

    const updatedDesktopLinks = globalLinks.map(link => {
      if (linksToEdit.includes(link._id)) {
        return { ...link, categoryId: targetCategoryId, order: startingOrder++ }
      }
      return link
    }).toSorted((a, b) => (a.order - b.order))

    setGlobalLinks(updatedDesktopLinks)
    activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(updatedDesktopLinks))

    try {
      const movedItems = linksToEdit.map((linkId, index) => ({
        id: linkId,
        categoryId: targetCategoryId,
        order: newLinkBrothers.length + index
      }))

      const destinyItems = newLinkBrothers.map((link, index) => ({
        id: link._id,
        order: index,
        name: link.name,
        categoryId: link.categoryId
      }))

      const remainingItems = oldLinkBrothers.map((link, index) => ({
        id: link._id,
        order: index,
        name: link.name,
        categoryId: link.categoryId
      }))

      const items = [...movedItems, ...destinyItems, ...remainingItems]

      const response = await updateLink({ items })
      const { hasError, message } = handleResponseErrors(response)

      if (hasError) {
        setGlobalLinks(previousLinks)
        activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(previousLinks.toSorted((a, b) => (a.order - b.order))))
        toast(message)
      }
    } catch (error) {
      setGlobalLinks(previousLinks)
      activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(previousLinks.toSorted((a, b) => (a.order - b.order))))
      toast('Error al mover enlaces')
    }
  }

  return (
    <div ref={moveFormRef} id="menuMoveTo" className={visibleClass + ' ' + styles.menuMoveTo}>
      {globalError
        ? <p>Error al recuperar los datos</p>
        : (
          <>
            <p>Mover {params?.name}</p>
            <ul className={styles.destDeskMoveTo}>
              {topLevelCategoriesStore?.map(desk =>
                (
                  <CategoryItem
                    key={desk._id}
                    category={desk}
                    allCategories={allCategories}
                    onSelect={selectDest}
                    currentCategoryId={currentCategoryId}
                    isTopLevel={true}
                  />
                )

              )}
            </ul>
            <div className={styles.moveToControls}>
              <button id="acceptMove" onClick={handleMove}>Aceptar</button>
              <button onClick={() => { setMoveFormVisible(false) }} id="cancelMove">Cancelar</button>
            </div>
          </>
          )}
    </div>
  )
}
