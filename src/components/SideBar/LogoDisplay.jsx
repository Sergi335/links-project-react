import { Link } from 'react-router-dom'
import { useFormsStore } from '../../store/forms'
import { useGlobalStore } from '../../store/global'
import { AddDesktopIcon, ExpandHeightIcon, SettingsWheelIcon, TrashIcon } from '../Icons/icons'
import styles from './SideBar.module.css'

export default function LogoDisplay ({ customStyle }) {
  const setAddDeskFormVisible = useFormsStore(state => state.setAddDeskFormVisible)
  const addDeskFormVisible = useFormsStore(state => state.addDeskFormVisible)
  const setDeleteConfFormVisible = useFormsStore(state => state.setDeleteConfFormVisible)
  const deleteConfFormVisible = useFormsStore(state => state.deleteConfFormVisible)
  const customizePanelVisible = useFormsStore(state => state.customizePanelVisible)
  const setCustomizePanelVisible = useFormsStore(state => state.setCustomizePanelVisible)
  const triggerSidebarCollapse = useGlobalStore(state => state.triggerSidebarCollapse)
  const handleShowAddDesktop = (e) => {
    // e.preventDefault()
    e.stopPropagation() // 1. Evita que el click se propague a hooks de cierre u otros listeners
    setAddDeskFormVisible(!addDeskFormVisible)
  }
  const handleShowDeleteDesktop = (e) => {
    e.stopPropagation()
    setDeleteConfFormVisible(!deleteConfFormVisible)
  }
  return (
    <div className={styles.logo_container} style={customStyle}>
      <Link className={styles.logo} to={'/'}>
        <div className={styles.logo_text}>
          <span>ZenMarks</span>
        </div>
      </Link>
          <button
            // eslint-disable-next-line react/no-unknown-property
             popovertarget='add-desktop-form'
             className={styles.collapse_btn}
             onClick={handleShowAddDesktop}
             title="Añadir escritorio"
          ><AddDesktopIcon className={styles.collapse_icon} />
          </button>
          <button
            // eslint-disable-next-line react/no-unknown-property
            popovertarget='delete-desktop-confirm-form'
            className={styles.collapse_btn}
            onClick={handleShowDeleteDesktop}
            title="Eliminar escritorio"
           >
            <TrashIcon className={styles.collapse_icon} />
          </button>
          <button className={styles.collapse_btn}
            onClick={() => { setCustomizePanelVisible(!customizePanelVisible) }}
            title="Personalizar panel"
          >
            <SettingsWheelIcon className={styles.collapse_icon} id={'editDesk'} />
          </button>
          <button className={styles.collapse_btn} onClick={triggerSidebarCollapse} title="Colapsar categorías">
            <ExpandHeightIcon className={`${styles.collapse_icon} rotate180`} />
          </button>
    </div>
  )
}
