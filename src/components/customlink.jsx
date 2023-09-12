import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './customlink.module.css'
import { MaximizeIcon } from './Icons/icons'
import ContextLinkMenu from './ContextualMenu'
import EditLinkForm from './editlinkform'
import DeleteLinkForm from './DeleteLinkForm'
import MoveOtherDeskForm from './MoveOtherDeskForm'

export default function CustomLink ({ data, idpanel, columnas, desktopLinks, setDesktopLinks }) {
  const { link } = data
  // Visibilidad y posicion del menu contextual
  const [visible, setVisible] = useState(false)
  const [points, setPoints] = useState({ x: 0, y: 0 })
  // Visibilidad de los forms
  const [formVisible, setFormVisible] = useState(false)
  const [deleteFormVisible, setDeleteFormVisible] = useState(false)
  const [moveFormVisible, setMoveFormVisible] = useState(false)
  // Ref del link
  const linkRef = useRef(null)
  // estados
  const [name, setName] = useState(link.name)
  const [url, setUrl] = useState(link.URL)
  const [, setDescription] = useState(link.description)
  // Ocultar context menu
  useEffect(() => {
    const handleClick = (event) => {
      setVisible(false)
    }
    const handleContextOutside = (event) => {
      if (!linkRef.current.contains(event.target)) {
        setVisible(false)
      }
    }
    window.addEventListener('contextmenu', handleContextOutside)
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('contextmenu', handleContextOutside)
      window.removeEventListener('click', handleClick)
    }
  }, [])
  // Mostrar context menu
  const handleContextMenu = (event) => {
    event.preventDefault()
    if (visible === false) {
      setVisible(true)
    }
    setPoints({
      x: event.pageX,
      y: event.pageY
    })
  }
  // Mostrar form
  const handleClick = (event) => {
    if (formVisible === false) {
      setFormVisible(true)
    }
  }
  // Mostrar form
  const handleDeleteClick = (event) => {
    if (deleteFormVisible === false) {
      setDeleteFormVisible(true)
    }
  }
  // Mostrar form
  const handleMoveFormClick = () => {
    if (moveFormVisible === false) {
      setMoveFormVisible(true)
    }
  }
  return (
      <>
        <div ref={linkRef} onContextMenu={handleContextMenu} className={styles.link} id={link._id}>
          <a href={url} target='_blank' rel='noreferrer'>
          <img src={link.imgURL} alt={`favicon of ${link.name}`} />
            <span>{name}</span>
          </a>
          <div className={styles.lcontrols}>
          <Link to={`/link/${link._id}`} state={link._id}>
            <MaximizeIcon />
          </Link>
          </div>
        </div>
        {
          visible
            ? <ContextLinkMenu
                visible={visible}
                points={points}
                params={link}
                handleClick={handleClick}
                handleDeleteClick={handleDeleteClick}
                columnas={columnas}
                moveFormVisible={moveFormVisible}
                handleMoveFormClick={handleMoveFormClick}
                desktopLinks={desktopLinks}
                setDesktopLinks={setDesktopLinks}/>
            : null
        }
        {
          formVisible
            ? <EditLinkForm
                formVisible={formVisible}
                setFormVisible={setFormVisible}
                params={link}
                setName={setName}
                setUrl={setUrl}
                setDescription={setDescription}/>
            : null
        }
        {
          deleteFormVisible
            ? <DeleteLinkForm
                deleteFormVisible={deleteFormVisible}
                setDeleteFormVisible={setDeleteFormVisible}
                params={link}
                idpanel={idpanel}
                desktopLinks={desktopLinks}
                setDesktopLinks={setDesktopLinks}/>
            : null
        }
        {
          moveFormVisible
            ? <MoveOtherDeskForm
                moveFormVisible={moveFormVisible}
                setMoveFormVisible={setMoveFormVisible}
                params={link}
                desktopLinks={desktopLinks}
                setDesktopLinks={setDesktopLinks}/>
            : null
        }
      </>
  )
}
