import { memo, useCallback, useMemo, useRef } from 'react'
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
const CategoryItem = memo(function CategoryItem ({ category, allCategories, onSelect, currentCategoryId, isTopLevel = false }) {
  console.log('render')

  const childCategories = useMemo(() =>
    allCategories.filter(cat => cat.parentId === category._id),
  [allCategories, category._id]
  )
  const hasChildren = childCategories.length > 0
  const isSelectable = !isTopLevel

  const togglePanel = useCallback((liElement) => {
    const panel = liElement.querySelector(':scope > ul')
    if (!panel) return

    const isExpanding = !panel.style.maxHeight

    if (isExpanding) {
      panel.style.maxHeight = panel.scrollHeight + 'px'
      let parentLi = liElement.parentElement?.closest('li')
      while (parentLi) {
        const parentPanel = parentLi.querySelector(':scope > ul')
        if (parentPanel && parentPanel.style.maxHeight) {
          parentPanel.style.maxHeight = parentPanel.scrollHeight + panel.scrollHeight + 'px'
        }
        parentLi = parentLi.parentElement?.closest('li')
      }
    } else {
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
  }, [])

  const handleToggleAccordion = useCallback((event) => {
    event.stopPropagation()
    if (isSelectable) {
      const spanElement = event.currentTarget.querySelector(':scope > span.destination')
      if (spanElement) {
        onSelect({ currentTarget: spanElement })
      }
    }
    togglePanel(event.currentTarget)
  }, [isSelectable, onSelect, togglePanel])

  const handleSelect = useCallback((event) => {
    event.stopPropagation()
    onSelect(event)
    if (hasChildren) {
      const liElement = event.currentTarget.closest('li')
      togglePanel(liElement)
    }
  }, [hasChildren, onSelect, togglePanel])

  const handleClickLeaf = useCallback((event) => {
    if (isSelectable) {
      const spanElement = event.currentTarget.querySelector(':scope > span.destination')
      if (spanElement) {
        onSelect({ currentTarget: spanElement })
      }
    }
  }, [isSelectable, onSelect])

  if (category._id === currentCategoryId) return null

  return (
    <li
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
})

function MoveOtherDeskForm ({ moveFormVisible, setMoveFormVisible, params }) {
  const visibleClass = moveFormVisible ? styles.flex : styles.hidden
  const moveFormRef = useRef()
  const { desktopName } = useParams()

  // Selectores más específicos para evitar re-renders innecesarios
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const topLevelCategoriesStore = useTopLevelCategoriesStore(state => state.topLevelCategoriesStore)
  const globalError = useGlobalStore(state => state.globalError)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)

  useHideForms({ form: moveFormRef.current, setFormVisible: setMoveFormVisible })

  // Memoizar para evitar recálculos innecesarios
  const allCategories = useMemo(() =>
    [...topLevelCategoriesStore, ...globalColumns],
  [topLevelCategoriesStore, globalColumns]
  )

  const currentCategoryId = useMemo(() =>
    Array.isArray(params)
      ? globalLinks.find(link => link._id === params[0])?.categoryId
      : params?.categoryId,
  [params, globalLinks]
  )

  const selectDest = useCallback((event) => {
    const spanElement = event.currentTarget
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
  }, [])

  const handleMove = useCallback(async () => {
    setMoveFormVisible(false)
    const previousLinks = [...globalLinks]
    const linksToEdit = Array.isArray(params) ? params : [params._id]
    const firstLink = globalLinks.find(link => link._id === linksToEdit[0])
    const columnSelected = document.querySelector('.selected')

    if (!columnSelected) {
      toast('Selecciona una categoría de destino')
      return
    }

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
  }, [globalLinks, params, setGlobalLinks, activeLocalStorage, desktopName, setMoveFormVisible])

  // Si no está visible, no renderizar el contenido
  if (!moveFormVisible) {
    return <div ref={moveFormRef} id="menuMoveTo" className={styles.hidden} />
  }

  return (
    <div ref={moveFormRef} id="menuMoveTo" className={visibleClass + ' ' + styles.menuMoveTo}>
      {globalError
        ? <p>Error al recuperar los datos</p>
        : (
          <>
            <p>Mover {params?.name}</p>
            <ul className={styles.destDeskMoveTo}>
              {topLevelCategoriesStore?.map(desk => (
                <CategoryItem
                  key={desk._id}
                  category={desk}
                  allCategories={allCategories}
                  onSelect={selectDest}
                  currentCategoryId={currentCategoryId}
                  isTopLevel={true}
                />
              ))}
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

export default memo(MoveOtherDeskForm)
