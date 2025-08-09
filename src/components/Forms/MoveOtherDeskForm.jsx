import { useRef } from 'react'
import FolderIcon from '../Icons/folder'
import styles from './MoveOtherDeskForm.module.css'
// import { useLinksStore } from '../../store/links'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useHideForms from '../../hooks/useHideForms'
import { editLink, getLinksCount, moveMultipleLinks } from '../../services/dbQueries'
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
  const handleMove = async () => {
    const columnSelected = document.querySelector('.selected')
    const count = await getLinksCount({ categoryId: columnSelected.id })
    if (Array.isArray(params)) {
      console.log('Multiple links')
      const updatedDesktopLinks = globalLinks.map(link => {
        if (params.includes(link._id)) {
          // Modifica la propiedad del elemento encontrado
          return { ...link, categoryId: columnSelected.id, orden: count } // orden!!
        }
        return link
      }).toSorted((a, b) => (a.orden - b.orden))
      setGlobalLinks(updatedDesktopLinks)
      setMoveFormVisible(false)
      const body = {
        destinationCategoryId: columnSelected.id,
        links: params,
        previousCategoryId: params[0].categoryId // multiplesources!!
      }
      const response = await moveMultipleLinks(body)

      const { hasError, message } = handleResponseErrors(response)
      if (hasError) {
        toast(message)
        return
      }
      toast('Enlaces movidos correctamente')
      activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(updatedDesktopLinks.toSorted((a, b) => (a.orden - b.orden))))
    } else {
      const updatedDesktopLinks = globalLinks.map(link => {
        if (link._id === params._id) {
          // Modifica la propiedad del elemento encontrado
          return { ...link, categoryId: columnSelected.id, orden: count }
        }
        return link
      }).toSorted((a, b) => (a.orden - b.orden))
      setGlobalLinks(updatedDesktopLinks)
      setMoveFormVisible(false)
      // const body = {
      //   id: params._id,
      //   idpanelOrigen: params.idpanel,
      //   fields: {
      //     idpanel: columnSelected.id,
      //     panel: columnSelected.innerText,
      //     name: params.name,
      //     orden: count,
      //     escritorio: columnSelected.attributes[1].nodeValue
      //   }
      // }
      const response = await editLink({
        id: params._id,
        oldCategoryId: params.idpanel,
        categoryId: columnSelected.id,
        name: params.name,
        orden: count
      })

      const { hasError, message } = handleResponseErrors(response)
      if (hasError) {
        toast(message)
        return
      }
      toast('Enlace movido correctamente')
      activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(updatedDesktopLinks.toSorted((a, b) => (a.orden - b.orden))))
      // Modificar el localstorage de destino
    }
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
