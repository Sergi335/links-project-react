// import { Link } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { CloseMenuIcon, MenuIcon } from '../Icons/icons'
import styles from './Header.module.css'
// import LogOut from './LogOut'
import { useState } from 'react'
import SearchButton from './SearchButton'
import ThemeSwitcher from './ThemeSwitcher'
import UserInfo from './UserInfo'

export default function HeaderInfo () {
  const [open, setOpen] = useState(false)
  const toggleMobileMenu = () => {
    setOpen(!open)
    const panel = document.getElementsByClassName('resize-drag')
    panel[0]?.classList.toggle('pinned')
  }
  return (
    <section className={styles.header_info}>
      <Link className={styles.logo} to={'/'}>
        {/* <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 19V5m6 14V5M6 19V5"/></svg> */}
        <div className={styles.logo_text}>
          <span>ZenMarks</span>
        </div>
      </Link>
      <SearchButton />
      {/* <Link to={'/readinglist'} className={`${styles.header_info_link} ${styles.divider_right} ${styles.divider_left} ${styles.flex_center}`}>Lista de Lectura</Link> */}
      <ThemeSwitcher />
      <UserInfo />
      <button className={styles.mobile_menu_button} onClick={toggleMobileMenu}>
        {
          open ? <MenuIcon className={styles.mobile_menu_icon} /> : <CloseMenuIcon className={styles.mobile_close_menu_icon} />
        }
      </button>
      {/* <LogOut /> */}
    </section>
  )
}
