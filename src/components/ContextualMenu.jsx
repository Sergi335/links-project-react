import styles from './ContextualMenu.module.css'
export default function ContextLinkMenu ({ visible, points, params, handleClick, handleDeleteClick, columnas, handleMoveFormClick, desktopLinks, setDesktopLinks }) {
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
        console.log(data)
        const updatedDesktopLinks = desktopLinks.map(link => {
          if (link._id === params._id) {
            // Modifica la propiedad del elemento encontrado
            return { ...link, idpanel: event.target.id }
          }
          return link
        })
        setDesktopLinks(updatedDesktopLinks)
      })
      .catch(err => {
        console.log(err)
      })
  }
  return (
    <div className={
      visible ? styles.flex : styles.hidden
    } style={{ left: points.x, top: points.y }}>
        <strong>Opciones Enlace</strong>
        <span>{params.name}</span>
        <p onClick={handleClick}>Editar</p>
        <span className={styles.moveTo}>Mover a
          <ul className={styles.moveList}>
            <li onClick={handleMoveFormClick}>Mover a otro escritorio</li>
            {
              columnas.map(col => col._id === params.idpanel
                ? (
                    null
                  )
                : <li key={col._id} id={col._id} onClick={handleMoveClick}>{col.name}</li>)
            }
          </ul>
        </span>
        <p onClick={handleDeleteClick}>Borrar</p>
    </div>
  )
}
