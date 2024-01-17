import { useState, useMemo, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Nav.module.css'
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay, closestCorners } from '@dnd-kit/core'
import { SortableContext, useSortable, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { createPortal } from 'react-dom'
import { moveDesktops } from '../services/dbQueries'
// import { useDesktops } from '../hooks/useDesktops'
import { usePreferencesStore } from '../store/preferences'
import { useDesktopsStore } from '../store/desktops'
import { handleResponseErrors } from '../services/functions'
import { toast } from 'react-toastify'
import { useGlobalStore } from '../store/global'
import NavLoader from './NavLoader'
import SideInfo from './SideInfo'
import useResizeWindow from '../hooks/useResizeWindow'

function NavItem ({ escritorio, toggleMobileMenu }) {
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
  if (isDragging) {
    return (
      <li ref={setNodeRef} style={style} id={escritorio._id}>
      </li>
    )
  }
  return (
    <li ref={setNodeRef} style={style} id={escritorio._id} {...attributes} {...listeners} onClick={toggleMobileMenu}>
      <NavLink to={`/desktop/${escritorio.name}`}>{escritorio.displayName}</NavLink>
    </li>
  )
}
export default function Nav ({ toggleMobileMenu }) {
  const [activeDesk, setActiveDesk] = useState(null)
  const [movedDesk, setMovedDesk] = useState(null)
  const navRef = useRef()
  const windowSize = useResizeWindow()
  // const { desktopName } = useParams()
  // useDesktops({ desktopName })
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)
  // const navScroll = usePreferencesStore(state => state.navScroll)
  // console.log('🚀 ~ file: Nav.jsx:55 ~ Nav ~ navScroll:', navScroll)
  const setNavScroll = usePreferencesStore(state => state.setNavScroll)
  const setNavElement = usePreferencesStore(state => state.setNavElement)
  const globalLoading = useGlobalStore(state => state.globalLoading)
  // const setLimit = usePreferencesStore(state => state.setLimit)
  const isMobile = windowSize.width < 1536

  // Handlers de dnd-kit -> useCallback
  const onDragStart = (event) => {
    if (event.active.data.current?.type === 'Desktop') {
      setActiveDesk(event.active.data.current.escritorio)
      setMovedDesk(event.active.data.current.escritorio)
    }
  }
  const onDragEnd = async (event) => {
    setActiveDesk(null)
    if (movedDesk) {
      setMovedDesk(null)
      const response = await moveDesktops(desktopsStore)
      const { hasError, message } = handleResponseErrors(response)
      if (hasError) {
        toast(message)
      }
      // localStorage.setItem('Desktops', JSON.stringify(desktopsStore.toSorted((a, b) => (a.order - b.order))))
    }
  }
  const onDragOver = (event) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === 'Desktop'
    const isOverATask = over.data.current?.type === 'Desktop'

    if (!isActiveATask) return

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const activeIndex = desktopsStore.findIndex((t) => t._id === activeId)
      const overIndex = desktopsStore.findIndex((t) => t._id === overId)
      setDesktopsStore(arrayMove(desktopsStore, activeIndex, overIndex))
    }
  }
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3
      }
    })
  )
  const desktopsId = useMemo(() => desktopsStore.map((desk) => desk._id), [desktopsStore])

  useEffect(() => {
    setNavElement(navRef.current)
    // console.log(navRef)
    // console.log(navRef.current?.scrollWidth - navRef.current?.offsetWidth)
    // setLimit(navRef.current.scrollWidth - navRef.current.offsetWidth)
    const navHorizontalScroll = (evt) => {
      evt.preventDefault()
      navRef.current.scrollLeft += evt.deltaY
      // console.log(navRef.current.scrollLeft)
      setNavScroll(navRef.current.scrollLeft)
    }
    navRef.current?.addEventListener('wheel', navHorizontalScroll)

    return () => {
      navRef.current?.removeEventListener('wheel', navHorizontalScroll)
    }
  }, [navRef.current])

  return (

        <nav ref={navRef} className={styles.nav}>
            {/* // deshabilitar en profile y en link details */}
            {isMobile && <SideInfo environment={'listoflinks'} className='nav_side_info' />}
            <ul>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
            >
              <SortableContext items={desktopsId} strategy={horizontalListSortingStrategy}>
                {
                  globalLoading
                    ? <><NavLoader/><NavLoader/><NavLoader/><NavLoader/></>
                    : desktopsStore.map(escritorio => (
                      <NavItem key={escritorio._id} escritorio={escritorio} toggleMobileMenu={toggleMobileMenu}/>
                    ))
                }
              </SortableContext>
              {
                createPortal(
                  <DragOverlay className={styles.draggedDesk}>
                    {
                      activeDesk && (<NavItem key={activeDesk._id} escritorio={activeDesk} />)
                    }
                  </DragOverlay>
                  , document.body)
              }
            </DndContext>
            </ul>
        </nav>

  )
}
