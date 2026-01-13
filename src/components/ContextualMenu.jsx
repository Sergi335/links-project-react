import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { updateLink } from '../services/dbQueries'
import { handleResponseErrors } from '../services/functions'
import { useGlobalStore } from '../store/global'
import { usePreferencesStore } from '../store/preferences'
import styles from './ContextualMenu.module.css'
import { ArrowDown } from './Icons/icons'

export default function ContextLinkMenu ({ visible, setVisible, points, setPoints, params, setDeleteFormVisible, setEditFormVisible, setMoveFormVisible }) {
  const { desktopName, slug } = useParams()
  const [desktopColumns, setDesktopColumns] = useState([])
  const [realColumn, setRealColumn] = useState({})
  const menuRef = useRef(null)
  const subMenuRef = useRef(null)
  const [subMenuSide, setSubMenuSide] = useState('')
  const [subMenuTop, setSubMenuTop] = useState('')
  // const [article, setArticle] = useState(null)
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const desktop = globalColumns.filter(column => column.slug === desktopName)
  const firstLinkId = Array.isArray(params) ? params[0] : params._id
  const firstLink = globalLinks.find(link => link._id === firstLinkId)
  const sourceCategoryId = firstLink?.categoryId
  // const navigate = useNavigate()
  // const globalArticles = useGlobalStore(state => state.globalArticles)
  // const setGlobalArticles = useGlobalStore(state => state.setGlobalArticles)

  // Establish desktopColumns when desktopName or slug changes
  useEffect(() => {
    if (slug) {
      const subcategory = globalColumns.find(col => col.slug === slug)
      const columns = globalColumns.filter(column => column.parentId === subcategory?._id)
      const virtualColumn = Array.from(document.getElementsByClassName('column_wrapper'))
      const virtualColumnIds = virtualColumn.map(col => col.id)
      if (virtualColumnIds[0]?.startsWith('virtual-')) {
        const realId = virtualColumnIds[0].split('virtual-')[1]
        setRealColumn(globalColumns.find(col => col._id === realId))
        console.log(realColumn)
      }
      setDesktopColumns(columns)
    } else {
      const columns = globalColumns.filter(column => column.parentId === desktop[0]?._id)
      const virtualColumn = Array.from(document.getElementsByClassName('column_wrapper'))
      const virtualColumnIds = virtualColumn.map(col => col.id)
      if (virtualColumnIds[0]?.startsWith('virtual-')) {
        const realId = virtualColumnIds[0].split('virtual-')[1]
        setRealColumn(globalColumns.find(col => col._id === realId))
        console.log(realColumn)
      }
      setDesktopColumns(columns)
    }
  }, [desktopName, slug, globalColumns])
  const handleMoveClick = async (event) => {
    const previousLinks = [...globalLinks]
    const linksToEdit = Array.isArray(params) ? params : [params._id]
    const firstLink = globalLinks.find(link => link._id === linksToEdit[0])

    const targetCategoryId = event.target.id
    const sourceCategoryId = firstLink?.categoryId

    // 1. Obtener hermanos actuales de DESTINO y ORIGEN (excluyendo los que se mueven) de forma ordenada
    const targetLinkBrothers = globalLinks
      .filter(link => link.categoryId === targetCategoryId)
      .toSorted((a, b) => (a.order - b.order))

    const sourceLinkBrothers = globalLinks
      .filter(link => link.categoryId === sourceCategoryId && !linksToEdit.includes(link._id))
      .toSorted((a, b) => (a.order - b.order))

    // 2. Actualización optimista: Re-indexar AMBAS categorías
    const updatedDesktopLinks = globalLinks.map(link => {
      // Caso A: Es uno de los links que estamos moviendo
      if (linksToEdit.includes(link._id)) {
        const moveIdx = linksToEdit.indexOf(link._id)
        return { ...link, categoryId: targetCategoryId, order: targetLinkBrothers.length + moveIdx }
      }

      // Caso B: Son los links que YA ESTABAN en el destino (re-indexamos para limpiar huecos)
      if (link.categoryId === targetCategoryId) {
        const newIdx = targetLinkBrothers.findIndex(item => item._id === link._id)
        if (newIdx !== -1) return { ...link, order: newIdx }
      }

      // Caso C: Son los links que SE QUEDAN en el origen (re-indexamos para limpiar el hueco del movido)
      if (link.categoryId === sourceCategoryId) {
        const newIdx = sourceLinkBrothers.findIndex(item => item._id === link._id)
        if (newIdx !== -1) return { ...link, order: newIdx }
      }

      return link
    }).toSorted((a, b) => (a.order - b.order))

    setGlobalLinks(updatedDesktopLinks)
    activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(updatedDesktopLinks))

    try {
      // 3. Preparar items para el backend con el nuevo orden limpio
      const movedItems = linksToEdit.map((linkId, index) => ({
        id: linkId,
        categoryId: targetCategoryId,
        order: targetLinkBrothers.length + index
      }))

      const destinyItems = targetLinkBrothers.map((link, index) => ({
        id: link._id,
        order: index,
        categoryId: targetCategoryId
      }))

      const remainingItems = sourceLinkBrothers.map((link, index) => ({
        id: link._id,
        order: index,
        categoryId: sourceCategoryId
      }))

      const items = [...movedItems, ...destinyItems, ...remainingItems]

      const response = await updateLink({ items })
      const { hasError, message } = handleResponseErrors(response)

      if (hasError) {
        // Rollback en caso de error
        setGlobalLinks(previousLinks)
        activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(previousLinks.toSorted((a, b) => (a.order - b.order))))
        toast(message)
      }
    } catch (error) {
      // Rollback en caso de error de red
      setGlobalLinks(previousLinks)
      activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(previousLinks.toSorted((a, b) => (a.order - b.order))))
      toast('Error al mover enlaces')
    }

    setVisible(false)
  }
  const handleEditClick = () => {
    // setEditFormVisible(true)
    setVisible(false)
  }
  const handleDeleteClick = () => {
    // setDeleteFormVisible(true)
    setVisible(false)
  }
  const handleMoveFormClick = () => {
    setMoveFormVisible(true)
    setVisible(false)
  }
  const handleAddToFavorites = async () => {
    // console.log(params)
    setVisible(false)
    const booked = params.bookmark === true
    // console.log(!booked)

    // Actualizaciones optimistas - actualizar estado inmediatamente
    const previousLinks = [...globalLinks]
    const updatedDesktopLinks = globalLinks.map(link => {
      if (link._id === params._id) {
      // Modifica la propiedad del elemento encontrado
        return { ...link, bookmark: !booked }
      }
      return link
    }).toSorted((a, b) => (a.orden - b.orden))

    setGlobalLinks(updatedDesktopLinks)
    activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(updatedDesktopLinks.toSorted((a, b) => (a.orden - b.orden))))

    try {
      const response = await updateLink({ items: [{ id: params._id, bookmark: !booked }] })

      const { hasError, message } = handleResponseErrors(response)
      if (hasError) {
        // Rollback en caso de error
        setGlobalLinks(previousLinks)
        activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(previousLinks.toSorted((a, b) => (a.orden - b.orden))))
        toast(message)
      }
    } catch (error) {
      // Rollback en caso de error de red u otros errores
      setGlobalLinks(previousLinks)
      activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(previousLinks.toSorted((a, b) => (a.orden - b.orden))))
      toast('Error al actualizar favoritos')
    }
  }
  // const handleExtractArticle = () => {
  //   setVisible(false)
  //   fetch(`${constants.BASE_API_URL}/links/${params._id}/extract`, {
  //     method: 'POST',
  //     ...constants.FETCH_OPTIONS
  //   })
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok')
  //       }
  //       return response.json()
  //     })
  //     .then(data => {
  //       // console.log('🚀 ~ handleExtractArticle ~ data:', data)
  //       if (Array.isArray(data.data) && data.data.length > 0) {
  //         setGlobalArticles(data.data[0].extractedArticle)
  //       } else {
  //         setGlobalArticles(data.data)
  //       }
  //     })
  //     .then(() => {
  //       const articleUrl = `/app/article/${params._id}`
  //       navigate(articleUrl)
  //     })
  //     .catch(error => {
  //       console.error('Error fetching article:', error)
  //     })
  // }
  useEffect(() => {
    // //console.log(window.innerHeight)
    // //console.log(document.body.scrollHeight)
    const menu = menuRef.current
    const submenu = subMenuRef.current
    const newPoints = { x: points.x, y: points.y }
    // //console.log({ pointsX: points.x, menuWidth: menu.offsetWidth, windowWidth: window.innerWidth, submenuHeight: submenu.offsetHeight, windowHeight: window.innerHeight })
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
      {/* <span onClick={handleExtractArticle}>Leer Artículo</span> */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <button onClick={handleEditClick} popovertarget="edit-link-form" popovertargetaction="show">Editar</button>
      <span onClick={handleAddToFavorites}>Favoritos</span>
      <span className={styles.moveTo}>Mover a<ArrowDown className={`${styles.rotate} uiIcon_small`}/>
        <ul ref={subMenuRef} className={styles.moveList} style={subMenuSide === 'right' ? { top: subMenuTop } : { left: '-95%', top: subMenuTop }}>
          <li onClick={handleMoveFormClick}><span>Mover a otro escritorio</span></li>
          {
            realColumn._id && realColumn._id !== sourceCategoryId
              ? <li key={realColumn._id} onClick={handleMoveClick}><span id={realColumn._id}>{realColumn.name}</span></li>
              : null
          }
          {
            desktopColumns.map(col => col._id === sourceCategoryId
              ? null
              : <li key={col._id} onClick={handleMoveClick}><span id={col._id}>{col.name}</span></li>)
          }
        </ul>
      </span>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <button onClick={handleDeleteClick} popovertarget="delete-link-form" popovertargetaction="show">Borrar</button>
    </div>
  )
}
