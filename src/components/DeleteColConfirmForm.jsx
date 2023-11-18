import { toast } from 'react-toastify'
import { useColumnsStore } from '../store/columns'
import { deleteColumn } from '../services/dbQueries'
import styles from './AddLinkForm.module.css'

export default function DeleteColConfirmForm ({ visible, setVisible, itemType = 'columna', params }) {
  const visibleClassName = visible ? styles.flex : styles.hidden
  const columnsStore = useColumnsStore(state => state.columnsStore)
  const setColumnsStore = useColumnsStore(state => state.setColumnsStore)

  const handleDeleteCol = async () => {
    const response = await deleteColumn(params._id)
    setVisible(false)
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
    const newList = [...columnsStore].filter(col => col._id !== params._id)
    setColumnsStore(newList)
  }

  return (
        <div className={`${visibleClassName} deskForm`}>
            <h2>{`Seguro que quieres borrar este ${itemType}`}</h2>
            <button id="confDeletedeskSubmit" type="submit" onClick={handleDeleteCol}>Si</button>
            <button id="noDeletedeskSubmit" type="submit" onClick={() => { setVisible(false) }}>No</button>
        </div>
  )
}
