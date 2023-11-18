import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useDesktopsStore } from '../store/desktops'
import { constants } from '../services/constants'
import { formatPath } from '../services/functions'
import { usePreferencesStore } from '../store/preferences'
import { editDesktopName, changeBackgroundImage, getBackgroundMiniatures } from '../services/dbQueries'
import { toast } from 'react-toastify'
import styles from './CustomizeDesktopPanel.module.css'

export default function CustomizeDesktopPanel ({ customizePanelVisible }) {
  const [columnCount, setColumnCount] = useState(4)
  const [miniatures, setMiniatures] = useState()
  const inputRef = useRef()
  const { desktopName } = useParams()
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)
  const setNumberOfColumns = usePreferencesStore(state => state.setNumberOfColumns)
  const desktop = desktopsStore.filter(desk => desk.name === desktopName)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const newName = inputRef.current.value.trim()
    const newNameFormat = formatPath(newName)
    const body = { newName, oldName: desktopName, newNameFormat }

    const response = await editDesktopName(body)
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
      return
    }
    const url = new URL(window.location.href)
    url.pathname = `desktop/${newNameFormat}`
    window.history.pushState(null, null, url)
    const changeUrlEvent = new Event('changeurl')
    window.dispatchEvent(changeUrlEvent)
    setDesktopsStore(response)
  }
  const handleNumberColumnsChange = (event) => {
    setColumnCount(event.target.value)
    setNumberOfColumns(constants.COLUMNS_COUNT[event.target.value])
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
  const handleChangePanelColor = (event) => {
    const currentStyle = event?.target.id
    const panel = document.getElementById('sideinfo')
    switch (currentStyle) {
      case 'theme':
        panel.style.background = 'var(--bgGradient)'
        panel.style.backdropFilter = 'none'
        panel.style.borderRadius = '5px'
        window.localStorage.setItem('infoColor', JSON.stringify('theme'))
        break
      case 'transparent':
        panel.style.background = 'transparent'
        panel.style.backdropFilter = 'none'
        panel.style.borderRadius = '0'
        window.localStorage.setItem('infoColor', JSON.stringify('transparent'))
        break
      case 'blur':
        panel.style.background = 'transparent'
        panel.style.backdropFilter = 'blur(15px)'
        panel.style.borderRadius = '5px'
        window.localStorage.setItem('infoColor', JSON.stringify('blur'))
        break
    }
  }
  const handleChangeAccentColor = (event) => {
    const color = event.target.id
    switch (color) {
      case 'yellow':
        document.documentElement.style.setProperty('--accentColor', constants.ACCENT_COLORS.yellow)
        document.documentElement.style.setProperty('--buttonTextColor', '#4e4e4e')
        window.localStorage.setItem('accentColor', JSON.stringify('#ffff00'))
        window.localStorage.setItem('buttonTextColor', JSON.stringify('#4e4e4e'))
        break
      case 'blue':
        document.documentElement.style.setProperty('--accentColor', constants.ACCENT_COLORS.blue)
        document.documentElement.style.setProperty('--buttonTextColor', '#ffffff')
        window.localStorage.setItem('accentColor', JSON.stringify('cornflowerblue'))
        window.localStorage.setItem('buttonTextColor', JSON.stringify('#ffffff'))
        break
      case 'green':
        document.documentElement.style.setProperty('--accentColor', constants.ACCENT_COLORS.green)
        document.documentElement.style.setProperty('--buttonTextColor', '#1a1a1a')
        window.localStorage.setItem('accentColor', JSON.stringify('#00cc66'))
        window.localStorage.setItem('buttonTextColor', JSON.stringify('#1a1a1a'))
        break
      case 'defaultLight':
        document.documentElement.style.setProperty('--accentColor', constants.ACCENT_COLORS.defaultLight)
        document.documentElement.style.setProperty('--buttonTextColor', '#1a1a1a')
        window.localStorage.setItem('accentColor', JSON.stringify('#bababa'))
        window.localStorage.setItem('buttonTextColor', JSON.stringify('#1a1a1a'))
        break
      case 'defaultDark':
        document.documentElement.style.setProperty('--accentColor', constants.ACCENT_COLORS.defaultDark)
        document.documentElement.style.setProperty('--buttonTextColor', '#ffffff')
        window.localStorage.setItem('accentColor', JSON.stringify('#bf7272'))
        window.localStorage.setItem('buttonTextColor', JSON.stringify('#ffffff'))
        break
    }
  }
  const handleHideDesktops = (event) => {
    console.log(event.target.value)
    const newState = [...desktopsStore].filter(desktop => desktop.displayName !== event.target.value)
    setDesktopsStore(newState)
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
  const visibleClass = customizePanelVisible ? styles.flex : styles.hidden
  return (
    <>
             <div className={visibleClass + ' ' + styles.customizePanel}>
                <h2>Personaliza Escritorio</h2>
                <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
                    <div className={styles.formControl}>
                        <input ref={inputRef} type="text" name="" id="" defaultValue={desktop[0]?.displayName}/>
                        <button>Modificar</button>
                    </div>
                    <div className={styles.formControl}>
                        <label htmlFor="">Número de columnas:</label>
                        <input type="range" name="" id="" min={1} max={5} value={columnCount} onChange={handleNumberColumnsChange} /> <strong>{columnCount}</strong>
                    </div>
                    <div className={styles.formControl}>
                        <label htmlFor="">Ocultar Escritorios:</label>
                        <select name="" id="" onChange={handleHideDesktops}>
                        {
                            desktopsStore.map(desktop => {
                              return <option key={desktop._id} value={desktop.displayName}>{desktop.displayName}</option>
                            })
                        }
                        </select>
                    </div>
                </form>
                <h2>Cambiar Fondo</h2>
                <div className={styles.selectBackground}>
                    {
                        miniatures
                          ? miniatures.map(img => {
                            return <img key={img.nombre} src={img.url} alt={img.nombre} onClick={handleChangeBackgroundImage}/>
                          })
                          : <div>Cargando ...</div>

                    }
                </div>
                <h2>Cambiar Color del Panel</h2>
                {/* foreach infocolor */}
                <div className={styles.selectInfoColor}>
                    <div className="infoColors" onClick={handleChangePanelColor} id="theme" style={{ background: 'var(--bgGradient)' }}> </div>
                    <div className="infoColors" onClick={handleChangePanelColor} id="transparent"> </div>
                    <div className="infoColors" onClick={handleChangePanelColor} id="blur"> </div>
                </div>
                <h2>Cambiar Color de Acento</h2>
                {/* foreach accentcolor */}
                <div className={styles.selectAccentColor}>
                    <div className="accentColors" onClick={handleChangeAccentColor} id="yellow" style={{ backgroundColor: constants.ACCENT_COLORS.yellow }}></div>
                    <div className="accentColors" onClick={handleChangeAccentColor} id="blue" style={{ backgroundColor: constants.ACCENT_COLORS.blue }}></div>
                    <div className="accentColors" onClick={handleChangeAccentColor} id="green" style={{ backgroundColor: constants.ACCENT_COLORS.green }}></div>
                    <div className="accentColors" onClick={handleChangeAccentColor} id="defaultLight" style={{ backgroundColor: constants.ACCENT_COLORS.defaultLight }}></div>
                    <div className="accentColors" onClick={handleChangeAccentColor} id="defaultDark" style={{ backgroundColor: constants.ACCENT_COLORS.defaultDark }}></div>
                </div>
            </div>
   </>
  )
}
