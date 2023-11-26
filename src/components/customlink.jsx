import { useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styles from './customlink.module.css'
import { ArrowDown, MaximizeIcon } from './Icons/icons'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useFormsStore } from '../store/forms'

export default function CustomLink ({ data, idpanel, className }) {
  const link = data.link || data.activeLink
  const setContextMenuVisible = useFormsStore(state => state.setContextMenuVisible)
  const setPoints = useFormsStore(state => state.setPoints)
  const setActiveLink = useFormsStore(state => state.setActiveLink)
  const setActiveElement = useFormsStore(state => state.setActiveElement)
  const controlStyle = className === 'searchResult' ? { width: 'auto', position: 'relative', top: '25%' } : {}
  const linkStyle = className === 'searchResult' ? { flexWrap: 'wrap', height: '77px' } : {}
  const anchorStyle = className === 'searchResult' ? { height: '20px', paddingTop: '10px' } : {}
  // Ref del link
  const linkRef = useRef(null)

  const handleContextMenu = useCallback((e) => {
    e.preventDefault()
    setPoints({ x: e.pageX, y: e.pageY })
    setContextMenuVisible(true)
    setActiveLink(link)
    setActiveElement(linkRef.current)
  }, [link, setPoints, setContextMenuVisible, setActiveLink, linkRef])

  const toggleLinkHeight = (e) => {
    const linkDiv = e.currentTarget.parentNode.parentNode
    const anchor = linkDiv.childNodes[0]
    linkDiv.classList.toggle(styles.div_open)
    anchor.classList.toggle(styles.link_open)
  }

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
    transform: CSS.Transform.toString(transform),
    ...linkStyle
  }
  if (isDragging) {
    return (
      <div ref={setNodeRef}
          style={style}
          className={styles.link_dragged} id={link._id}>
        </div>
    )
  }
  return (
      <>
        <div ref={setNodeRef}
          style={{ style }}
          {...attributes}
          {...listeners} className={isDragging ? styles.link_dragged : styles.link} id={link._id} data-orden={link.orden} onContextMenu={(e) => handleContextMenu(e)}>
          <a ref={linkRef} href={link.URL} style={ anchorStyle } target='_blank' rel='noreferrer' title={link.name}>
            <img src={link.imgURL} alt={`favicon of ${link.name}`} />
            <span>{link.name}</span>
            {
              className !== 'searchResult' && <span className={styles.description}>{link.description}</span>
            }
          </a>
          {
            className !== 'searchResult' && (
              <div className={styles.lcontrols} style={controlStyle}>
                <button className='buttonIcon'>
                  <Link to={`/desktop/link/${link._id}`} state={link._id}>
                    <MaximizeIcon />
                  </Link>
                  </button>
                  {
                    className !== 'searchResult' && (<button className='buttonIcon' onClick={toggleLinkHeight}><ArrowDown /></button>)
                  }

                </div>
            )
          }

        {
          className === 'searchResult' && (
            <div className={styles.additionalInfo}>
              <span>Escritorio: {link.escritorio}</span>
              <span>Panel: {link.panel}</span>
              {
                link.description !== 'Description' ? <span>Descripción: {link.description}</span> : null
              }
            </div>
          )
        }
        </div>
      </>
  )
}
