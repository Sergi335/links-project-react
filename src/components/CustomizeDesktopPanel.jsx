import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useHideForms from '../hooks/useHideForms'
import { constants } from '../services/constants'
import { changeBackgroundImage, getBackgroundMiniatures, updateCategory } from '../services/dbQueries'
import { handleResponseErrors } from '../services/functions'
import { useFormsStore } from '../store/forms'
import { useGlobalStore } from '../store/global'
import { usePreferencesStore } from '../store/preferences'
import { useTopLevelCategoriesStore } from '../store/useTopLevelCategoriesStore'
import styles from './CustomizeDesktopPanel.module.css'

export default function CustomizeDesktopPanel ({ customizePanelVisible }) {
  const [miniatures, setMiniatures] = useState()
  const [desktop, setDesktop] = useState([])
  const [desktopNameInput, setDesktopNameInput] = useState(desktop[0]?.name || '')
  const navigate = useNavigate()
  const inputRef = useRef()
  const formRef = useRef()
  const { desktopName } = useParams()
  const topLevelCategoriesStore = useTopLevelCategoriesStore(state => state.topLevelCategoriesStore)
  const setTopLevelCategoriesStore = useTopLevelCategoriesStore(state => state.setTopLevelCategoriesStore)
  const setStyleOfColumns = usePreferencesStore(state => state.setStyleOfColumns)
  const setNumberOfColumns = usePreferencesStore(state => state.setNumberOfColumns)
  const numberOfColumns = usePreferencesStore(state => state.numberOfColumns)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const setGlobalLoading = useGlobalStore(state => state.setGlobalLoading)
  // const globalLoading = useGlobalStore(state => state.globalLoading)
  // const desktop = topLevelCategoriesStore?.filter(desk => desk.slug === desktopName) || 'null'
  console.log('🚀 ~ CustomizeDesktopPanel ~ desktop:', desktop)
  const accentColors = Object.keys(constants.ACCENT_COLORS)
  // const sideInfoStyles = Object.keys(constants.SIDE_INFO_STYLES)
  const themeVariants = Object.keys(constants.THEME_VARIANTS)
  const visibleClassName = customizePanelVisible ? styles.slideIn : ''
  const setCustomizePanelVisible = useFormsStore(state => state.setCustomizePanelVisible)
  useHideForms({ form: formRef.current, setFormVisible: setCustomizePanelVisible })

  // Debería estar montado y ocultarlo y mostrarlo mediante clases css
  const handleSubmit = async (event) => {
    event.preventDefault()
    setGlobalLoading(true)
    const newName = inputRef.current.value.trim()

    if (!newName || newName === desktop[0]?.name) {
      return
    }

    const previousState = [...globalColumns]
    const previousTopLevelState = [...topLevelCategoriesStore]

    // Crear estado actualizado localmente
    const currentUpdatedState = [...globalColumns]
    const updatedCategoryIndex = currentUpdatedState.findIndex(category => category.slug === desktopName)

    if (updatedCategoryIndex === -1) {
      toast('Error: Desktop no encontrado')
      return
    }

    const categoryToUpdate = currentUpdatedState[updatedCategoryIndex]
    const categoryToUpdateId = categoryToUpdate._id

    // Primera actualización local
    currentUpdatedState[updatedCategoryIndex] = { ...categoryToUpdate, name: newName }

    try {
      const items = [{ id: categoryToUpdateId, name: newName }]
      const response = await updateCategory({ items })
      const { hasError: hasError1, message: message1 } = handleResponseErrors(response)

      if (hasError1) {
        toast(message1)
        return
      }

      const { updatedData } = response

      // Actualizar en el state el slug de la categoría que hemos editado
      currentUpdatedState[updatedCategoryIndex] = { ...currentUpdatedState[updatedCategoryIndex], slug: updatedData[0].slug }

      // Actualizar topLevelCategoriesStore
      const updatedTopLevel = currentUpdatedState.filter(cat => cat.level === 0)
      setTopLevelCategoriesStore(updatedTopLevel)
      setGlobalColumns(currentUpdatedState)

      // Preparar items para la segunda actualización
      const restOfItems = []
      // Trabajar con currentUpdatedState en lugar de globalColumns
      currentUpdatedState.forEach(column => {
        if (column.parentSlug === desktopName) {
          column.parentSlug = updatedData[0].slug
          restOfItems.push({ id: column._id, parentSlug: updatedData[0].slug })
        }
      })

      if (restOfItems.length > 0) {
        const response2 = await updateCategory({ items: restOfItems })
        const { hasError: hasError2, message: message2 } = handleResponseErrors(response2)

        if (hasError2) {
          toast(message2)
          setGlobalColumns(previousState)
          setTopLevelCategoriesStore(previousTopLevelState)
          return
        }

        // Meter el globalloading

        // Actualizar con los cambios finales usando currentUpdatedState
        setGlobalColumns([...currentUpdatedState])
      }

      navigate(`/app/${updatedData[0].slug}`)
      toast('Desktop actualizado correctamente')
      setGlobalLoading(false)
    } catch (error) {
      console.error('Error en handleSubmit:', error)
      toast('Error al actualizar el desktop')
      setGlobalColumns(previousState)
      setTopLevelCategoriesStore(previousTopLevelState)
      setGlobalLoading(false)
    }
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
    // Hacer con css, agregar atributo y seleccionar el resto?, claro que hay que quitar el atributo al resto
    miniatures.childNodes.forEach(miniature => {
      if (miniature !== event.target) {
        miniature.classList.remove(`${styles.optionSelected}`)
      }
    })
    const response = await changeBackgroundImage(event)
    console.log(response)
    // console.log('🚀 ~ handleChangeBackgroundImage ~ response:', response)
    // Error de red
    // Esto se repite mucho, hacer una funcion para esto
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
    const element = document.querySelector('#root')
    element.setAttribute('data-background', 'color')
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
  //   const panel = document.getElementById('sidebar')
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
    const select = event.target
    const selectedOption = select.options[select.selectedIndex]
    const id = selectedOption.dataset.id
    console.log(id)
    const items = [{ id, hidden: true }]
    const response = await updateCategory({ items })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
      return
    }
    const deskIndex = topLevelCategoriesStore.findIndex(desktop => desktop._id === id)
    const globalDeskIndex = globalColumns.findIndex(col => col._id === id)
    const newTopLevelState = [...topLevelCategoriesStore]
    const newGlobalState = [...globalColumns]
    newTopLevelState[deskIndex].hidden = true
    newGlobalState[globalDeskIndex].hidden = true
    setTopLevelCategoriesStore(newTopLevelState)
    setGlobalColumns(newGlobalState)
  }
  const handleRestoreDesktop = async (event) => {
    event.preventDefault()
    const id = event.target.dataset.id
    console.log('🚀 ~ handleRestoreDesktop ~ id:', id)
    const items = [{ id, hidden: false }]
    const response = await updateCategory({ items })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
      return
    }
    const newTopLevelState = [...topLevelCategoriesStore]
    const newGlobalState = [...globalColumns]
    const globalDeskIndex = newGlobalState.findIndex(col => col._id === id)
    const deskIndex = newTopLevelState.findIndex(desktop => desktop._id === id)
    newTopLevelState[deskIndex].hidden = false
    newGlobalState[globalDeskIndex].hidden = false
    setTopLevelCategoriesStore(newTopLevelState)
    setGlobalColumns(newGlobalState)
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
        const { hasError, message } = handleResponseErrors(response)
        if (hasError) {
          toast(message)
          return
        }
        setMiniatures(response.data)
      })
      .catch(error => {
        toast({ error })
      })
  }, [])
  useEffect(() => {
    setDesktop(topLevelCategoriesStore?.filter(desk => desk.slug === desktopName) || [])
  }, [desktopName, topLevelCategoriesStore])
  // Añadir effect para detectar cambio de desktop al navegar

  useEffect(() => {
    setDesktopNameInput(desktop[0]?.name || '')
  }, [desktop[0]?.name])

  return (
    <>
             <div ref={formRef} className={`${styles.customizePanel} ${visibleClassName}`}>
                <div className={styles.wrapper}>
                  <h3>Personalizar Escritorio</h3>
                  <form onSubmit={handleSubmit}>
                    <div className={`${styles.formControl} ${styles.hasRowGroup}`}>
                      <div className={styles.rowGroup} style={{ position: 'relative' }}>
                          <label htmlFor="changeDesktopName" style={{ marginBottom: '6px', textAlign: 'left', width: '100%' }}>Nombre:</label>
                          <input
                            ref={inputRef}
                            type="text"
                            name="changeDesktopName"
                            id="changeDesktopName"
                            value={desktopNameInput}
                            onChange={e => setDesktopNameInput(e.target.value)}
                          />
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
                              topLevelCategoriesStore?.map(desktop => {
                                if (!desktop.hidden) {
                                  return <option key={desktop._id} data-id={desktop._id} value={desktop.name}>{desktop.name}</option>
                                }
                                return null // Add this line to return null if the condition is not met
                              })
                          }
                          </select>
                         </div>
                        <div className={styles.rowGroup}>
                        {
                          topLevelCategoriesStore?.map(desktop => {
                            if (desktop.hidden) {
                              return <button onClick={handleRestoreDesktop} data-id={desktop._id} key={desktop._id} className={styles.hiddenDesktops}>{desktop.name}</button>
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
