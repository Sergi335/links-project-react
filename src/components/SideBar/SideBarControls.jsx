import { Link, useNavigate } from 'react-router-dom'
import useGoogleAuth from '../../hooks/useGoogleAuth'
import { useSessionStore } from '../../store/session'
import { PinPanelIcon, ReadingListIcon, SwitchOffIcon, ThemeChangeIcon } from '../Icons/icons'
import styles from './SideBar.module.css'

export default function SideBarControls () {
  const user = useSessionStore(state => state.user)
  const { handleGoogleLogOut } = useGoogleAuth()
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate('/readinglist')
  }

  const handlePinPanel = () => {
    const panel = document.getElementById('sidebar')
    const icon = document.getElementById('pin_icon')
    icon.classList.toggle(styles.icon_pinned)
    panel.classList.toggle('pinned')
  }
  const handleChangeTheme = () => {
    const root = document.documentElement
    // if (window.matchMedia('prefers-color-scheme: dark').matches) {
    //   document.root.classList.add('dark')
    // }
    if (root.classList.contains('dark')) {
      root.classList.remove('dark')
      root.classList.add('light')
      // constants.DEFAULT_BACKGROUNDS.light.applyBackground()
      window.localStorage.setItem('theme', JSON.stringify('light'))
    } else if (root.classList.contains('light')) {
      root.classList.remove('light')
      root.classList.add('dark')
      // constants.DEFAULT_BACKGROUNDS.dark.applyBackground()
      window.localStorage.setItem('theme', JSON.stringify('dark'))
    } else {
      root.classList.add('dark')
      // constants.DEFAULT_BACKGROUNDS.dark.applyBackground()
      window.localStorage.setItem('theme', JSON.stringify('dark'))
    }
  }

  return (
        <section className={styles.sidebar_controls}>
          <div className={styles.settings} onClick={handlePinPanel}>
            <PinPanelIcon id={'pin_icon'} className={`uiIcon ${styles.icon_pinned}`} />
          </div>
          <div className={styles.settings} onClick={handleChangeTheme}>
            <ThemeChangeIcon />
          </div>
          <div className={styles.settings} onClick={handleNavigate}>
            <ReadingListIcon />
          </div>
          <Link to={'/profile'} className={styles.settings_image_link}><img src={user.profileImage ? user.profileImage : '/img/avatar.svg' } alt={user.realName}/></Link>
          <div className={styles.settings} onClick={handleGoogleLogOut}>
            <SwitchOffIcon />
          </div>
        </section>
  )
}