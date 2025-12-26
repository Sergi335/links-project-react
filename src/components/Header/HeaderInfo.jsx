import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import LogOut from './LogOut'
import SearchButton from './SearchButton'
import ThemeSwitcher from './ThemeSwitcher'
import UserInfo from './UserInfo'
// import WeatherComponent from './WeatherComponent'
import { useSessionStore } from '../../store/session'
export default function HeaderInfo () {
  const csrfToken = useSessionStore(state => state.csfrtoken)
  return (
    <section className={styles.header_info}>
      <SearchButton />
      <Link to={'/readinglist'} className={`${styles.header_info_link} ${styles.divider_right} ${styles.divider_left} ${styles.flex_center}`}>Lista de Lectura</Link>
      {
        csrfToken
      }
      <ThemeSwitcher />
      <UserInfo />
      <LogOut />
    </section>
  )
}
