import { DndContext, DragOverlay, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'react-toastify'
import { setBookMarksOrder } from '../services/dbQueries'
import { handleResponseErrors } from '../services/functions'
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
    <a ref={setNodeRef} style={style} href={bookmark.URL} target='_blank' data-order={bookmark.bookmarkOrder} rel="noreferrer" {...attributes} {...listeners}>
      <img className={styles.bookmark} src={bookmark.imgURL} alt="" />
    </a>
  )
}

export default function Bookmarks () {
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const [books, setBooks] = useState([])
  const [booksOrder, setBooksOrder] = useState([])
  const [activeBook, setActiveBook] = useState(null)
  const bookmarksId = books.map((book) => book._id)

  // console.log(import.meta.env.MODE)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0
      }
    })
  )

  // Estado Inicial
  useEffect(() => {
    setBooks(globalLinks.filter(link => link.bookmark !== false).toSorted((a, b) => a.bookmarkOrder - b.bookmarkOrder))
    setBooksOrder(Array.from(new Map(globalLinks.filter(link => link.bookmark !== false).map((item, index) => [item._id, index]))))
  }, [globalLinks])

  // Detectar si se ha movido un elemento para llamar al backend
  useEffect(() => {
    if (activeBook) {
      // console.log(`Has movido un elemento: ${activeBook.name}`)
      // console.log(`El nuevo orden es: ${booksOrder}`)
      handleSetOrder()
    }
  }, [booksOrder])

  // Actualizar el orden cada vez que cambie books al soltar el elemento activo
  useEffect(() => {
    setBooksOrder(Array.from(new Map(books.map((item, index) => [item._id, index]))))
  }, [books])

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
      // setMovedBookmark(activeBook)
    }
    // setActiveBook(null)
  }

  const handleSetOrder = async () => {
    const response = await setBookMarksOrder({ links: booksOrder })
    const { hasError, message } = handleResponseErrors(response)
    let error
    if (response.message !== undefined) {
      error = response.message.join('\n')
    } else {
      error = message
    }
    if (hasError) {
      toast(error)
      // return
    }
  }
  return (
    <div className={styles.bookmarks}>
      <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              // onDragOver={onDragOver}
            >
              <SortableContext items={bookmarksId} strategy={horizontalListSortingStrategy}>
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
