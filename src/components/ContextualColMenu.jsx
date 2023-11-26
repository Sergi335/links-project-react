import styles from './ContextualColMenu.module.css'
import { toast } from 'react-toastify'
import { pasteLink } from '../services/pasteLinks'
import { moveColumn } from '../services/dbQueries'
import { useParams } from 'react-router-dom'
import { useLinksStore } from '../store/links'
import { usePreferencesStore } from '../store/preferences'
import { useFormsStore } from '../store/forms'
import { AddPlusIcon, EditTextIcon, FolderMoveIcon, PasteLinkIcon, TrashIcon } from './Icons/icons'

export default function ContextualColMenu ({ visible, points, params, desktopColumns, setDesktopColumns, desktops, setAddLinkFormVisible }) {
  const { desktopName } = useParams()
  const setLinksStore = useLinksStore(state => state.setLinksStore)
  const linksStore = useLinksStore(state => state.linksStore)
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const setDeleteColFormVisible = useFormsStore(state => state.setDeleteColFormVisible)

  const handleMoveCol = async (desk) => {
    const response = await moveColumn(desktopName, desk, params._id)
    // Error de red
    if (!response.response?.length && !response.ok && response.error === undefined) {
      toast('Error de red')
      return
    }
    // Error http
    if (!response.response?.length && !response.ok && response.status !== undefined) {
      toast(`${response.status}: ${response.statusText}`)
      return
    }
    // Error personalizado
    if (!response.response?.length && response.error) {
      toast(`Error: ${response.error}`)
      return
    }
    const newList = [...desktopColumns].filter(col => col._id !== params._id)
    setDesktopColumns(newList)
    toast(response.response.message)
  }

  return (
        <div className={
            visible ? styles.flex : styles.hidden
          } style={{ left: points.x, top: points.y }}>
            <p>Opciones Columna</p>
            <p>{params.name}</p>
            <span onClick={() => setAddLinkFormVisible(true)}><AddPlusIcon className='uiIcon-menu'/>Nuevo</span>
            <span onClick={() => { pasteLink({ params, linksStore, setLinksStore, desktopName, activeLocalStorage }) }}><PasteLinkIcon className='uiIcon-menu'/>Pegar</span>
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
