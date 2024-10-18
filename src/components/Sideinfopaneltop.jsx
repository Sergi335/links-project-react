import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createColumn } from '../services/dbQueries'
import { saludo } from '../services/functions'
import { useDesktopsStore } from '../store/desktops'
import { useFormsStore } from '../store/forms'
import { useGlobalStore } from '../store/global'
import { usePreferencesStore } from '../store/preferences'
import { useSessionStore } from '../store/session'
import Clock from './Clock'
import columnStyles from './Column.module.css'
import { AddColumnIcon, EditDeskIcon, ExpandHeightIcon, HidePanels, ReadingListIcon } from './Icons/icons'
import styles from './SideInfo.module.css'

export default function Sideinfopaneltop () {
  const navigate = useNavigate()
  const { desktopName } = useParams()
  const [salut, setSalut] = useState('')
  const user = useSessionStore(state => state.user)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const desktopColumns = globalColumns.filter(column => column.escritorio.toLowerCase() === desktopName).toSorted((a, b) => a.orden - b.orden) // memo
  const desktopColumnsIds = desktopColumns.map(col => col._id)
  const customizePanelVisible = useFormsStore(state => state.customizePanelVisible)
  const setCustomizePanelVisible = useFormsStore(state => state.setCustomizePanelVisible)
  const setOpenedColumns = usePreferencesStore(state => state.setOpenedColumns)
  const openFlag = useRef(false)
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const desktop = desktopsStore.find(desk => desk.name === desktopName) // memo
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)

  // TODO: No se actualiza con el cambio de hora, puede ser de noche y decirte buenos días
  useEffect(() => {
    setSalut(saludo(''))
  }, [])

  const handleAddColumn = async () => {
    if (desktop === undefined) {
      toast.error('Debes crear un escritorio primero')
      return
    }
    const response = await createColumn({ name: 'New Column', escritorio: desktop.name, order: desktopColumns.length })
    const { column } = response
    setGlobalColumns((() => { return [...globalColumns, ...column] })())
  }
  const handleNavigate = () => {
    navigate('/readinglist')
  }
  const handleHideColumns = () => {
    const container = document.getElementById('maincontent')
    container.style.display === 'none' ? container.style.display = 'grid' : container.style.display = 'none'
  }
  const handleExpandAllColumns = () => {
    const columns = document.querySelectorAll(`.${columnStyles.columnWrapper}`)
    const newState = [...desktopColumnsIds]
    // Si el flag está en false significa que está en 'off' o cerrado y hay que abrir todas
    if (!openFlag.current) {
      columns.forEach((column) => {
        if (!column.classList.contains(columnStyles.colOpen)) {
          column.classList.add(columnStyles.colOpen)
        }
      })
      openFlag.current = true
      setOpenedColumns(newState)
      return
    }
    // Si está en true están abiertas y hay que cerrarlas todas
    if (openFlag.current) {
      columns.forEach((column, index) => {
        if (column.classList.contains(columnStyles.colOpen)) {
          column.classList.remove(columnStyles.colOpen)
        }
        setTimeout(() => { // --> Está esperando a la animación para poder ocultar los links
          openFlag.current = false
          setOpenedColumns([])
        }, 300)
      })
    }
  }
  return (
        <section className={styles.deskInfos}>
            <div className={styles.deskInfos_info}>
                <p className={styles.saludo}>{salut}</p>
                <Clock />
            </div>
            <p className={styles.deskInfos_user}>{user.realName}</p>
            {/* {
                environment === 'listoflinks'
                ? desktopDisplayName
                    ? <p className={styles.deskTitle} id="deskTitle" style={{ color: 'var(--firstTextColor)' }}>{desktopDisplayName}</p>
                    : <NameLoader className={styles.deskTitle}/>
                : null

            } */}
            {
              <div className={styles.deskInfos_controls}>
                <button className={styles.sideButtons} onClick={handleHideColumns}>
                  <HidePanels className={styles.uiIcon} id={'hidePanels'} />
                </button>
                <button className={styles.sideButtons} onClick={handleNavigate}>
                  <ReadingListIcon className={styles.uiIcon} id={'readingList'} />
                </button>
                <button className={styles.sideButtons} onClick={() => { setCustomizePanelVisible(!customizePanelVisible) }}>
                  <EditDeskIcon className={styles.uiIcon} id={'editDesk'} />
                </button>
                <button className={styles.sideButtons} onClick={handleAddColumn}>
                  <AddColumnIcon className={styles.uiIcon} id={'addCol'} />
                </button>
                <button className={styles.sideButtons} onClick={handleExpandAllColumns}>
                  <ExpandHeightIcon className={styles.uiIcon} />
                </button>
              </div>
            }
        </section>
  )
}
