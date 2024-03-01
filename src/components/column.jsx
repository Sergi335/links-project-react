import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React, { useCallback, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { editColumn } from '../services/dbQueries'
import { handleResponseErrors } from '../services/functions'
import { useFormsStore } from '../store/forms'
import { useGlobalStore } from '../store/global'
import { usePreferencesStore } from '../store/preferences'
import { ArrowDown, SelectIcon } from './Icons/icons'
import styles from './column.module.css'

export default function Columna ({ data, children }) {
  const columna = data.columna || data.activeColumn
  const setPoints = useFormsStore(state => state.setPoints)
  const [editMode, setEditMode] = useState(false)
  const [selectMode, setSelectMode] = useState(false)
  // const [open, setOpen] = useState(false)
  // const openClass = open ? styles.colOpen : ''
  const selectModeClass = selectMode ? 'selectMode' : ''
  const colRef = useRef(null)
  const headRef = useRef(null)
  const { desktopName } = useParams()
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const selectModeGlobal = usePreferencesStore(state => state.selectModeGlobal)
  const setSelectModeGlobal = usePreferencesStore(state => state.setSelectModeGlobal)
  const setColumnSelectModeId = usePreferencesStore(state => state.setColumnSelectModeId)
  const setActiveColumn = useFormsStore(state => state.setActiveColumn)
  const setColumnContextMenuVisible = useFormsStore(state => state.setColumnContextMenuVisible)
  const childCount = children?.props.children[0]?.length || 0
  const columnSelectModeId = usePreferencesStore(state => state.columnSelectModeId)
  const selectedLinks = usePreferencesStore(state => state.selectedLinks)
  const setSelectedLinks = usePreferencesStore(state => state.setSelectedLinks)
  const maxHeight = (10 + 2 + 38) * childCount + (3 * childCount)

  const handleChangeColumnHeight = (e) => {
    const opener = e.currentTarget
    const column = opener.parentNode.parentNode.parentNode
    const openColumn = () => {
      column.classList.toggle(styles.colOpen)
      opener.childNodes[0].classList.toggle(styles.rotate)
      if (column.classList.contains(styles.colOpen)) {
        column.style.maxHeight = `${maxHeight}px`
      } else {
        column.style.maxHeight = ''
      }
    }
    openColumn()
  }
  const handleSetSelectMode = (e) => {
    e.stopPropagation()
    setSelectMode(!selectMode) // se podria pasar desde el componente padre a ambos y nos quitamos el global? = no por que no seria independiente
    setSelectModeGlobal(!selectModeGlobal) // al cambiar el global se cambia el de todos los componentes y renderiza todos (no aunque se desactive sigue renderizando todos)
    const prevState = [...columnSelectModeId]
    if (prevState.includes(e.currentTarget.id)) {
      const index = prevState.findIndex((id) => id === e.currentTarget.id)
      prevState.splice(index, 1)
      setColumnSelectModeId(prevState)
    } else {
      prevState.push(e.currentTarget.id)
      setColumnSelectModeId(prevState)
    }
  }
  const handleSelectChange = (e) => {
    const inputs = colRef.current.querySelectorAll('input[type="checkbox"]')
    const links = colRef.current.querySelectorAll('.link')
    const newState = []
    const prevState = [...selectedLinks]
    inputs.forEach(input => { // esto los marca y desmarca todos
      input.checked = e.currentTarget.checked
    })
    links.forEach(link => { // esto los introduce o saca del array de seleccionados
      if (e.currentTarget.checked) {
        const index = prevState.findIndex(id => id === link.id)
        if (index === -1) {
          newState.push(link.id)
          link.classList.add('active')
        }
      } else {
        const index = prevState.findIndex(id => id === link.id)
        prevState.splice(index, 1)
        link.classList.remove('active')
      }
    })
    setSelectedLinks([...prevState, ...newState])
  }
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
    isDragging
  } = useSortable({
    id: columna._id,
    data: {
      type: 'Column',
      columna
    }
  })
  const style = {
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
    {/* Debe tener la misma altura y ancho que cuando esta sin arrastrar para no tener problemas */}
      <div ref={setNodeRef} id={columna._id} style={style} className={`${styles.columnWrapper} ${selectModeClass}`} data-order={columna.order}>
        <div
          ref={colRef}
          className={`${styles.column} column`}
          {...attributes}
          {...listeners}
        >
          {
            editMode
              ? <input type='text' className={styles.editInput} defaultValue={columna.name} onBlur={handleHeaderBlur} onKeyDown={handleHeaderBlur} autoFocus/>
              : <div className={styles.headContainer} onContextMenu={(e) => handleContextMenu(e) }>
                {selectMode && <input type='checkbox' className={styles.selectCheckbox} onChange={handleSelectChange}/>}
                  <h2 onClick={() => setEditMode(true) } ref={headRef} >
                    {columna.name}
                  </h2>
                  <div className={styles.opener} onClick={handleChangeColumnHeight}>
                    {
                      childCount > 6 && <ArrowDown className='uiIcon_small'/>
                    }
                  </div>
                  <div id={columna._id} onClick={handleSetSelectMode} className={styles.selector}>
                    <SelectIcon className='uiIcon_small'/>
                  </div>
                </div>
          }
            {children}
        </div>
      </div>
    </>
  )
}
