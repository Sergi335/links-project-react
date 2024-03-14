import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFormsStore } from '../store/forms'
import { useLinksStore } from '../store/links'
import { usePreferencesStore } from '../store/preferences'
import { ArrowDown, MaximizeIcon } from './Icons/icons'
import styles from './customlink.module.css'

export default function CustomLink ({ data, className }) {
  const link = data.link || data.activeLink
  const setContextMenuVisible = useFormsStore(state => state.setContextMenuVisible)
  const setPoints = useFormsStore(state => state.setPoints)
  const setActiveLink = useFormsStore(state => state.setActiveLink)
  const setActiveElement = useFormsStore(state => state.setActiveElement)
  const pastedLinkId = useLinksStore(state => state.pastedLinkId)
  const setPastedLinkId = useLinksStore(state => state.setPastedLinkId)
  const [linkSelectMode, setLinkSelectMode] = useState(false)
  const controlStyle = className === 'searchResult' ? { width: 'auto', position: 'relative', top: '25%' } : {}
  const linkStyle = className === 'searchResult' ? { flexWrap: 'wrap', height: '77px' } : {}
  const anchorStyle = className === 'searchResult' ? { height: '20px', paddingTop: '10px' } : {}
  // Ref del link y descripción
  const linkRef = useRef(null)
  const linkDesc = useRef(null)
  const selectModeGlobal = usePreferencesStore(state => state.selectModeGlobal)
  const columnSelectModeId = usePreferencesStore(state => state.columnSelectModeId)
  const selectedLinks = usePreferencesStore(state => state.selectedLinks)
  const setSelectedLinks = usePreferencesStore(state => state.setSelectedLinks)

  useEffect(() => {
    if (columnSelectModeId.includes(link.idpanel)) {
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
    const rotator = e.currentTarget.childNodes[0]
    e.currentTarget.parentNode.parentNode.classList.toggle('active')
    const displayNewImage = () => {
      rotator.classList.toggle(styles.rotate)
      linkDesc.current.classList.toggle(styles.link_open)
      linkDesc.current.childNodes[0].classList.toggle(styles.fade)
    }
    displayNewImage()
  }

  const handleSelectChange = (e) => {
    const linkId = e.currentTarget.parentNode.parentNode.id
    // console.log('🚀 ~ handleSelectChange ~ linkId:', linkId)
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
      linkRef.current?.parentNode.classList.add(`${styles.conic}`)
      setTimeout(() => {
        linkRef.current?.parentNode.classList.remove(`${styles.conic}`)
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
  // console.log('🚀 ~ CustomLink ~ isDragging:', isDragging)
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    ...linkStyle
  }
  // Lo que hace es retornar el link vacio si está siendo arrastrado
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
          style={style}
          {...attributes}
          {...listeners} className={isDragging ? `${styles.link_dragged} link` : `${styles.link} link`} id={link._id} data-orden={link.orden} onContextMenu={(e) => handleContextMenu(e)}>
          <a ref={linkRef} href={link.URL} style={ anchorStyle } target='_blank' rel='noreferrer' title={link.name}>
            {
              linkSelectMode && <input type='checkbox' className={linkSelectMode ? `${styles.checkbox}` : `${styles.hidden}`} onChange={handleSelectChange}/>
            }
            <img src={link.imgURL} alt={`favicon of ${link.name}`} />
            <span>{link.name}</span>
          </a>
          {
            className !== 'searchResult' && (
              <div className={styles.lcontrols} style={controlStyle}>
                <button className='buttonIcon'>
                  <Link to={`/desktop/link/${link._id}`} state={link._id}>
                    <MaximizeIcon className='uiIcon_small'/>
                  </Link>
                  </button>
                  {
                    className !== 'searchResult' && (<button className='buttonIcon' onClick={handleHeightChange}><ArrowDown className='uiIcon_small' /></button>)
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
        {
          className !== 'searchResult' && <p ref={linkDesc} className={styles.description}><span>{link.description}</span></p>
        }
      </>
  )
}
