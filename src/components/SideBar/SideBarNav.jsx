import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import { useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useStyles } from '../../hooks/useStyles'
import { moveDesktops } from '../../services/dbQueries'
import { formatPath, handleResponseErrors } from '../../services/functions'
import { useDesktopsStore } from '../../store/desktops'
import { useGlobalStore } from '../../store/global'
import { PlusIcon } from '../Icons/icons'
import styles from './SideInfo.module.css'

function SideBarNavItem ({ escritorio, children }) {
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
    const element = e.currentTarget.parentNode.parentNode
    const list = element.querySelector('ul')
    list?.classList.toggle(styles.show)
  }
  if (isDragging) {
    return (
      <li ref={setNodeRef} style={style} id={escritorio._id} className={styles.draggedDesk}>
        <NavLink to={`/desktop/${escritorio.name}`}>{escritorio.displayName}</NavLink>
      </li>
    )
  }
  return (
      <li ref={setNodeRef} style={style} id={escritorio._id} {...attributes} {...listeners} >
        <NavLink to={`/desktop/${escritorio.name}`}><button onClick={handleExpandSublist}><PlusIcon className={styles.plus_icon}/></button>{escritorio.displayName}</NavLink>
        {children}
      </li>
  )
}
function SideBarNavSubItem ({ escritorio, columna }) {
  const path = formatPath(columna._id)

  return (
      <li id={columna._id}>
        <NavLink to={`/column/${escritorio.name}/${path}`} title={columna.name}>{columna.name}</NavLink>
      </li>
  )
}
export default function SideBarNav () {
  const [activeDesk, setActiveDesk] = useState(null)
  const [movedDesk, setMovedDesk] = useState(null)
  const navRef = useRef()
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)
  const globalLoading = useGlobalStore(state => state.globalLoading)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const { theme } = useStyles()
  const desktopsId = useMemo(() => desktopsStore.map((desk) => desk._id), [desktopsStore])

  // Handlers de dnd-kit -> useCallback
  const onDragStart = (event) => {
    if (event.active.data.current?.type === 'Desktop') {
      const panel = document.getElementById('sidebar')
      // const icon = document.getElementById('pin_icon')
      if (!panel.classList.contains('pinned')) panel.classList.add('pinned')
      // if (!icon.classList.contains('pin_icon')) icon.classList.add('pin_icon')
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
  const sensors = useSensors( // Es necesario?
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0
      }
    })
  )

  return (

        <nav ref={navRef} className={styles.nav}>
          <OverlayScrollbarsComponent options={{ scrollbars: { theme: `os-theme-${theme}`, autoHide: 'true' } }}>
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
                      !escritorio.hidden &&
                        <SideBarNavItem key={escritorio._id} escritorio={escritorio}>
                          <ul>
                            {
                              globalColumns.map(col => (
                                col.escritorio === escritorio.name
                                  ? <SideBarNavSubItem key={col._id} id={col._id} data-db={col.escritorio} escritorio={escritorio} columna={col}>{col.name}</SideBarNavSubItem>
                                  : null
                              ))
                            }
                          </ul>
                        </SideBarNavItem>
                    ))
                }
              </SortableContext>
              {
                createPortal(
                  <DragOverlay>
                    {
                      activeDesk && (<li className={styles.floatLi}><SideBarNavItem key={activeDesk._id} escritorio={activeDesk} /></li>)
                    }
                  </DragOverlay>
                  , document.body)
              }
            </DndContext>
            </ul>
          </OverlayScrollbarsComponent>
        </nav>

  )
}
