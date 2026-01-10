import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React, { useEffect, useRef, useState } from 'react'
import { getSignedUrl } from '../services/dbQueries'
import { useFormsStore } from '../store/forms'
import { useGlobalStore } from '../store/global'
import { useLinksStore } from '../store/links'
import { usePreferencesStore } from '../store/preferences'
import { ArrowDown } from './Icons/icons'
import styles from './customlink.module.css'

const CustomLink = ({ data, className }) => {
  const link = data.link || data.activeLink
  const [linkSelectMode, setLinkSelectMode] = useState(false)
  const [localFaviconVisible, setLocalFaviconVisible] = useState(false)
  const [iconUrl, setIconUrl] = useState(link.imgUrl?.startsWith('http') ? link.imgUrl : '/img/opcion1.svg')
  // Ref del link y descripción
  const linkRef = useRef(null)
  const linkDesc = useRef(null)
  const selectModeGlobal = usePreferencesStore(state => state.selectModeGlobal)
  const columnSelectModeId = usePreferencesStore(state => state.columnSelectModeId)
  // const selectedLinks = usePreferencesStore(state => state.selectedLinks)
  const setSelectedLinks = usePreferencesStore(state => state.setSelectedLinks)
  const setContextMenuVisible = useFormsStore(state => state.setContextMenuVisible)
  const setPoints = useFormsStore(state => state.setPoints)
  const setActiveLink = useFormsStore(state => state.setActiveLink)
  const setActiveElement = useFormsStore(state => state.setActiveElement)
  const pastedLinkId = useLinksStore(state => state.pastedLinkId)
  const setPastedLinkId = useLinksStore(state => state.setPastedLinkId)
  const faviconChangerVisible = useGlobalStore(state => state.faviconChangerVisible)
  const setFaviconChangerVisible = useGlobalStore(state => state.setFaviconChangerVisible)
  const setFaviconChangerVisiblePoints = useGlobalStore(state => state.setFaviconChangerVisiblePoints)
  const setLinkToChangeFavicon = useGlobalStore(state => state.setLinkToChangeFavicon)

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
    // e.preventDefault()
    e.stopPropagation()

    const linkElement = e.currentTarget.parentNode.parentNode.parentNode
    const linkId = linkElement.id

    // Obtener el estado actual directamente del store
    const currentSelectedLinks = usePreferencesStore.getState().selectedLinks
    console.log('Estado actual del store:', currentSelectedLinks)

    if (currentSelectedLinks.includes(linkId)) {
      const newState = currentSelectedLinks.filter(id => id !== linkId)
      setSelectedLinks(newState)
      linkElement.classList.remove('active')
    } else {
      const newState = [...currentSelectedLinks, linkId]
      console.log('Nuevo estado a guardar:', newState)
      setSelectedLinks(newState)
      linkElement.classList.add('active')
    }
  }

  const handleShowFaviconChanger = (e) => {
    e.stopPropagation()
    setFaviconChangerVisiblePoints({ x: e.pageX, y: e.pageY })
    // Aquí se abriría el selector de favicon
    setLocalFaviconVisible(!localFaviconVisible)
    setLinkToChangeFavicon(link)
  }
  // Sincronizar estado local con global, ya que se actualiza al clicar fuera y provocaba inconsistencias
  useEffect(() => {
    setFaviconChangerVisible(localFaviconVisible)
  }, [localFaviconVisible])

  useEffect(() => {
    setLocalFaviconVisible(faviconChangerVisible)
  }, [faviconChangerVisible])

  useEffect(() => {
    if (pastedLinkId.includes(link._id)) {
      linkRef.current?.parentNode.classList.add(`${styles.animated_paste}`)
      setTimeout(() => {
        linkRef.current?.parentNode.classList.remove(`${styles.animated_paste}`)
      }, 4000)
      setPastedLinkId([])
    }
  }, [])

  // Obtener URL firmada si el favicon está en storage privado
  useEffect(() => {
    if (!link.imgUrl) {
      setIconUrl('/img/opcion1.svg')
      return
    }
    // URLs directas: http, https, blob (temporal), o rutas locales /img/
    if (link.imgUrl.startsWith('http') || link.imgUrl.startsWith('blob:') || link.imgUrl.startsWith('/img/')) {
      setIconUrl(link.imgUrl)
    } else {
      // Es una key de storage, obtener URL firmada
      getSignedUrl(link.imgUrl)
        .then(url => setIconUrl(url))
        .catch(() => setIconUrl('/img/opcion1.svg'))
    }
  }, [link.imgUrl])

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
          <div className={styles.link_wrapper}>
            {
              linkSelectMode && <input type='checkbox' onChange={handleSelectChange}/>
            }
            <img src={iconUrl} alt={`favicon of ${link.name}`} onClick={handleShowFaviconChanger} />
            <a
              ref={linkRef}
              href={link.url}
              target='_blank'
              rel='noreferrer'
              title={link.name}
            >
              <span>{link.name}</span>
            </a>
            {
              className !== 'searchResult' && (
                <>
                  <div className={styles.lcontrols}>
                    <button className='buttonIcon' onClick={handleHeightChange}>
                      <ArrowDown className={`uiIcon_small ${styles.arrow_left}`} />
                    </button>
                    {/* <button className='buttonIcon'>
                      <Link to={`/app/${desktopName}/link/${link._id}`} state={link._id}>
                        <MaximizeIcon className='uiIcon_small'/>
                      </Link>
                    </button> */}
                  </div>
                </>
              )
            }
          </div>
          {className !== 'searchResult' && <p ref={linkDesc} className={styles.description}><span>{link.description}</span></p>}
          {
            className === 'searchResult' && (
              <div className={styles.additionalInfo}>
                {/* <span>Escritorio: {link.escritorio}</span> crear función que devuelva la ruta completa desde la categoria superior pasando por todas las intermedias */}
                <span>Ruta: {link.categoryChain}</span>
                {
                  link.description !== 'Description' ? <span>Descripción: {link.description}</span> : null
                }
              </div>
            )
          }
        </div>
  )
}

export default React.memo(CustomLink)
