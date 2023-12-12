import { useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Nav.module.css'
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay, closestCorners } from '@dnd-kit/core'
import { SortableContext, useSortable, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { createPortal } from 'react-dom'
import { moveDesktops } from '../services/dbQueries'
// import { useDesktops } from '../hooks/useDesktops'
import { useDesktopsStore } from '../store/desktops'
import { handleResponseErrors } from '../services/functions'
import { toast } from 'react-toastify'

function NavItem ({ escritorio }) {
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
    <li ref={setNodeRef} style={style} id={escritorio._id} {...attributes} {...listeners}>
      <NavLink to={`/desktop/${escritorio.name}`}>{escritorio.displayName}</NavLink>
    </li>
  )
}
export default function Nav () {
  const [activeDesk, setActiveDesk] = useState(null)
  const [movedDesk, setMovedDesk] = useState(null)
  // const { desktopName } = useParams()
  // useDesktops({ desktopName })
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)

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

  return (

        <nav className={styles.nav}>
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
                    desktopsStore.map(escritorio => (
                        <NavItem key={escritorio._id} escritorio={escritorio}/>
                    ))
                }
              </SortableContext>
              {
                createPortal(
                  <DragOverlay className='draggedDesk'>
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
