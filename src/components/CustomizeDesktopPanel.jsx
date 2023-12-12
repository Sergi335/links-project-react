import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useDesktopsStore } from '../store/desktops'
import { constants } from '../services/constants'
import { formatPath, handleResponseErrors } from '../services/functions'
import { usePreferencesStore } from '../store/preferences'
import { editDesktop, changeBackgroundImage, getBackgroundMiniatures } from '../services/dbQueries'
import { toast } from 'react-toastify'
import styles from './CustomizeDesktopPanel.module.css'
import useHideForms from '../hooks/useHideForms'
import { useFormsStore } from '../store/forms'

export default function CustomizeDesktopPanel ({ customizePanelVisible }) {
  const [miniatures, setMiniatures] = useState()
  const [hiddenDesktops, setHiddenDesktops] = useState([]) // store
  const inputRef = useRef()
  const formRef = useRef()
  const { desktopName } = useParams()
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)
  const setStyleOfColumns = usePreferencesStore(state => state.setStyleOfColumns)
  const setNumberOfColumns = usePreferencesStore(state => state.setNumberOfColumns)
  const numberOfColumns = usePreferencesStore(state => state.numberOfColumns)
  const desktop = desktopsStore.filter(desk => desk.name === desktopName)
  const accentColors = Object.keys(constants.ACCENT_COLORS)
  const sideInfoStyles = Object.keys(constants.SIDE_INFO_STYLES)
  const visibleClassName = customizePanelVisible ? styles.slideIn : ''
  const setCustomizePanelVisible = useFormsStore(state => state.setCustomizePanelVisible)
  useHideForms({ form: formRef.current, setFormVisible: setCustomizePanelVisible })
  // Debería estar montado y ocultarlo y mostrarlo mediante clases css
  const handleSubmit = async (event) => {
    event.preventDefault()
    const newName = inputRef.current.value.trim()
    const name = formatPath(newName)
    const body = { newName, oldName: desktopName, name }
    // if new === old return
    const response = await editDesktop(body)
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
      return
    }
    const { data } = response
    const url = new URL(window.location.href)
    url.pathname = `desktop/${name}`
    window.history.pushState(null, null, url)
    const changeUrlEvent = new Event('changeurl')
    window.dispatchEvent(changeUrlEvent)
    setDesktopsStore(data)
  }
  const handleNumberColumnsChange = (event) => {
    setNumberOfColumns(event.target.value)
    setStyleOfColumns(constants.COLUMNS_COUNT[event.target.value])
    localStorage.setItem('styleOfColumns', JSON.stringify(constants.COLUMNS_COUNT[event.target.value]))
    localStorage.setItem('numberOfColumns', JSON.stringify(event.target.value))
  }
  const handleChangeBackgroundImage = async (event) => {
    const response = await changeBackgroundImage(event)
    // Error de red
    if (!response.startsWith('http') && !response.ok && response.error === undefined) {
      toast('Error de red')
      return
    }
    // Error http
    if (!response.startsWith('http') && !response.ok && response.status !== undefined) {
      toast(`${response.status}: ${response.statusText}`)
      return
    }
    // Error personalizado
    if (!response.startsWith('http') && response.error) {
      toast(`Error: ${response.error}`)
    }
  }
  const handleChangePanelStyles = (event) => {
    const currentStyle = event?.target.id
    const panel = document.getElementById('sideinfo')
    constants.SIDE_INFO_STYLES[currentStyle].applyStyles(panel)
    window.localStorage.setItem('sideInfoStyles', JSON.stringify(currentStyle))
  }
  const handleChangeAccentColor = (event) => {
    const color = event.target.id
    constants.ACCENT_COLORS[color].applyStyles()
  }
  const handleHideDesktops = async (event) => {
    const name = formatPath(event.target.value)
    const body = { name, hidden: true }
    const response = await editDesktop(body)
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
      return
    }
    const newState = [...desktopsStore].filter(desktop => desktop.displayName !== event.target.value)
    setDesktopsStore(newState)
    const newHiddenState = [...hiddenDesktops, event.target.value]
    setHiddenDesktops(newHiddenState)
  }
  const handleRestoreDesktop = async (event) => {
    event.preventDefault()
    const name = formatPath(event.target.value)
    const body = { name, hidden: false }
    const response = await editDesktop(body)
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
      return
    }
    const newState = [...response].filter(desktop => desktop.hidden !== true)
    setDesktopsStore(newState)
    const newHiddenState = hiddenDesktops.filter(desktop => desktop !== event.target.innerText)
    setHiddenDesktops(newHiddenState)
  }
  useEffect(() => {
    getBackgroundMiniatures()
      .then(response => {
        // Error de red
        if (!Array.isArray(response) && !response.ok && response.error === undefined) {
          toast('Error de red')
          return
        }
        // Error http
        if (!Array.isArray(response) && !response.ok && response.status !== undefined) {
          toast(`${response.status}: ${response.statusText}`)
          return
        }
        // Error personalizado
        if (!Array.isArray(response) && response.error) {
          toast(`Error: ${response.error}`)
        }
        setMiniatures(response)
      })
      .catch(error => {
        toast({ error })
      })
  }, [])
  // Ocultar escritorios con select?
  // const visibleClass = customizePanelVisible ? styles.flex : styles.hidden
  return (
    <>
             <div ref={formRef} className={`${styles.customizePanel} ${visibleClassName}`}>
                <div className={styles.wrapper}>
                  <h3>Personaliza Escritorio</h3>
                  <form style={{ display: 'flex', flexDirection: 'column', marginBottom: '25px' }} onSubmit={handleSubmit}>
                    <div className={`${styles.formControl} ${styles.hasRowGroup}`}>
                      <div className={styles.rowGroup} style={{ position: 'relative' }}>
                          <label htmlFor="changeDesktopName" style={{ marginBottom: '6px', textAlign: 'left', width: '100%' }}>Nombre:</label>
                          <input ref={inputRef} type="text" name="changeDesktopName" id="changeDesktopName" defaultValue={desktop[0]?.displayName}/>
                          <button className={styles.inputButton} type='submit'>Modificar</button>
                      </div>
                      <div className={styles.rowGroup}>
                          <label htmlFor="" style={{ marginBottom: '6px', textAlign: 'left', width: '100%' }}>Número de columnas:&nbsp;<strong>{numberOfColumns}</strong></label>
                          <input className={styles.range} type="range" list="steplist" min={1} max={5} value={numberOfColumns} onChange={handleNumberColumnsChange} />
                          <datalist id="steplist">
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </datalist>
                      </div>
                    </div>
                      <h3>Ocultar Escritorios</h3>
                      <div className={`${styles.formControl} ${styles.hasRowGroup}`}>
                         <div className={styles.rowGroup}>
                         <label htmlFor="" style={{ marginBottom: '10px', textAlign: 'left', width: '100%' }}>Seleccionar:</label>
                          <select name="" id="" onChange={handleHideDesktops}>
                          {
                              desktopsStore.map(desktop => {
                                return <option key={desktop._id} value={desktop.displayName}>{desktop.displayName}</option>
                              })
                          }
                          </select>
                         </div>
                         <div className={styles.rowGroup}>
                         {
                            hiddenDesktops.length > 0 && hiddenDesktops.map(desktop => {
                              return <button onClick={handleRestoreDesktop} key={desktop} className={styles.hiddenDesktops}>{desktop}</button>
                            })
                          }
                         </div>
                      </div>
                  </form>
                  <h3>Cambiar Fondo</h3>
                  <div className={styles.selectBackground}>
                      {
                        miniatures
                          ? miniatures.map(img => {
                            return <img key={img.nombre} src={img.url} alt={img.nombre} onClick={handleChangeBackgroundImage}/>
                          })
                          : <div>Cargando ...</div>
                      }
                      <div className={styles.removeBackground} onClick={handleChangeBackgroundImage}></div>
                  </div>
                  <h3>Cambiar Color del Panel</h3>
                  <div className={styles.selectInfoColor}>
                      {
                        sideInfoStyles && sideInfoStyles.map(style => {
                          return <div key={style} className="infoColors" onClick={handleChangePanelStyles} id={style} style={{ background: constants.SIDE_INFO_STYLES[style].background }}></div>
                        })
                      }
                  </div>
                  <h3>Cambiar Color de Acento</h3>
                  <div className={styles.selectAccentColor}>
                      {
                        accentColors && accentColors.map(color => {
                          return <div key={color} className="accentColors" onClick={handleChangeAccentColor} id={color} style={{ backgroundColor: constants.ACCENT_COLORS[color].color }}></div>
                        })
                      }
                  </div>
                </div>
            </div>
   </>
  )
}
