import { DndContext, DragOverlay, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'react-toastify'
import { setBookMarksOrder } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
import BookmarkLoader from './BookmarkLoader'
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
    <a ref={setNodeRef} style={style} href={bookmark.URL} title={bookmark.name} target='_blank' data-order={bookmark.bookmarkOrder} rel="noreferrer" {...attributes} {...listeners}>
      <img className={styles.bookmark} src={bookmark.imgUrl} alt="" />
    </a>
  )
}

export default function Bookmarks () {
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const [books, setBooks] = useState([])
  // console.log('🚀 ~ Bookmarks ~ books:', books)
  const [booksOrder, setBooksOrder] = useState([])
  const [activeBook, setActiveBook] = useState(null)
  const [prevBooks, setPrevBooks] = useState([]) // Nuevo estado para guardar el orden anterior
  const bookmarksId = books.map((book) => book._id)
  const globalLoading = useGlobalStore(state => state.globalLoading)

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
  }, [globalLinks])

  // Detectar si se ha movido un elemento para llamar al backend
  useEffect(() => {
    if (activeBook) {
      handleSetOrder()
      setActiveBook(null)
    }
  }, [booksOrder])

  // Actualizar el orden cada vez que cambie books al soltar el elemento activo
  useEffect(() => {
    for (let i = 0; i < books.length; i++) {
      const book = books[i]
      book.bookmarkOrder = i
    }
    setBooksOrder(books.map((item) => [item._id, item.bookmarkOrder]))
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

    // Optimistic UI: guarda el estado anterior antes de mover
    setPrevBooks(books)

    if (isActiveATask && isOverATask) {
      const activeIndex = books.findIndex((t) => t._id === activeId)
      const overIndex = books.findIndex((t) => t._id === overId)
      setBooks(arrayMove(books, activeIndex, overIndex))
    }
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
      // Si falla, restaurar el estado anterior
      setBooks(prevBooks)
      return
    }
    // Si todo va bien, limpiar prevBooks
    setPrevBooks([])
    // console.log(response)
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
            globalLoading && <><BookmarkLoader /><BookmarkLoader /><BookmarkLoader /><BookmarkLoader /></>
          }
          {
            books?.length > 0 &&
            (
              books?.map((book) =>
                (
                <BookmarkItem key={book._id} bookmark={book} />
                )
              )
            )

          }
        </SortableContext>
        {
          createPortal(
            <DragOverlay>
              {
                <BookmarkItem bookmark={activeBook} />
              }
            </DragOverlay>
            , document.body)
        }
      </DndContext>
    </div>
  )
}
