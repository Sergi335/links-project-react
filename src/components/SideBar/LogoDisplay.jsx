import { Link } from 'react-router-dom'
import { useGlobalStore } from '../../store/global'
import { ExpandHeightIcon } from '../Icons/icons'
import styles from './SideBar.module.css'

export default function LogoDisplay () {
  const triggerSidebarCollapse = useGlobalStore(state => state.triggerSidebarCollapse)

  return (
    <div className={styles.logo_container}>
      <Link className={styles.logo} to={'/'}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 19V5m6 14V5M6 19V5"/></svg>
        <div className={styles.logo_text}>
          <span>ZenMarks</span>
        </div>
      </Link>
      <button
        className={styles.collapse_btn}
        onClick={triggerSidebarCollapse}
        title="Colapsar categorías"
      >
        <ExpandHeightIcon className={styles.collapse_icon} />
      </button>
    </div>
  )
}
