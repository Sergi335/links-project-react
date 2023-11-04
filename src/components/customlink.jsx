import { useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styles from './customlink.module.css'
import { MaximizeIcon } from './Icons/icons'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useFormsStore } from '../store/forms'

export default function CustomLink ({ data, idpanel }) {
  const link = data.link || data.activeLink
  const setContextMenuVisible = useFormsStore(state => state.setContextMenuVisible)
  const setPoints = useFormsStore(state => state.setPoints)
  const setActiveLink = useFormsStore(state => state.setActiveLink)
  const setActiveElement = useFormsStore(state => state.setActiveElement)

  // Ref del link
  const linkRef = useRef(null)

  const handleContextMenu = useCallback((e) => {
    e.preventDefault()
    setPoints({ x: e.pageX, y: e.pageY })
    setContextMenuVisible(true)
    setActiveLink(link)
    setActiveElement(linkRef.current)
  }, [link, setPoints, setContextMenuVisible, setActiveLink, linkRef])
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: link._id,
    data: {
      type: 'link',
      link
    }
  })
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }
  if (isDragging) {
    return (
      <div ref={setNodeRef}
          style={style}
          className={styles.link} id={link._id}>
        </div>
    )
  }
  return (
      <>
        <div ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners} className={isDragging ? styles.link_dragged : styles.link} id={link._id} onContextMenu={(e) => handleContextMenu(e)}>
          <a ref={linkRef} href={link.URL} target='_blank' rel='noreferrer' title={link.name}>
            <img src={link.imgURL} alt={`favicon of ${link.name}`} />
            <span>{link.name}</span>
          </a>
          <div className={styles.lcontrols}>
            <Link to={`/link/${link._id}`} state={link._id}>
              <MaximizeIcon />
            </Link>
          </div>
        </div>
      </>
  )
}
