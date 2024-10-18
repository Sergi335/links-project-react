import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useHideForms from '../hooks/useHideForms'
import { constants } from '../services/constants'
import { changeBackgroundImage, editDesktop, getBackgroundMiniatures } from '../services/dbQueries'
import { formatPath, handleResponseErrors } from '../services/functions'
import { useDesktopsStore } from '../store/desktops'
import { useFormsStore } from '../store/forms'
import { useGlobalStore } from '../store/global'
import { usePreferencesStore } from '../store/preferences'
import styles from './CustomizeDesktopPanel.module.css'

export default function CustomizeDesktopPanel ({ customizePanelVisible }) {
  const [miniatures, setMiniatures] = useState()
  const navigate = useNavigate()
  const inputRef = useRef()
  const formRef = useRef()
  const { desktopName } = useParams()
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)
  const setStyleOfColumns = usePreferencesStore(state => state.setStyleOfColumns)
  const setNumberOfColumns = usePreferencesStore(state => state.setNumberOfColumns)
  const numberOfColumns = usePreferencesStore(state => state.numberOfColumns)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const desktop = desktopsStore?.filter(desk => desk.name === desktopName) || 'null'
  const accentColors = Object.keys(constants.ACCENT_COLORS)
  // const sideInfoStyles = Object.keys(constants.SIDE_INFO_STYLES)
  const themeVariants = Object.keys(constants.THEME_VARIANTS)
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
    setDesktopsStore(data)
    const newColsState = globalColumns.map(column => {
      if (column.escritorio === desktopName) {
        column.escritorio = name
      }
      return column
    })
    setGlobalColumns(newColsState)
    const newLinksState = globalLinks.map(link => {
      if (link.escritorio === desktopName) {
        link.escritorio = name
      }
      return link
    })
    setGlobalLinks(newLinksState)
    // const changeUrlEvent = new Event('changeurl')
    // window.dispatchEvent(changeUrlEvent)
    // const url = new URL(window.location.href)
    // url.pathname = `desktop/${name}`
    // window.history.pushState(null, null, url)
    navigate(`/desktop/${name}`)
  }
  const handleNumberColumnsChange = (event) => {
    setNumberOfColumns(event.target.value)
    setStyleOfColumns(constants.COLUMNS_COUNT[event.target.value])
    localStorage.setItem('styleOfColumns', JSON.stringify(constants.COLUMNS_COUNT[event.target.value]))
    localStorage.setItem('numberOfColumns', JSON.stringify(event.target.value))
  }
  const handleChangeBackgroundImage = async (event) => {
    event.target.classList.add(`${styles.optionSelected}`)
    const miniatures = document.getElementById('bgMiniatures')
    miniatures.childNodes.forEach(miniature => {
      if (miniature !== event.target) {
        miniature.classList.remove(`${styles.optionSelected}`)
      }
    })
    const response = await changeBackgroundImage(event)
    console.log(response)
    // console.log('🚀 ~ handleChangeBackgroundImage ~ response:', response)
    // Error de red
    if (!response?.startsWith('http') && !response?.ok && response?.error === undefined) {
      toast('Error de red')
      return
    }
    // Error http
    if (!response?.startsWith('http') && !response?.ok && response?.status !== undefined) {
      toast(`${response.status}: ${response.statusText}`)
      return
    }
    // Error personalizado
    if (!response?.startsWith('http') && response.error) {
      toast(`Error: ${response.error}`)
    }
    console.log(event.target.src ?? event.target.id)
    window.localStorage.setItem('backgroundMiniature', JSON.stringify(event.target.src))
  }
  const handleRemoveBackgroundImage = (event) => {
    event.target.classList.add(`${styles.optionSelected}`)
    const miniatures = document.getElementById('bgMiniatures')
    miniatures.childNodes.forEach(miniature => {
      if (miniature !== event.target) {
        miniature.classList.remove(`${styles.optionSelected}`)
      }
    })
    const element = document.querySelector('.root')
    element.style.background = ''
    // element.style.backgroundSize = 'initial'
    window.localStorage.setItem('bodyBackground', null)
    window.localStorage.setItem('backgroundMiniature', JSON.stringify(event.target.id))
  }
  // const handleChangePanelStyles = (event) => {
  //   event.target.classList.add(`${styles.optionSelected}`)
  //   const options = document.getElementById('infoColor')
  //   options.childNodes.forEach(option => {
  //     if (option !== event.target) {
  //       option.classList.remove(`${styles.optionSelected}`)
  //     }
  //   })
  //   const currentStyle = event?.target.id
  //   const panel = document.getElementById('sideinfo')
  //   constants.SIDE_INFO_STYLES[currentStyle].applyStyles(panel)
  //   window.localStorage.setItem('sideInfoStyles', JSON.stringify(currentStyle))
  // }
  const handleChangeAccentColor = (event) => {
    event.target.classList.add(`${styles.optionSelected}`)
    const options = document.getElementById('accentColor')
    options.childNodes.forEach(option => {
      if (option !== event.target) {
        option.classList.remove(`${styles.optionSelected}`)
      }
    })
    const color = event.target.id
    constants.ACCENT_COLORS[color].applyStyles()
  }
  const handleChangeThemeVariant = (event) => {
    event.target.classList.add(`${styles.optionSelected}`)
    const style = event.target.id
    const element = document.documentElement
    const options = document.getElementById('themeVariant')
    options.childNodes.forEach(option => {
      if (option !== event.target) {
        option.classList.remove(`${styles.optionSelected}`)
      }
    })
    // element.classList.add('transparent')
    constants.THEME_VARIANTS[style].applyStyles(element)
    const currentStyle = event?.target.id
    constants.THEME_VARIANTS[currentStyle].applyStyles(element)
    window.localStorage.setItem('themeVariant', JSON.stringify(currentStyle))
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
    const deskIndex = desktopsStore.findIndex(desktop => desktop.name === name)
    const newState = [...desktopsStore]
    newState[deskIndex].hidden = true
    setDesktopsStore(newState)
  }
  const handleRestoreDesktop = async (event) => {
    event.preventDefault()
    const name = formatPath(event.target.textContent)
    const body = { name, hidden: false }
    const response = await editDesktop(body)
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
      return
    }
    const newState = [...desktopsStore]
    const deskIndex = newState.findIndex(desktop => desktop.name === name)
    newState[deskIndex].hidden = false
    setDesktopsStore(newState)
    // const newHiddenState = hiddenDesktops.filter(desktop => desktop !== event.target.innerText)
    // setHiddenDesktops(newHiddenState)
  }
  // Useeffect para aplicar las opciones marcadas en el panel de personalización
  useEffect(() => {
    const themeVariant = JSON.parse(window.localStorage.getItem('themeVariant')) ?? themeVariants[0]
    const optionsContainer = document.getElementById('themeVariant')
    optionsContainer.querySelector(`#${themeVariant}`).classList.add(`${styles.optionSelected}`)

    const accentColor = JSON.parse(window.localStorage.getItem('accentColorName')) ?? accentColors[0]
    const colorOptions = document.getElementById('accentColor')
    colorOptions.querySelector(`#${accentColor}`).classList.add(`${styles.optionSelected}`)

    const background = JSON.parse(window.localStorage.getItem('backgroundMiniature')) ?? 'color'
    // console.log('🚀 ~ useEffect ~ background:', background)
    const backgroundOptions = Array.from(document.getElementById('bgMiniatures').childNodes)
    // console.log('🚀 ~ useEffect ~ backgroundOptions:', backgroundOptions)
    backgroundOptions.forEach(option => {
      // console.log(option.src)
      if (option.src && option.src === background) {
        option.classList.add(`${styles.optionSelected}`)
      } else if (option.id && option.id === background) {
        option.classList.add(`${styles.optionSelected}`)
      }
    })
  }, [miniatures])
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

  return (
    <>
             <div ref={formRef} className={`${styles.customizePanel} ${visibleClassName}`}>
                <div className={styles.wrapper}>
                  <h3>Personalizar Escritorio</h3>
                  <form onSubmit={handleSubmit}>
                    <div className={`${styles.formControl} ${styles.hasRowGroup}`}>
                      <div className={styles.rowGroup} style={{ position: 'relative' }}>
                          <label htmlFor="changeDesktopName" style={{ marginBottom: '6px', textAlign: 'left', width: '100%' }}>Nombre:</label>
                          <input ref={inputRef} type="text" name="changeDesktopName" id="changeDesktopName" defaultValue={desktop[0]?.displayName}/>
                          <button className={styles.inputButton} type='submit'>Modificar</button>
                      </div>
                      <div className={styles.rowGroup}>
                          <label htmlFor="" style={{ marginBottom: '6px', width: '100%' }}>Número de columnas:&nbsp;<strong>{numberOfColumns}</strong></label>
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
                              desktopsStore?.map(desktop => {
                                if (!desktop.hidden) {
                                  return <option key={desktop._id} value={desktop.displayName}>{desktop.displayName}</option>
                                }
                                return null // Add this line to return null if the condition is not met
                              })
                          }
                          </select>
                         </div>
                        <div className={styles.rowGroup}>
                        {
                          desktopsStore?.map(desktop => {
                            if (desktop.hidden) {
                              return <button onClick={handleRestoreDesktop} key={desktop._id} className={styles.hiddenDesktops}>{desktop.displayName}</button>
                            }
                            return null // Add this line to return null if the condition is not met
                          })
                        }
                        </div>
                      </div>
                  </form>
                  <h3>Fondos</h3>
                  <div id='bgMiniatures' className={styles.selectBackground}>
                      {
                        miniatures
                          ? miniatures.map(img => {
                            return <img key={img.nombre} src={img.url} alt={img.nombre} onClick={handleChangeBackgroundImage}/>
                          })
                          : <div>Cargando ...</div>
                      }
                      <div id='color' className={styles.removeBackground} onClick={handleRemoveBackgroundImage}></div>
                  </div>
                  <h3>Estilo del tema</h3>
                  <div id='themeVariant' className={styles.selectThemeVariant}>
                      {
                        themeVariants && themeVariants.map(style => {
                          return <div key={style} className="themeVariants" onClick={handleChangeThemeVariant} id={style} style={{ background: constants.THEME_VARIANTS[style].background }}></div>
                        })
                      }
                  </div>
                  {/* <h3>Estilo del Panel</h3>
                  <div id='infoColor' className={styles.selectInfoColor}>
                      {
                        sideInfoStyles && sideInfoStyles.map(style => {
                          return <div key={style} className="infoColors" onClick={handleChangePanelStyles} id={style} style={{ background: constants.SIDE_INFO_STYLES[style].background }}></div>
                        })
                      }
                  </div> */}
                  <h3>Color de Acento</h3>
                  <div id='accentColor' className={styles.selectAccentColor}>
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
