import { useState, useEffect, useRef } from 'react'
import styles from './column.module.css'
import ContextualColMenu from './ContextualColMenu'
import AddLinkForm from './AddLinkForm'
import { editColumn } from '../services/functions'
import { useParams } from 'react-router-dom'

export default function Columna ({ data, children, desktopColumns, setDesktopColumns, desktops, desktopLinks, setDesktopLinks }) {
  const { columna } = data
  const [visible, setVisible] = useState(false)
  const [points, setPoints] = useState({ x: 0, y: 0 })
  const colRef = useRef(null)
  const headRef = useRef(null)
  const [formVisible, setFormVisible] = useState(false)
  const { desktopName } = useParams()

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
      editColumn(newName, desktopName, columna._id)
    }
  }
  return (
    <>
      <div ref={colRef} className={styles.columnWrapper}>
        <div className={styles.column} id={columna._id}>
          <h2 ref={headRef}
              onContextMenu={handleContextMenu}
              onClick={handleEditable}
              onBlur={handleHeaderBlur}>{columna.name}</h2>
            {children}
        </div>
      </div>
      {
        visible
          ? <ContextualColMenu
              visible={visible}
              points={points}
              params={columna}
              desktopColumns={desktopColumns}
              setDesktopColumns={setDesktopColumns}
              desktops={desktops}
              handleClick={handleClick}
              desktopLinks={desktopLinks}
              setDesktopLinks={setDesktopLinks}
              handleEditable={handleEditable}/>
          : null
      }
      {
        formVisible
          ? <AddLinkForm
              formVisible={formVisible}
              setFormVisible={setFormVisible}
              params={columna}
              desktopLinks={desktopLinks}
              setDesktopLinks={setDesktopLinks}/>
          : null
      }
    </>
  )
}
