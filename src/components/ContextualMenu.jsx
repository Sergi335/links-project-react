import styles from './ContextualMenu.module.css'
import { useParams } from 'react-router-dom'
import { usePreferencesStore } from '../store/preferences'
import { moveLink } from '../services/dbQueries'
import { toast } from 'react-toastify'
import { EditIcon, FolderMoveIcon, TrashIcon } from './Icons/icons'
import { handleResponseErrors } from '../services/functions'
import { useGlobalStore } from '../store/global'

export default function ContextLinkMenu ({ visible, setVisible, points, params, setDeleteFormVisible, setEditFormVisible, setMoveFormVisible }) {
  const { desktopName } = useParams()
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const desktopColumns = globalColumns.filter(column => column.escritorio.toLowerCase() === desktopName).toSorted((a, b) => a.orden - b.orden)

  const handleMoveClick = async (event) => {
    const orden = document.getElementById(event.target.id)?.childNodes.length ? document.getElementById(event.target.id).childNodes?.length : 0
    const updatedDesktopLinks = globalLinks.map(link => {
      if (link._id === params._id) {
      // Modifica la propiedad del elemento encontrado
        return { ...link, idpanel: event.target.id, panel: event.target.innerText, orden }
      }
      return link
    }).toSorted((a, b) => (a.orden - b.orden))
    setGlobalLinks(updatedDesktopLinks)

    const body = {
      id: params._id,
      idpanelOrigen: params.idpanel,
      fields: {
        idpanel: event.target.id,
        panel: event.target.innerText,
        orden
      }
    }
    const response = await moveLink(body)

    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
      return
    }

    activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(updatedDesktopLinks.toSorted((a, b) => (a.orden - b.orden))))
  }
  const handleEditClick = () => {
    setEditFormVisible(true)
    setVisible(false)
  }
  const handleDeleteClick = () => {
    setDeleteFormVisible(true)
    setVisible(false)
  }
  const handleMoveFormClick = () => {
    setMoveFormVisible(true)
    setVisible(false)
  }
  return (
    <div id='contextLinkMenu' className={visible ? styles.flex : styles.hidden} style={{ left: points.x, top: points.y }}>
      <p><strong>Opciones Enlace</strong></p>
      <p>{params.name}</p>
      <span onClick={handleEditClick}><EditIcon className='uiIcon-menu'/>Editar</span>
      <span className={styles.moveTo}><FolderMoveIcon className='uiIcon-menu'/>Mover a
        <ul className={styles.moveList}>
          <li onClick={handleMoveFormClick}><span>Mover a otro escritorio</span></li>
          {
            desktopColumns.map(col => col._id === params.idpanel
              ? null
              : <li key={col._id} onClick={handleMoveClick}><span id={col._id}>{col.name}</span></li>)
          }
        </ul>
      </span>
      <span onClick={handleDeleteClick}><TrashIcon className='uiIcon-menu'/>Borrar</span>
    </div>
  )
}
