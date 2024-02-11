import styles from './ContextualColMenu.module.css'
import { toast } from 'react-toastify'
import { editColumn } from '../services/dbQueries'
import { useParams } from 'react-router-dom'
import { useGlobalStore } from '../store/global'
import { usePreferencesStore } from '../store/preferences'
import { useFormsStore } from '../store/forms'
import { AddPlusIcon, EditTextIcon, FolderMoveIcon, PasteLinkIcon, TrashIcon } from './Icons/icons'
import { usePasteLink } from '../hooks/usePasteLink'
import { handleResponseErrors } from '../services/functions'

export default function ContextualColMenu ({ visible, points, params, desktops, setAddLinkFormVisible }) {
  const { desktopName } = useParams()
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const setDeleteColFormVisible = useFormsStore(state => state.setDeleteColFormVisible)
  const { pasteLink } = usePasteLink({ params, desktopName, activeLocalStorage })

  const handleMoveCol = async (desk) => {
    const updatedState = [...globalColumns]
    const elementIndex = updatedState.findIndex(element => element._id === params._id)
    const objeto = updatedState[elementIndex]
    updatedState[elementIndex] = { ...objeto, escritorio: desk }

    const newLinksState = [...globalLinks]
    newLinksState.forEach(link => {
      if (link.idpanel === params._id) {
        link.escritorio = desk
      }
    })

    setGlobalLinks(newLinksState)
    setGlobalColumns(updatedState)

    try {
      const response = await editColumn({ oldDesktop: desktopName, newDesktop: desk, idPanel: params._id })
      const { hasError, message } = handleResponseErrors(response)
      if (hasError) {
        throw new Error(message)
      }
      toast('Movido a ' + desk)
    } catch (error) {
      toast(error.message)
      // Revertir los cambios en caso de error
      setGlobalLinks(globalLinks)
      setGlobalColumns(globalColumns)
    }
  }

  return (
        <div className={
            visible ? styles.flex : styles.hidden
          } style={{ left: points.x, top: points.y }}>
            <p>Opciones Columna</p>
            <p>{params.name}</p>
            <span onClick={() => setAddLinkFormVisible(true)}><AddPlusIcon className='uiIcon-menu'/>Nuevo</span>
            <span onClick={() => { pasteLink() }}><PasteLinkIcon className='uiIcon-menu'/>Pegar</span>
            <span><EditTextIcon className='uiIcon-menu'/>Renombrar</span>
            <span className={styles.moveTo}><FolderMoveIcon className='uiIcon-menu'/>Mover a
              <ul className={styles.moveList}>
                {
                  desktops.map(desk => desk.name === desktopName
                    ? (
                        null
                      )
                    : <li key={desk._id} id={desk._id} onClick={() => { handleMoveCol(desk.name) }}>{desk.displayName}</li>)
                }
              </ul>
            </span>
            <span onClick={() => setDeleteColFormVisible(true)}><TrashIcon className='uiIcon-menu'/>Borrar</span>
        </div>
  )
}
