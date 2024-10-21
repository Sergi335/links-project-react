import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { moveDesktops } from '../../services/dbQueries'
import styles from './SideInfo.module.css'
// import { useDesktops } from '../hooks/useDesktops'
import { toast } from 'react-toastify'
// import useResizeWindow from '../hooks/useResizeWindow'
import { handleResponseErrors } from '../../services/functions'
import { useDesktopsStore } from '../../store/desktops'
import { useGlobalStore } from '../../store/global'
// import { usePreferencesStore } from '../store/preferences'

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
      <li ref={setNodeRef} style={style} id={escritorio._id} className={styles.draggedDesk}>
        <NavLink to={`/desktop/${escritorio.name}`}>{escritorio.displayName}</NavLink>
      </li>
    )
  }
  return (
    <li ref={setNodeRef} style={style} id={escritorio._id} {...attributes} {...listeners} onClick={toggleMobileMenu}>
      <NavLink to={`/desktop/${escritorio.name}`}>{escritorio.displayName}</NavLink>
    </li>
  )
}
export default function SideBarNav ({ toggleMobileMenu }) {
  const [activeDesk, setActiveDesk] = useState(null)
  const [movedDesk, setMovedDesk] = useState(null)
  const navRef = useRef()
  // const windowSize = useResizeWindow()
  // const { desktopName } = useParams()
  // useDesktops({ desktopName })
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)
  // const navScroll = usePreferencesStore(state => state.navScroll)
  // console.log('🚀 ~ file: Nav.jsx:55 ~ Nav ~ navScroll:', navScroll)
  // const setNavScroll = usePreferencesStore(state => state.setNavScroll)
  // const setNavElement = usePreferencesStore(state => state.setNavElement)
  const globalLoading = useGlobalStore(state => state.globalLoading)
  // const setLimit = usePreferencesStore(state => state.setLimit)
  // const isMobile = windowSize.width < 1536
  // const params = useParams()
  // const isLinkDetails = params?.id !== undefined

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
        distance: 0
      }
    })
  )
  const desktopsId = useMemo(() => desktopsStore.map((desk) => desk._id), [desktopsStore])

  return (

        <nav ref={navRef} className={styles.nav}>
            {/* // deshabilitar en profile y en link details */}
            {/* {isMobile && !isLinkDetails && <SideInfo environment={'listoflinks'} className='nav_side_info' />} */}
            <ul>
            <DndContext
              sensors={sensors}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
            >
              <SortableContext items={desktopsId} strategy={verticalListSortingStrategy}>
                {
                  globalLoading
                    ? <></> // <><NavLoader/><NavLoader/><NavLoader/><NavLoader/></>
                    : desktopsStore.map(escritorio => (
                      !escritorio.hidden && <NavItem key={escritorio._id} escritorio={escritorio} toggleMobileMenu={toggleMobileMenu}/>
                    ))
                }
              </SortableContext>
              {
                createPortal(
                  <DragOverlay>
                    {
                      activeDesk && (<li className={styles.floatLi}><NavItem key={activeDesk._id} escritorio={activeDesk} /></li>)
                    }
                  </DragOverlay>
                  , document.body)
              }
            </DndContext>
            </ul>
        </nav>

  )
}
