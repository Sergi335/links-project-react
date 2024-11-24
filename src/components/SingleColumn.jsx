import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { editColumn } from '../services/dbQueries'
import { handleResponseErrors } from '../services/functions'
import { useFormsStore } from '../store/forms'
import { useGlobalStore } from '../store/global'
import { useLinksStore } from '../store/links'
import { usePreferencesStore } from '../store/preferences'
import styles from './Column.module.css'
import { SelectIcon } from './Icons/icons'

export default function SingleColumn ({ data, children, childCount }) {
  const { desktopName } = useParams()
  const columna = data.columna || data.activeColumn
  const [editMode, setEditMode] = useState(false)
  const colRef = useRef(null)
  const headRef = useRef(null)
  const spanCountRef = useRef(null)
  const setPoints = useFormsStore(state => state.setPoints)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const selectModeGlobal = usePreferencesStore(state => state.selectModeGlobal)
  const setSelectModeGlobal = usePreferencesStore(state => state.setSelectModeGlobal)
  const setColumnSelectModeId = usePreferencesStore(state => state.setColumnSelectModeId)
  const setActiveColumn = useFormsStore(state => state.setActiveColumn)
  const setColumnContextMenuVisible = useFormsStore(state => state.setColumnContextMenuVisible)
  const columnSelectModeId = usePreferencesStore(state => state.columnSelectModeId)
  const selectedLinks = usePreferencesStore(state => state.selectedLinks)
  const setSelectedLinks = usePreferencesStore(state => state.setSelectedLinks)
  const linkLoader = useLinksStore(state => state.linkLoader)

  const handleSetSelectMode = (e) => {
    e.stopPropagation()
    const column = document.getElementById(columna._id)
    setSelectModeGlobal(!selectModeGlobal)
    const prevState = [...columnSelectModeId]
    if (prevState.includes(e.currentTarget.id)) {
      column.classList.remove('selectMode')
      const index = prevState.findIndex((id) => id === e.currentTarget.id)
      prevState.splice(index, 1)
      setColumnSelectModeId(prevState)
    } else {
      column.classList.add('selectMode')
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

  useEffect(() => {
    setSelectModeGlobal(false)
    setSelectedLinks([])
    setColumnSelectModeId([])
  }, [desktopName])

  return (
    <>
      <div
        id={columna._id}
        className={`${styles.column_wrapper} colOpen ${styles.scPage}`}
        data-order={columna.order}
      >
        <div
          ref={colRef}
          className={`${styles.column} column`}
        >
          {
            editMode
              ? <input type='text' className={styles.editInput} defaultValue={columna.name} onBlur={handleHeaderBlur} onKeyDown={handleHeaderBlur} autoFocus/>
              : <div className={styles.column_header} onContextMenu={(e) => handleContextMenu(e) }>
                {columnSelectModeId.includes(columna._id) && <input type='checkbox' className={styles.selectCheckbox} onChange={handleSelectChange}/>}
                  <h2 onClick={() => setEditMode(true) } ref={headRef} style={linkLoader ? { flexGrow: 0, marginRight: '15px' } : {}}>
                    {columna.name}
                    {
                      childCount > 7 && <span ref={spanCountRef} className='linkCount'>{`+${childCount - 7}`}</span>
                    }
                  </h2>
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
