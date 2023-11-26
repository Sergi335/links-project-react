import styles from './ContextualMenu.module.css'
import { useLinksStore } from '../store/links'
import { useColumnsStore } from '../store/columns'
import { useParams } from 'react-router-dom'
import { usePreferencesStore } from '../store/preferences'
import { moveLink } from '../services/dbQueries'
import { toast } from 'react-toastify'
import { EditIcon, FolderMoveIcon, TrashIcon } from './Icons/icons'

export default function ContextLinkMenu ({ visible, setVisible, points, params, setDeleteFormVisible, setEditFormVisible, setMoveFormVisible }) {
  const linksStore = useLinksStore(state => state.linksStore)
  const setLinksStore = useLinksStore(state => state.setLinksStore)
  const columnsStore = useColumnsStore(state => state.columnsStore)
  const { desktopName } = useParams()
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)

  const handleMoveClick = async (event) => {
    const orden = document.getElementById(event.target.id).childNodes.length
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
    // Error de red
    if (!response._id && !response.ok && response.error === undefined) {
      toast('Error de red')
      return
    }
    // Error http
    if (!response._id && !response.ok && response.status !== undefined) {
      toast(`${response.status}: ${response.statusText}`)
      return
    }
    // Error personalizado
    if (!response._id && response.error) {
      toast(`Error: ${response.error}`)
      return
    }
    const updatedDesktopLinks = linksStore.map(link => {
      if (link._id === params._id) {
      // Modifica la propiedad del elemento encontrado
        return { ...link, idpanel: event.target.id }
      }
      return link
    })
    setLinksStore(updatedDesktopLinks)
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
          <li onClick={handleMoveFormClick}>Mover a otro escritorio</li>
          {
            columnsStore.map(col => col._id === params.idpanel
              ? null
              : <li key={col._id} id={col._id} onClick={handleMoveClick}>{col.name}</li>)
          }
        </ul>
      </span>
      <span onClick={handleDeleteClick}><TrashIcon className='uiIcon-menu'/>Borrar</span>
    </div>
  )
}
