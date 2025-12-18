import { useRef } from 'react'
import FolderIcon from '../Icons/folder'
import styles from './MoveOtherDeskForm.module.css'
// import { useLinksStore } from '../../store/links'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useHideForms from '../../hooks/useHideForms'
import { updateLink } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { usePreferencesStore } from '../../store/preferences'
import { useTopLevelCategoriesStore } from '../../store/useTopLevelCategoriesStore'
// import useDbQueries from '../../hooks/useDbQueries'
import { useGlobalStore } from '../../store/global'

export default function MoveOtherDeskForm ({ moveFormVisible, setMoveFormVisible, params }) {
  const visibleClass = moveFormVisible ? styles.flex : styles.hidden
  const moveFormRef = useRef()
  // const setLinksStore = useLinksStore(state => state.setLinksStore)
  // const linksStore = useLinksStore(state => state.linksStore)
  const { desktopName } = useParams()
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  useHideForms({ form: moveFormRef.current, setFormVisible: setMoveFormVisible })
  const topLevelCategoriesStore = useTopLevelCategoriesStore(state => state.topLevelCategoriesStore)
  const globalError = useGlobalStore(state => state.globalError)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)

  const handleResizeSublist = (event) => {
    const panel = event.currentTarget.childNodes[2]
    if (event.target !== event.currentTarget && event.target.nodeName !== 'path') {
      event.stopPropagation()
      return
    }
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px'
    }
  }
  const selectDest = (event) => {
    event.target.classList.add('selected')
    const destinations = document.querySelectorAll('.destination')
    destinations.forEach((destination) => {
      if (destination === event.target) {
        destination.style.backgroundColor = 'var(--accentColor)'
        destination.classList.add('selected')
      } else {
        destination.style.backgroundColor = ''
        destination.classList.remove('selected')
      }
    })
  }
  const handleMove = async (event) => {
    const previousLinks = [...globalLinks]
    const linksToEdit = Array.isArray(params) ? params : [params._id]
    const firstLink = globalLinks.find(link => link._id === linksToEdit[0])
    const columnSelected = document.querySelector('.selected')

    // Obtener categorías ANTES de cualquier actualización
    const targetCategoryId = columnSelected.id
    const sourceCategoryId = firstLink?.categoryId

    const newLinkBrothers = globalLinks.filter(link => link.categoryId === targetCategoryId)
    const oldLinkBrothers = globalLinks.filter(link =>
      link.categoryId === sourceCategoryId && !linksToEdit.includes(link._id) // ⬅️ Excluir los que se van a mover
    )

    let startingOrder = newLinkBrothers.length

    // Actualización optimista del estado
    const updatedDesktopLinks = globalLinks.map(link => {
      if (linksToEdit.includes(link._id)) {
        return { ...link, categoryId: targetCategoryId, order: startingOrder++ }
      }
      return link
    }).toSorted((a, b) => (a.order - b.order))

    setGlobalLinks(updatedDesktopLinks)
    activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(updatedDesktopLinks))

    try {
      // Links que se mueven
      const movedItems = linksToEdit.map((linkId, index) => ({
        id: linkId,
        categoryId: targetCategoryId,
        order: newLinkBrothers.length + index
      }))

      // Links en la categoría destino (reordenar)
      const destinyItems = newLinkBrothers.map((link, index) => ({
        id: link._id,
        order: index,
        name: link.name,
        categoryId: link.categoryId
      }))

      // Links que quedan en la categoría origen (reordenar)
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
        // Rollback en caso de error
        setGlobalLinks(previousLinks)
        activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(previousLinks.toSorted((a, b) => (a.order - b.order))))
        toast(message)
      }
    } catch (error) {
      // Rollback en caso de error de red
      setGlobalLinks(previousLinks)
      activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(previousLinks.toSorted((a, b) => (a.order - b.order))))
      toast('Error al mover enlaces')
    }

    setMoveFormVisible(false)
  }

  return (
    <div ref={moveFormRef} id="menuMoveTo" className={visibleClass + ' ' + styles.menuMoveTo}>
        {
             (
                globalError
                  ? <p>Error al recuperar los datos</p>
                  : (<>
                    <p>Mover {params?.name}</p>
                    <ul className={styles.destDeskMoveTo}>
                    {
                          topLevelCategoriesStore?.map(desk => desk.name !== params?.escritorio
                            ? (
                            <li key={desk._id} onClick={handleResizeSublist} className={styles.accordion} id={desk.name}>
                                <FolderIcon className='uiIcon'/>
                                {desk.displayName}
                                    <ul>
                                        {
                                          globalColumns.map(col => (
                                            col.parentId === desk._id
                                              ? <li key={col._id} id={col._id} data-db={col.escritorio} className='destination' onClick={selectDest}>{col.name}</li>
                                              : null
                                          ))
                                        }
                                    </ul>
                            </li>
                              )
                            : null)
                    }
                    </ul>
                    <div className={styles.moveToControls}>
                        <button id="acceptMove" onClick={handleMove}>Aceptar </button>
                        <button onClick={() => { setMoveFormVisible(false) }} id="cancelMove">Cancelar</button>
                    </div>
                  </>)
              )
        }
    </div>
  )
}
