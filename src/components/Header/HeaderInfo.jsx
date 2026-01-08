// import { Link } from 'react-router-dom'
import { MenuIcon } from '../Icons/icons'
import styles from './Header.module.css'
// import LogOut from './LogOut'
import SearchButton from './SearchButton'
import ThemeSwitcher from './ThemeSwitcher'
import UserInfo from './UserInfo'

export default function HeaderInfo () {
  const toggleMobileMenu = () => {
    const panel = document.getElementsByClassName('resize-drag')
    panel[0]?.classList.toggle('pinned')
  }
  return (
    <section className={styles.header_info}>
      <SearchButton />
      {/* <Link to={'/readinglist'} className={`${styles.header_info_link} ${styles.divider_right} ${styles.divider_left} ${styles.flex_center}`}>Lista de Lectura</Link> */}
      <ThemeSwitcher />
      <UserInfo />
      <button className={styles.mobile_menu_button} onClick={toggleMobileMenu}>
        <MenuIcon className={styles.mobile_menu_icon} />
          Escritorios
      </button>
      {/* <LogOut /> */}
    </section>
  )
}
