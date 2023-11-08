import { useState, useEffect, useRef } from 'react'
import styles from './column.module.css'
import ContextualColMenu from './ContextualColMenu'
import AddLinkForm from './AddLinkForm'
import { editColumn } from '../services/functions'
import { useParams } from 'react-router-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useColumnsStore } from '../store/columns'
import { useDesktopsStore } from '../store/desktops'
import { usePreferencesStore } from '../store/preferences'

export default function Columna ({ data, children }) {
  const columna = data.columna || data.activeColumn
  const [visible, setVisible] = useState(false)
  const [points, setPoints] = useState({ x: 0, y: 0 })
  const colRef = useRef(null)
  const headRef = useRef(null)
  const [formVisible, setFormVisible] = useState(false)
  const { desktopName } = useParams()
  const columnsStore = useColumnsStore(state => state.columnsStore)
  const setColumnsStore = useColumnsStore(state => state.setColumnsStore)
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  // Creamos listeners para ocultar contextmenu
  useEffect(() => {
    const handleClick = (event) => {
      setVisible(false)
    }
    const handleContextOutside = (event) => {
      if (!colRef.current.contains(event.target)) {
        setVisible(false)
      }
    }
    window.addEventListener('contextmenu', handleContextOutside)
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('contextmenu', handleContextOutside)
      window.removeEventListener('click', handleClick)
    }
  }, [])

  const handleContextMenu = (event) => {
    event.preventDefault()
    if (visible === false) {
      setVisible(true)
    }
    setPoints({
      x: event.pageX,
      y: event.pageY
    })
  }
  const handleClick = (event) => {
    if (formVisible === false) {
      setFormVisible(true)
    }
  }
  const handleEditable = () => {
    headRef.current.setAttribute('contenteditable', true)
    headRef.current.focus()
  }
  const handleHeaderBlur = (event) => {
    console.log('blur')
    headRef.current.setAttribute('contenteditable', false)
    const newName = event.currentTarget.innerHTML
    console.log(newName)
    console.log(columna.name)
    if (columna.name !== newName) {
      const updatedState = [...columnsStore]
      const elementIndex = updatedState.findIndex(element => element._id === columna._id)
      if (elementIndex !== -1) {
        const objeto = updatedState[elementIndex]
        updatedState[elementIndex] = { ...objeto, name: newName }
      }
      setColumnsStore(updatedState)
      activeLocalStorage ?? localStorage.setItem(`${desktopName}Columns`, JSON.stringify(updatedState.toSorted((a, b) => (a.orden - b.orden))))
      editColumn(newName, desktopName, columna._id)
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
        <div ref={colRef} className={styles.column} id={columna._id}>
          <h2 ref={headRef}
              onContextMenu={handleContextMenu}
              onClick={handleEditable}
              onBlur={handleHeaderBlur}
              {...attributes}
              {...listeners}
              >{columna.name}</h2>
            {children}
        </div>
      </div>
      {
        visible
          ? <ContextualColMenu
              visible={visible}
              points={points}
              params={columna}
              desktopColumns={columnsStore}
              setDesktopColumns={setColumnsStore}
              desktops={desktopsStore}
              handleClick={handleClick}
              handleEditable={handleEditable}/>
          : null
      }
      {
        formVisible
          ? <AddLinkForm
              formVisible={formVisible}
              setFormVisible={setFormVisible}
              params={columna}
              desktopName={desktopName}
              />
          : null
      }
    </>
  )
}
