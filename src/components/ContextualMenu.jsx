import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { editLink, moveLink, moveMultipleLinks } from '../services/dbQueries'
import { handleResponseErrors } from '../services/functions'
import { useGlobalStore } from '../store/global'
import { usePreferencesStore } from '../store/preferences'
import styles from './ContextualMenu.module.css'
import { ArrowDown } from './Icons/icons'

export default function ContextLinkMenu ({ visible, setVisible, points, setPoints, params, setDeleteFormVisible, setEditFormVisible, setMoveFormVisible }) {
  const { desktopName } = useParams()
  const menuRef = useRef(null)
  const subMenuRef = useRef(null)
  const [subMenuSide, setSubMenuSide] = useState('')
  const [subMenuTop, setSubMenuTop] = useState('')
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const desktopColumns = globalColumns.filter(column => column.slug === desktopName).toSorted((a, b) => a.orden - b.orden)
  // console.log(points)
  // console.log(menuRef.current)
  const handleMoveClick = async (event) => {
    if (Array.isArray(params)) {
      console.log('multiple links')
      const updatedDesktopLinks = globalLinks.map(link => {
        if (params.includes(link._id)) {
        // Modifica la propiedad del elemento encontrado
          return { ...link, idpanel: event.target.id, panel: event.target.innerText, orden: 0 } // orden!!
        }
        return link
      }).toSorted((a, b) => (a.orden - b.orden))
      setGlobalLinks(updatedDesktopLinks)
      const body = {
        source: undefined,
        destiny: event.target.id,
        panel: event.target.innerText,
        links: params
      }
      const response = await moveMultipleLinks(body)

      const { hasError, message } = handleResponseErrors(response)
      if (hasError) {
        toast(message)
        return
      }

      activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(updatedDesktopLinks.toSorted((a, b) => (a.orden - b.orden))))
    } else {
      const orden = document.getElementById(event.target.id)?.childNodes.length ? document.getElementById(event.target.id).childNodes?.length : 0
      const updatedDesktopLinks = globalLinks.map(link => {
        if (link._id === params._id) {
        // Modifica la propiedad del elemento encontrado
          return { ...link, idpanel: event.target.id, panel: event.target.innerText, orden }
        }
        return link
      }).toSorted((a, b) => (a.orden - b.orden))
      setGlobalLinks(updatedDesktopLinks)

      const body = {
        id: params._id,
        idpanelOrigen: params.idpanel,
        fields: {
          idpanel: event.target.id,
          panel: event.target.innerText,
          orden
        }
      }
      const response = await moveLink(body)

      const { hasError, message } = handleResponseErrors(response)
      if (hasError) {
        toast(message)
        return
      }

      activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(updatedDesktopLinks.toSorted((a, b) => (a.orden - b.orden))))
    }
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
  const handleAddToFavorites = async () => {
    console.log(params)
    setVisible(false)
    const booked = params.bookmark === true
    console.log(!booked)

    const response = await editLink({ id: params._id, bookmark: !booked })

    const { hasError, message } = handleResponseErrors(response)
    let error
    if (response.message !== undefined) {
      error = response.message.join('\n')
    } else {
      error = message
    }
    if (hasError) {
      toast(error)
      return
    }
    const updatedDesktopLinks = globalLinks.map(link => {
      if (link._id === params._id) {
      // Modifica la propiedad del elemento encontrado
        return { ...link, bookmark: !booked }
      }
      return link
    }).toSorted((a, b) => (a.orden - b.orden))
    setGlobalLinks(updatedDesktopLinks)
    activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(updatedDesktopLinks.toSorted((a, b) => (a.orden - b.orden))))
  }
  useEffect(() => {
    // console.log(window.innerHeight)
    // console.log(document.body.scrollHeight)
    const menu = menuRef.current
    const submenu = subMenuRef.current
    const newPoints = { x: points.x, y: points.y }
    // console.log({ pointsX: points.x, menuWidth: menu.offsetWidth, windowWidth: window.innerWidth, submenuHeight: submenu.offsetHeight, windowHeight: window.innerHeight })
    if (points.x + menu.offsetWidth + submenu.offsetWidth > window.innerWidth) {
      setSubMenuSide('left')
      newPoints.x = window.innerWidth - menu.offsetWidth
    } else {
      setSubMenuSide('right')
    }
    if (points.y + menu.offsetHeight > document.body.scrollHeight) {
      newPoints.y = document.body.scrollHeight - menu.offsetHeight
    }
    // aqui hay que tener en cuenta la cantidad de scroll que haya, asi va bien cuando se ha hecho scroll total
    if (points.y + submenu.offsetHeight > document.body.scrollHeight || points.y + submenu.offsetHeight > window.innerHeight) {
      setSubMenuTop(`-${submenu.offsetHeight - menu.offsetHeight + 13}px`)
    } else {
      setSubMenuTop('88px')
    }
    setPoints(newPoints)
  }, [params]) // se puede meter params en un useRef
  return (
    <div ref={menuRef} id='contextLinkMenu' className={visible ? styles.flex : styles.hidden} style={{ left: points.x, top: points.y }}>
      <p><strong>Opciones Enlace</strong></p>
      <p>{params.name}</p>
      <span onClick={handleEditClick}>Editar</span>
      <span onClick={handleAddToFavorites}>Favoritos</span>
      <span className={styles.moveTo}>Mover a<ArrowDown className={`${styles.rotate} uiIcon_small`}/>
        <ul ref={subMenuRef} className={styles.moveList} style={subMenuSide === 'right' ? { top: subMenuTop } : { left: '-95%', top: subMenuTop }}>
          <li onClick={handleMoveFormClick}><span>Mover a otro escritorio</span></li>
          {
            desktopColumns.map(col => col._id === params.idpanel
              ? null
              : <li key={col._id} onClick={handleMoveClick}><span id={col._id}>{col.name}</span></li>)
          }
        </ul>
      </span>
      <span onClick={handleDeleteClick}>Borrar</span>
    </div>
  )
}
