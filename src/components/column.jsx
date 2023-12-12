import { useCallback, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import styles from './column.module.css'
import { editColumn } from '../services/dbQueries'
import { useParams } from 'react-router-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useGlobalStore } from '../store/global'
import { usePreferencesStore } from '../store/preferences'
import { useFormsStore } from '../store/forms'
import { handleResponseErrors } from '../services/functions'

export default function Columna ({ data, children }) {
  const columna = data.columna || data.activeColumn
  const setPoints = useFormsStore(state => state.setPoints)
  const [editMode, setEditMode] = useState(false)
  const colRef = useRef(null)
  const headRef = useRef(null)
  const { desktopName } = useParams()
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const setActiveColumn = useFormsStore(state => state.setActiveColumn)
  const setColumnContextMenuVisible = useFormsStore(state => state.setColumnContextMenuVisible)

  const handleContextMenu = useCallback((event) => {
    event.preventDefault()
    setPoints({ x: event.pageX, y: event.pageY })
    setColumnContextMenuVisible(true)
    setActiveColumn(columna)
  }, [columna, setPoints, setColumnContextMenuVisible, setActiveColumn])

  const handleHeaderBlur = async (event) => {
    if (event.type === 'keydown' && event.key !== 'Enter') return
    setEditMode(false)
    const newName = event.currentTarget.value
    if (columna.name !== newName) {
      const updatedState = [...globalColumns]
      const elementIndex = updatedState.findIndex(element => element._id === columna._id)
      if (elementIndex !== -1) {
        const objeto = updatedState[elementIndex]
        updatedState[elementIndex] = { ...objeto, name: newName }
      }
      setGlobalColumns(updatedState)
      activeLocalStorage ?? localStorage.setItem(`${desktopName}Columns`, JSON.stringify(updatedState.toSorted((a, b) => (a.orden - b.orden))))
      const response = await editColumn({ name: newName, idPanel: columna._id })

      const { hasError, message } = handleResponseErrors(response)
      if (hasError) {
        toast(message)
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
  const dragginStyle = {
    transition,
    transform: CSS.Transform.toString(transform),
    height: '34px'
  }
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={dragginStyle}
        className={styles.dragginColumn}
      ><h2></h2></div>
    )
  }
  return (
    <>
    {/* Debe tener la misma altura y ancho que cuando esta sin arrastrar para no tener problemas */}
      <div ref={setNodeRef} style={style} className={styles.columnWrapper} data-order={columna.order}>
        <div
          ref={colRef}
          className={styles.column}
          id={columna._id}
          {...attributes}
          {...listeners}
        >
          {
            editMode
              ? <input type='text' defaultValue={columna.name} onBlur={handleHeaderBlur} onKeyDown={handleHeaderBlur} autoFocus/>
              : <h2 onClick={() => setEditMode(true) } ref={headRef} onContextMenu={(e) => handleContextMenu(e) }>{columna.name}</h2>
          }
            {children}
        </div>
      </div>
    </>
  )
}
