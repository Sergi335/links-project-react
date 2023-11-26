import styles from './SideInfo.module.css'
import { saludo } from '../services/functions'
import { useEffect, useState } from 'react'
import Clock from './Clock'
import { createColumn } from '../services/dbQueries'
import { useSessionStore } from '../store/session'
import { useColumnsStore } from '../store/columns'
import { useDesktops } from '../hooks/useDesktops'
import { useParams, useNavigate } from 'react-router-dom'
import { useFormsStore } from '../store/forms'
import { useDesktopsStore } from '../store/desktops'
import { usePreferencesStore } from '../store/preferences'

export default function SideInfo ({ environment }) {
  const { desktopName } = useParams()
  const user = useSessionStore(state => state.user)
  // console.log(user)
  const columnsStore = useColumnsStore(state => state.columnsStore)
  const setColumnsStore = useColumnsStore(state => state.setColumnsStore)
  const customizePanelVisible = useFormsStore(state => state.customizePanelVisible)
  // console.log('🚀 ~ file: SideInfo.jsx:21 ~ SideInfo ~ customizePanelVisible:', customizePanelVisible)
  const setCustomizePanelVisible = useFormsStore(state => state.setCustomizePanelVisible)
  const { desktop } = useDesktops({ desktopName })
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const [desktopDisplayName, setDesktopDisplayName] = useState()
  const numberCols = Number(usePreferencesStore(state => state.numberOfColumns))
  // const numberOfColumns = usePreferencesStore(state => state.numberOfColumns)
  const numRows = Math.ceil(columnsStore.length / numberCols)
  const result = []
  const [salut, setSalut] = useState('')
  const navigate = useNavigate()

  for (let i = 0; i < numRows; i++) {
    const startIdx = i * numberCols
    const row = [...columnsStore].slice(startIdx, startIdx + numberCols)
    result.push(row)
  }

  useEffect(() => {
    setSalut(saludo(user?.realName || 'Usuario'))
  }, [])
  useEffect(() => {
    const newDeskName = (window.location.pathname).replace('/desktop/', '')
    const newDeskObject = desktopsStore.find(desk => desk.name === decodeURIComponent(newDeskName))
    setDesktopDisplayName(newDeskObject?.displayName)
  }, [desktopsStore])

  useEffect(() => {
    const sideBlocks = Array.from(document.querySelectorAll('.block'))
    // console.log(sideBlocks)
    sideBlocks[0]?.classList.add('sectActive')
    const elements = sideBlocks.map(el => (
      {
        el,
        mappedEls: Array.from(el.children).map(item => (document.getElementById((`${item.id}`).replace('Side', ''))))
      }
    ))
    // console.log(elements)
    const handleScroll = (event) => {
      // Por cada panel izquierdo recogemos las props de cada elemento mapeado
      // console.log(event)
      elements.forEach(targ => {
        const props = targ.mappedEls.map(elem => (
          elem.getBoundingClientRect()
        ))
        // console.log(targ.mappedEls)
        // cogemos el primero por que todos están a la misma altura
        const elementTopPosition = props[0].top
        // console.log('🚀 ~ file: styles.js:163 ~ sideInfo ~ elementTopPosition:', elementTopPosition)
        // de las props cogemos el valor bottom
        // const elementMaxBottomPosition = props.map(elem => (
        // elem.bottom
        // ))
        // Y seleccionamos el mayor de cada panel
        // const maxBottom = Math.max(...elementMaxBottomPosition)
        // console.log(maxBottom)
        // console.log(elementMaxBottomPosition)
        // si la posicion de la parte superior de la fila es mayor a 141 y menor a 1414 o la posicion bottom maxima de cada columna es mayor a 141 o menor a 1414
        if (Math.abs(elementTopPosition >= 141) && Math.abs(elementTopPosition <= 1141)) {
          targ.el.classList.add('sectActive')
        } else {
          targ.el.classList.remove('sectActive')
        }
      })
    }
    // const contenedor = document.body
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [result])

  const handleClick = async () => {
    const newColumn = await createColumn('New Column', desktop.name, columnsStore.length)

    setColumnsStore((() => { return [...columnsStore, { ...newColumn[0] }] })())
  }
  const handleNavigate = () => {
    // <NavLink to={`/desktop/${escritorio.name}`}>{escritorio.displayName}</NavLink>
    navigate('/desktop/readinglist')
  }
  const handleHideColumns = () => {
    const container = document.getElementById('maincontent')
    // const visible = container.style.display === 'none'
    container.style.display === 'none' ? container.style.display = 'grid' : container.style.display = 'none'
  }
  const handleScrollIntoView = (event) => {
    event.preventDefault()
    const element = document.getElementById(`${event.target.id.replace('Side', '')}`)
    element.scrollIntoView({ block: 'center', behavior: 'smooth' })
    element.classList.add('sideInfoSelectedCol')
    setTimeout(() => {
      element.classList.remove('sideInfoSelectedCol')
    }, 1000)
  }
  return (
      <div id='sideinfo' className={styles.sideInfo}>
          <div className={styles.deskInfos}>
              <Clock />
              <p className={styles.saludo}>{salut}</p>
              <p className="deskTitle" id="deskTitle" style={{ color: 'var(--firstTextColor)' }}>{desktopDisplayName}</p>
          </div>
          {
             environment === 'listoflinks' && (
             <div className={styles.deskControls}>

                 <svg className={styles.uiIcon} id="hidePanels" onClick={handleHideColumns} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"></path></svg>

                 <svg className={styles.uiIcon} id="readingList" onClick={handleNavigate} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"></path></svg>

                 <svg className={styles.uiIcon} id="editDesk" onClick={() => { setCustomizePanelVisible(!customizePanelVisible) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path></svg>

                 <svg className={styles.uiIcon} onClick={handleClick} id="addCol" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"></path></svg>

              </div>
             )}

              {
                environment === 'listoflinks' && (
                  <div id="sectContainer">
                  {
                  result.map((subarray, index) => (
                      <div key={index} className={`${styles.sect} block`}>
                          {
                          subarray.map(column => (
                                  <a onClick={handleScrollIntoView} key={column._id} id={`Side${column._id}`}>{column.name}</a>
                          ))
                          }
                    </div>
                  ))
                  }
          </div>
                )
              }

          </div>
  )
}
