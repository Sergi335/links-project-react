import { Link } from 'react-router-dom'
import { MenuIcon } from '../Icons/icons'
import headstyles from '../ToolBar/Header.module.css'

export default function LogoDisplay () {
  const toggleMobileMenu = () => {
    const menu = document.getElementById('sidebar')
    menu.classList.toggle('pinned')
  }
  return (
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
  )
}
