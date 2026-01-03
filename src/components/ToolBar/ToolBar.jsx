import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createColumn } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useFormsStore } from '../../store/forms'
import { useGlobalStore } from '../../store/global'
import { usePreferencesStore } from '../../store/preferences'
import { useTopLevelCategoriesStore } from '../../store/useTopLevelCategoriesStore'
import { AddColumnIcon, EditDeskIcon, ExpandHeightIcon, HidePanels, MenuIcon, PinPanelIcon } from '../Icons/icons'
import styles from './Toolbar.module.css'

export default function ToolBar () {
  const { desktopName } = useParams()
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const desktopColumns = globalColumns.filter(column => column.slug === desktopName).toSorted((a, b) => a.orden - b.orden)
  const customizePanelVisible = useFormsStore(state => state.customizePanelVisible)
  const setCustomizePanelVisible = useFormsStore(state => state.setCustomizePanelVisible)
  const globalOpenColumns = usePreferencesStore(state => state.globalOpenColumns)
  const setGlobalOpenColumns = usePreferencesStore(state => state.setGlobalOpenColumns)
  const topLevelCategoriesStore = useTopLevelCategoriesStore(state => state.topLevelCategoriesStore)
  const desktop = topLevelCategoriesStore.find(desk => desk.slug === desktopName)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const location = useLocation()
  const isDesktopLocation = location.pathname !== '/app/profile' && location.pathname !== '/app/readinglist'
  // const isColumnLocation = location.state
  // console.log('🚀 ~ ToolBar ~ isColumnLocation:', isColumnLocation)
  const [newColumnId, setNewColumnId] = useState(null)

  const handleAddColumn = async () => {
    if (desktop === undefined) {
      toast.error('Debes crear un escritorio primero')
      return
    }
    const response = await createColumn({ name: 'New Column', parentId: desktop._id, order: desktopColumns.length + 1, level: 1, parentSlug: desktop.slug })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast.error(message)
      return
    }
    const { data } = response
    setGlobalColumns((() => { return [...globalColumns, ...data] })())
    setNewColumnId(data[0]._id)
  }
  useEffect(() => {
    if (newColumnId) {
      const element = document.getElementById(newColumnId)
      if (element) {
        // scroll to bottom of the page
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        })
      }
      setNewColumnId(null)
    }
  }, [newColumnId])
  const handleHideColumns = (e) => {
    e.currentTarget.classList.toggle(styles.icon_clicked)
    const containerSp = document.getElementById('spMainContentWrapper')
    if (containerSp) {
      containerSp.style.display === 'none' ? containerSp.style.display = 'grid' : containerSp.style.display = 'none'
    }
    const container = document.getElementById('mainContentWrapper')
    if (container) {
      container.style.display === 'none' ? container.style.display = 'grid' : container.style.display = 'none'
    }
  }
  const handleExpandAllColumns = (e) => {
    e.currentTarget.classList.toggle(styles.icon_clicked)
    setGlobalOpenColumns(!globalOpenColumns)
  }
  // Al recargar la página se queda con el panel abierto
  const handlePinPanel = () => {
    const panel = document.getElementById('sidebar')
    const icon = document.getElementById('pin_icon')
    icon.classList.toggle(styles.icon_pinned)
    panel.classList.toggle('pinned')
  }
  const toggleMobileMenu = () => {
    const menu = document.getElementById('sidebar')
    menu.classList.toggle('pinned')
  }
  return (
    <aside className={`${styles.toolbar} toolbar`}>
    {

        <div className={styles.toolbar_controls}>
          {
            isDesktopLocation && (
              <>
                <button className={styles.sideButtons} onClick={handleHideColumns}>
                  <HidePanels className={styles.uiIcon} id={'hidePanels'} />
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
              </>
            )
          }
          <button className={styles.sideButtons} onClick={handlePinPanel}>
            <PinPanelIcon id={'pin_icon'} className={`uiIcon ${styles.icon_pinned}`} />
          </button>
        </div>

    }
    <button className={styles.mobile_menu_button} onClick={toggleMobileMenu}>
      <MenuIcon className={styles.mobile_menu_icon} />
        Escritorios
    </button>
  </aside>
  )
}
