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
import { ArrowDown } from './Icons/icons'

export default function Columna ({ data, children }) {
  const columna = data.columna || data.activeColumn
  const setPoints = useFormsStore(state => state.setPoints)
  const [editMode, setEditMode] = useState(false)
  const [open, setOpen] = useState(false)
  const openClass = open ? styles.colOpen : ''
  const colRef = useRef(null)
  const headRef = useRef(null)
  const { desktopName } = useParams()
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const setActiveColumn = useFormsStore(state => state.setActiveColumn)
  const setColumnContextMenuVisible = useFormsStore(state => state.setColumnContextMenuVisible)
  const childCount = children?.props.children[0]?.length || 0

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
          className={`${styles.column} ${openClass}`}
          id={columna._id}
          {...attributes}
          {...listeners}
        >
          {
            editMode
              ? <input type='text' className={styles.editInput} defaultValue={columna.name} onBlur={handleHeaderBlur} onKeyDown={handleHeaderBlur} autoFocus/>
              : <div className={styles.headContainer} onContextMenu={(e) => handleContextMenu(e) }>
                  <h2 onClick={() => setEditMode(true) } ref={headRef} >
                    {columna.name}
                  </h2>
                  <div className={styles.opener} onClick={() => setOpen(!open)}>
                    {
                      childCount >= 8 && <ArrowDown/>
                    }
                  </div>
                </div>
          }
            {children}
        </div>
      </div>
    </>
  )
}
