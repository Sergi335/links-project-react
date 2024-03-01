import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { usePasteLink } from '../hooks/usePasteLink'
import { editColumn } from '../services/dbQueries'
import { handleResponseErrors } from '../services/functions'
import { useFormsStore } from '../store/forms'
import { useGlobalStore } from '../store/global'
import { usePreferencesStore } from '../store/preferences'
import styles from './ContextualColMenu.module.css'
import { ArrowDown } from './Icons/icons'

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
            <p><strong>Opciones Columna</strong></p>
            <p>{params.name}</p>
            <span onClick={() => setAddLinkFormVisible(true)}>Nuevo</span>
            <span onClick={() => { pasteLink() }}>Pegar</span>
            {/* <span>Renombrar</span> */}
            <span className={styles.moveTo}>Mover a<ArrowDown className={`${styles.rotate} uiIcon_small`}/>
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
            <span onClick={() => setDeleteColFormVisible(true)}>Borrar</span>
        </div>
  )
}
