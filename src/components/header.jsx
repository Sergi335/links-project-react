import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Bookmarks from './Bookmarks'
import DesktopNameDisplay from './DesktopNameDisplay'
import styles from './Header.module.css'
import { MenuIcon } from './Icons/icons'

export default function Header () {
  useEffect(() => {
    const setTheme = (e) => {
      console.log('cambio de tema detectado')
      const root = document.documentElement
      if (e.matches) {
        root.classList.add('dark')
        root.classList.remove('light')
        window.localStorage.setItem('theme', JSON.stringify('dark'))
        console.log('dark mode desde el header')
      } else {
        root.classList.add('light')
        root.classList.remove('dark')
        window.localStorage.setItem('theme', JSON.stringify('light'))
        console.log('light mode desde el header')
      }
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme)

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', setTheme)
    }
  }, [])

  const toggleMobileMenu = () => {
    const menu = document.getElementById('mobileMenu')
    menu.classList.toggle(styles.show)
  }

  return (

        <header className={styles.header}>
          <div className={styles.headLeft}>
            <div className={styles.logoContainer}>
              <Link className={styles.logo} to={'/'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 19V5m6 14V5M6 19V5"/></svg>
                <div className={styles.logoText}>
                  <span>ZenMarks</span>
                </div>
              </Link>
              <button className={styles.mobile_menu_button} onClick={toggleMobileMenu}>
                <MenuIcon className={styles.mobile_menu} />
              </button>
            </div>
            <DesktopNameDisplay />
          </div>
          <div className={styles.headCenter} id='mobileMenu'>
            <Bookmarks />
          </div>
          <div className={styles.headRight}>
          </div>
        </header>

  )
}
