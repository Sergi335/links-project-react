import { useCallback, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import styles from './column.module.css'
import { editColumn } from '../services/dbQueries'
import { useParams } from 'react-router-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useColumnsStore } from '../store/columns'
import { usePreferencesStore } from '../store/preferences'
import { useFormsStore } from '../store/forms'

export default function Columna ({ data, children }) {
  const columna = data.columna || data.activeColumn
  const setPoints = useFormsStore(state => state.setPoints)
  const [editMode, setEditMode] = useState(false)
  const colRef = useRef(null)
  const headRef = useRef(null)
  const { desktopName } = useParams()
  const columnsStore = useColumnsStore(state => state.columnsStore)
  const setColumnsStore = useColumnsStore(state => state.setColumnsStore)
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const setActiveColumn = useFormsStore(state => state.setActiveColumn)
  const setColumnContextMenuVisible = useFormsStore(state => state.setColumnContextMenuVisible)

  const handleContextMenu = useCallback((event) => {
    event.preventDefault()
    setPoints({ x: event.pageX, y: event.pageY })
    setColumnContextMenuVisible(true)
    setActiveColumn(columna)
  }, [columna, setPoints, setColumnContextMenuVisible, setActiveColumn])

  // TODO CAMBIAR NOMBRE AL PRESIONAR ENTER?
  const handleHeaderBlur = async (event) => {
    setEditMode(false)
    const newName = event.currentTarget.value
    if (columna.name !== newName) {
      const updatedState = [...columnsStore]
      const elementIndex = updatedState.findIndex(element => element._id === columna._id)
      if (elementIndex !== -1) {
        const objeto = updatedState[elementIndex]
        updatedState[elementIndex] = { ...objeto, name: newName }
      }
      setColumnsStore(updatedState)
      activeLocalStorage ?? localStorage.setItem(`${desktopName}Columns`, JSON.stringify(updatedState.toSorted((a, b) => (a.orden - b.orden))))
      const response = await editColumn(newName, desktopName, columna._id)

      // Error de red
      if (!response._id && !response.ok && response.error === undefined) {
        toast('Error de red')
        return
      }
      // Error http
      if (!response._id && !response.ok && response.status !== undefined) {
        toast(`${response.status}: ${response.statusText}`)
        return
      }
      // Error personalizado
      if (!response._id && response.error) {
        toast(`Error: ${response.error}`)
      }
    }
  }
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: columna._id,
    data: {
      type: 'Column',
      columna
    }
  })
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={styles.dragginColumn}
      ><h2></h2></div>
    )
  }
  return (
    <>
      <div ref={setNodeRef} style={style} className={styles.columnWrapper}>
        <div
          ref={colRef}
          className={styles.column}
          id={columna._id}
          onContextMenu={(e) => handleContextMenu(e) }
          onClick={() => setEditMode(true) }
          {...attributes}
          {...listeners}
        >
          {
            editMode
              ? <input type='text' defaultValue={columna.name} onBlur={handleHeaderBlur} autoFocus/>
              : <h2 ref={headRef}>{columna.name}</h2>
          }
            {children}
        </div>
      </div>
    </>
  )
}
