import { DndContext, DragOverlay, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useGlobalStore } from '../store/global'
import styles from './Bookmarks.module.css'

function BookmarkItem ({ bookmark }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: bookmark._id,
    data: {
      type: 'bookmark',
      bookmark
    }
  })
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }
  if (isDragging) {
    return (
      <div ref={setNodeRef} className={styles.book_dragged} style={style}>
      </div>
    )
  }
  return (
    <a ref={setNodeRef} style={style} href={bookmark.URL} target='_blank' rel="noreferrer" {...attributes} {...listeners}>
      <img className={styles.bookmark} src={bookmark.imgURL} alt="" />
    </a>
  )
}

export default function Bookmarks () {
  const [activeBook, setActiveBook] = useState(null)
  const [books, setBooks] = useState([])
  const globalLinks = useGlobalStore(state => state.globalLinks)

  const bookmarks = useMemo(() => globalLinks.filter(link => link.bookmark !== false), [globalLinks])
  const bookmarksId = useMemo(() => bookmarks.map((book) => book._id), [bookmarks, globalLinks])
  useEffect(() => {
    setBooks(bookmarks)
  }, [bookmarks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0
      }
    })
  )

  const onDragStart = (event) => {
    if (event.active.data.current?.type === 'bookmark') {
      setActiveBook(event.active.data.current.bookmark)
    }
  }
  const onDragEnd = async (event) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === 'bookmark'
    const isOverATask = over.data.current?.type === 'bookmark'

    if (!isActiveATask) return

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const activeIndex = books.findIndex((t) => t._id === activeId)
      const overIndex = books.findIndex((t) => t._id === overId)
      setBooks(arrayMove(books, activeIndex, overIndex))
    }
    setActiveBook(null)
  }
  // const onDragOver = (event) => {
  // }
  return (
    <div className={styles.bookmarks}>
      <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              // onDragOver={onDragOver}
            >
              <SortableContext items={bookmarksId} strategy={verticalListSortingStrategy}>
        {
            books?.length > 0
              ? (
                  books?.map((book) =>
                    (
                        <BookmarkItem key={book._id} bookmark={book} />
                    )
                  )
                )
              : <p>No hay favoritos</p>

        }
        </SortableContext>
        {
            createPortal(
                <DragOverlay>
                {
                  <BookmarkItem bookmark={activeBook}/>
                }
                </DragOverlay>
                , document.body)
        }
      </DndContext>
    </div>
  )
}
