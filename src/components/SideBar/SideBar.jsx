import styles from './SideBar.module.css'
import SideBarControls from './SideBarControls'
// import SideBarInfo from './SideBarInfo'
import { Link } from 'react-router-dom'
import { MenuIcon } from '../Icons/icons'
import headstyles from '../ToolBar/Header.module.css'
import SideBarNav from './SideBarNav'

export default function SideBar () {
  const toggleMobileMenu = () => {
    const menu = document.getElementById('sidebar')
    menu.classList.toggle('pinned')
  }
  return (
      <aside id='sidebar' className={`${styles.sidebar} pinned`}>
        <div className={`${styles.sidebar_wrapper} sidebar_wrapper_gc`}>
          {/* <SideBarInfo /> */}
          <div className={headstyles.logo_container}>
        <Link className={headstyles.logo} to={'/'}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 19V5m6 14V5M6 19V5"/></svg>
          <div className={headstyles.logoText}>
            <span>ZenMarks</span>
          </div>
        </Link>
        <button className={headstyles.mobile_menu_button} onClick={toggleMobileMenu}>
          <MenuIcon className={headstyles.mobile_menu} />
        </button>
      </div>
          <SideBarNav />
          <SideBarControls />
        </div>
      </aside>
  )
}
