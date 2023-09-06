import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './customlink.module.css'
import { MaximizeIcon } from './Icons/icons'
import ContextLinkMenu from './ContextualMenu'
import EditLinkForm from './editlinkform'
import DeleteLinkForm from './DeleteLinkForm'
import MoveOtherDeskForm from './MoveOtherDeskForm'

export default function CustomLink ({ data, idpanel, columnas }) {
  const { link } = data
  const [visible, setVisible] = useState(false)
  const [points, setPoints] = useState({ x: 0, y: 0 })
  const [formVisible, setFormVisible] = useState(false)
  const [deleteFormVisible, setDeleteFormVisible] = useState(false)
  const [moveFormVisible, setMoveFormVisible] = useState(false)
  const linkRef = useRef(null)
  const [name, setName] = useState(link.name)
  const [url, setUrl] = useState(link.URL)
  const [, setDescription] = useState(link.description)
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
  const handleClick = (event) => {
    if (formVisible === false) {
      setFormVisible(true)
    }
  }
  const handleDeleteClick = (event) => {
    if (deleteFormVisible === false) {
      setDeleteFormVisible(true)
    }
  }
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
            ? <ContextLinkMenu visible={visible} points={points} params={link} handleClick={handleClick} handleDeleteClick={handleDeleteClick} columnas={columnas} moveFormVisible={moveFormVisible} handleMoveFormClick={handleMoveFormClick}/>
            : null
        }
        {
          formVisible
            ? <EditLinkForm formVisible={formVisible} setFormVisible={setFormVisible} params={link} setName={setName} setUrl={setUrl} setDescription={setDescription}/>
            : null
        }
        {
          deleteFormVisible
            ? <DeleteLinkForm deleteFormVisible={deleteFormVisible} setDeleteFormVisible={setDeleteFormVisible} params={link} idpanel={idpanel} linkRef={linkRef}/>
            : null
        }
        {
          moveFormVisible
            ? <MoveOtherDeskForm moveFormVisible={moveFormVisible} setMoveFormVisible={setMoveFormVisible} params={link} />
            : null
        }
      </>
  )
}
