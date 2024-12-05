import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useOverlayScrollbars } from 'overlayscrollbars-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useStyles } from '../../hooks/useStyles'
import { moveDesktops } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useDesktopsStore } from '../../store/desktops'
import { useGlobalStore } from '../../store/global'
import { ArrowDown } from '../Icons/icons'
import NavLoader from './NavLoader'
import styles from './SideBar.module.css'

function SideBarNavItem ({ escritorio, children, className }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: escritorio._id,
    data: {
      type: 'Desktop',
      escritorio
    }
  })
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }
  const handleExpandSublist = (e) => {
    e.preventDefault()
    setIsExpanded(prev => !prev)
  }
  if (isDragging) {
    return (
      <li ref={setNodeRef} style={style} id={escritorio._id} className={styles.draggedDesk}>
        <NavLink to={`${rootPath}${basePath}/${escritorio.name}`}>{escritorio.displayName}</NavLink>
      </li>
    )
  }
  return (
      <li ref={setNodeRef} style={style} id={escritorio._id} {...attributes} {...listeners} className={className}>
        <NavLink to={`${rootPath}${basePath}/${escritorio.name}`} className={({ isActive }) => isActive ? styles.active : ''}>
            {escritorio.displayName}
          <button onClick={handleExpandSublist} aria-expanded={isExpanded}>
            <ArrowDown
              className={isExpanded ? `${styles.plus_icon_opened} ${styles.plus_icon}` : styles.plus_icon}
            />
          </button>
        </NavLink>
        <ul className={isExpanded ? styles.show : null}>
          {children}
        </ul>
      </li>
  )
}
function SideBarNavSubItem ({ escritorio, columna, slug }) {
  const [active, setActive] = useState(false)
  const [firstColumnLink, setFirstColumnLink] = useState(null)
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const desktopLinks = globalLinks?.filter(link => link.escritorio.toLowerCase() === escritorio.name)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const desktopColumns = globalColumns?.filter(column => column.escritorio.toLowerCase() === escritorio.name)

  useEffect(() => {
    const actualColumn = desktopColumns.find(column => column.slug === columna.slug)
    setActive(slug === actualColumn.slug)
    setFirstColumnLink(desktopLinks.map(link => (link.idpanel === actualColumn._id) ? link : null).filter(link => link !== null)[0])
  }, [slug])

  return (
      <li id={columna._id}>
        <Link
          to={`${rootPath}${basePath}/${escritorio.name}/${columna.slug}/${firstColumnLink?._id}`}
          title={columna.name}
          className={active ? styles.active : ''}
        >
            {columna.name}
          </Link>
      </li>
  )
}
export default function SideBarNav () {
  const { slug } = useParams()
  const [activeDesk, setActiveDesk] = useState(null)
  const [movedDesk, setMovedDesk] = useState(null)
  const listRef = useRef()
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)
  const desktopsOrderRef = useRef()
  desktopsOrderRef.current = desktopsStore

  const globalLoading = useGlobalStore(state => state.globalLoading)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const desktopsId = useMemo(() => desktopsStore.map((desk) => desk._id), [desktopsStore])
  const { theme } = useStyles()
  const [initialize] = useOverlayScrollbars({ options: { scrollbars: { theme: `os-theme-${theme}`, autoHide: 'true' } } })

  useEffect(() => {
    initialize({ target: listRef.current })
  }, [initialize])

  const onDragStart = useCallback((event) => {
    if (event.active.data.current?.type === 'Desktop') {
      const panel = document.getElementById('sidebar')
      if (!panel.classList.contains('pinned')) panel.classList.add('pinned')
      setActiveDesk(event.active.data.current.escritorio)
      setMovedDesk(event.active.data.current.escritorio)
    }
  }, [])
  const onDragOver = useCallback((event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeIndex = desktopsOrderRef.current.findIndex((t) => t._id === active.id)
    const overIndex = desktopsOrderRef.current.findIndex((t) => t._id === over.id)

    desktopsOrderRef.current = arrayMove(desktopsOrderRef.current, activeIndex, overIndex)
  }, [])
  const onDragEnd = useCallback(async (event) => {
    setActiveDesk(null)
    if (movedDesk) { // Siempre hará la llamada a la API
      setMovedDesk(null)
      const newOrder = desktopsOrderRef.current
      setDesktopsStore(newOrder)
      const response = await moveDesktops(newOrder)
      const { hasError, message } = handleResponseErrors(response)
      if (hasError) {
        toast(message)
      }
    }
  }, [movedDesk, desktopsStore])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0
      }
    })
  )

  return (

        <nav className={styles.nav} ref={listRef}>
          <ul className={styles.nav_first_level_ul}>
            <DndContext
              sensors={sensors}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
            >
              <SortableContext items={desktopsId} strategy={verticalListSortingStrategy}>
                {
                  globalLoading
                    ? <><NavLoader/><NavLoader/><NavLoader/><NavLoader/></>
                    : desktopsStore.map(escritorio => (
                      !escritorio.hidden &&
                        <SideBarNavItem key={escritorio._id} escritorio={escritorio}>
                            {
                              globalColumns.map(col => (
                                col.escritorio === escritorio.name
                                  ? <SideBarNavSubItem key={col._id} id={col._id} data-db={col.escritorio} escritorio={escritorio} columna={col} slug={slug}>{col.name}</SideBarNavSubItem>
                                  : null
                              ))
                            }
                        </SideBarNavItem>
                    ))
                }
              </SortableContext>
              {
                createPortal(
                  <DragOverlay>
                    {
                      activeDesk && (<SideBarNavItem key={activeDesk._id} escritorio={activeDesk} className={styles.floatLi} />)
                    }
                  </DragOverlay>
                  , document.body)
              }
            </DndContext>
          </ul>
        </nav>

  )
}
