import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFormsStore } from '../store/forms'
import { useLinksStore } from '../store/links'
import { usePreferencesStore } from '../store/preferences'
import { ArrowDown, MaximizeIcon } from './Icons/icons'
import styles from './customlink.module.css'

export default function CustomLink ({ data, className, desktopName }) {
  const link = data.link || data.activeLink
  const [linkSelectMode, setLinkSelectMode] = useState(false)
  // Ref del link y descripción
  const linkRef = useRef(null)
  const linkDesc = useRef(null)
  const selectModeGlobal = usePreferencesStore(state => state.selectModeGlobal)
  const columnSelectModeId = usePreferencesStore(state => state.columnSelectModeId)
  const selectedLinks = usePreferencesStore(state => state.selectedLinks)
  const setSelectedLinks = usePreferencesStore(state => state.setSelectedLinks)
  const setContextMenuVisible = useFormsStore(state => state.setContextMenuVisible)
  const setPoints = useFormsStore(state => state.setPoints)
  const setActiveLink = useFormsStore(state => state.setActiveLink)
  const setActiveElement = useFormsStore(state => state.setActiveElement)
  const pastedLinkId = useLinksStore(state => state.pastedLinkId)
  const setPastedLinkId = useLinksStore(state => state.setPastedLinkId)

  useEffect(() => {
    if (columnSelectModeId.includes(link.categoryId)) {
      setLinkSelectMode(true) // no estamos comprobando el idpanel de los que quedan
    } else {
      setLinkSelectMode(false)
    }
  }, [selectModeGlobal])

  const handleContextMenu = (e) => {
    e.preventDefault()
    setPoints({ x: e.pageX, y: e.pageY })
    setContextMenuVisible(true)
    setActiveLink(link)
    setActiveElement(linkRef.current)
  }

  const handleHeightChange = (e) => {
    const rotator = e.currentTarget
    const currentLink = document.getElementById(link._id)
    currentLink.classList.toggle('active')
    rotator.classList.toggle(styles.rotate)
    linkDesc.current.classList.toggle(styles.link_open)
    linkDesc.current.childNodes[0].classList.toggle(styles.fade)
  }

  const handleSelectChange = (e) => {
    const linkId = e.currentTarget.parentNode.parentNode.id
    // //console.log('🚀 ~ handleSelectChange ~ linkId:', linkId)
    if (selectedLinks.includes(linkId)) {
      const index = selectedLinks.findIndex((id) => id === linkId)
      const newState = [...selectedLinks]
      newState.splice(index, 1)
      setSelectedLinks(newState)
      if (e.currentTarget.parentNode.parentNode.classList.contains('active')) {
        e.currentTarget.parentNode.parentNode.classList.remove('active')
      }
    } else {
      setSelectedLinks([...selectedLinks, linkId])
      if (!e.currentTarget.parentNode.parentNode.classList.contains('active')) {
        e.currentTarget.parentNode.parentNode.classList.add('active')
      }
    }
  }

  useEffect(() => {
    if (pastedLinkId.includes(link._id)) {
      linkRef.current?.parentNode.classList.add(`${styles.animated_paste}`)
      setTimeout(() => {
        linkRef.current?.parentNode.classList.remove(`${styles.animated_paste}`)
      }, 4000)
      setPastedLinkId([])
    }
  }, [])

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

  // Este es el que crea el espacio entre los items, no el que flota pegado al raton
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={styles.link_dragged} id={link._id}>
      </div>
    )
  }

  return (
        <div ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          id={link._id}
          className={`${styles.link} ${className !== undefined ? className : ''} link`}
          data-order={link.order}
          onContextMenu={(e) => handleContextMenu(e)}
        >
          <a
            ref={linkRef}
            href={link.url}
            target='_blank'
            rel='noreferrer'
            title={link.name}
          >
            {
              linkSelectMode && <input type='checkbox' onChange={handleSelectChange}/>
            }
            <img src={link.imgUrl} alt={`favicon of ${link.name}`} />
            <span>{link.name}</span>
          </a>
          {
            className !== 'searchResult' && (
              <>
                <div className={styles.lcontrols}>
                  <button className='buttonIcon' onClick={handleHeightChange}>
                    <ArrowDown className={`uiIcon_small ${styles.arrow_left}`} />
                  </button>
                  <button className='buttonIcon'>
                    <Link to={`/app/${desktopName}/link/${link._id}`} state={link._id}>
                      <MaximizeIcon className='uiIcon_small'/>
                    </Link>
                  </button>
                </div>
                <p ref={linkDesc} className={styles.description}><span>{link.description}</span></p>
              </>
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
  )
}
