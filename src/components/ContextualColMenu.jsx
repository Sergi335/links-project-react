import styles from './ContextualColMenu.module.css'
import { pasteLink } from '../services/pasteLinks'
import { moveColumn, deleteColumn } from '../services/functions'
import { useParams } from 'react-router-dom'
import { useLinksStore } from '../store/links'

export default function ContextualColMenu ({ visible, points, params, desktopColumns, setDesktopColumns, desktops, handleClick, handleEditable }) {
  const { desktopName } = useParams()
  const setLinksStore = useLinksStore(state => state.setLinksStore)
  const linksStore = useLinksStore(state => state.linksStore)

  const handleMoveCol = (desk) => {
    moveColumn(desktopName, desk, params._id)
    const newList = [...desktopColumns].filter(col => col._id !== params._id)
    setDesktopColumns(newList)
  }
  const handleDeleteCol = () => {
    deleteColumn(params._id)
    const newList = [...desktopColumns].filter(col => col._id !== params._id)
    setDesktopColumns(newList)
  }

  return (
        <div className={
            visible ? styles.flex : styles.hidden
          } style={{ left: points.x, top: points.y }}>
            <strong>Opciones Columna</strong>
            <span>{params.name}</span>
            <p onClick={handleClick}>Nuevo</p>
            <p onClick={() => { pasteLink({ params, linksStore, setLinksStore, desktopName }) }}>Pegar</p>
            <p onClick={handleEditable}>Renombrar</p>
            <span className={styles.moveTo}>Mover a
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
            <p onClick={handleDeleteCol}>Borrar</p>
        </div>
  )
}
