import styles from './ContextualMenu.module.css'
import { useLinksStore } from '../store/links'
import { useColumnsStore } from '../store/columns'
import { useParams } from 'react-router-dom'

export default function ContextLinkMenu ({ visible, setVisible, points, params, setDeleteFormVisible, setEditFormVisible, setMoveFormVisible }) {
  const linksStore = useLinksStore(state => state.linksStore)
  const setLinksStore = useLinksStore(state => state.setLinksStore)
  const columnsStore = useColumnsStore(state => state.columnsStore)
  const { desktopName } = useParams()

  const handleMoveClick = (event) => {
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
    fetch('http://localhost:3003/api/links', {
      method: 'PATCH',
      headers: {
        'Content-type': 'Application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        const updatedDesktopLinks = linksStore.map(link => {
          if (link._id === params._id) {
          // Modifica la propiedad del elemento encontrado
            return { ...link, idpanel: event.target.id }
          }
          return link
        })
        setLinksStore(updatedDesktopLinks)
        localStorage.setItem(`${desktopName}links`, JSON.stringify(updatedDesktopLinks.toSorted((a, b) => (a.orden - b.orden))))
      })
      .catch(err => {
        console.log(err)
      })
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
      <strong>Opciones Enlace</strong>
      <span>{params.name}</span>
      <p onClick={handleEditClick}>Editar</p>
      <span className={styles.moveTo}>Mover a
        <ul className={styles.moveList}>
          <li onClick={handleMoveFormClick}>Mover a otro escritorio</li>
          {
            columnsStore.map(col => col._id === params.idpanel
              ? null
              : <li key={col._id} id={col._id} onClick={handleMoveClick}>{col.name}</li>)
          }
        </ul>
      </span>
      <p onClick={handleDeleteClick}>Borrar</p>
    </div>
  )
}
