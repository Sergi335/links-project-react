import { Link, useLocation } from 'react-router-dom'
import useGoogleAuth from '../../hooks/useGoogleAuth'
import { useFormsStore } from '../../store/forms'
import { useSessionStore } from '../../store/session'
import { AddDesktopIcon, ChangeLayoutIcon, SearchIcon, SettingsIcon, SwitchOffIcon, ThemeChangeIcon, TrashIcon } from '../Icons/icons'
import styles from './SideInfo.module.css'

export default function SideBarControls () {
  const user = useSessionStore(state => state.user)
  // Popover API?
  const addDeskFormVisible = useFormsStore(state => state.addDeskFormVisible)
  const setAddDeskFormVisible = useFormsStore(state => state.setAddDeskFormVisible)
  const deleteConfFormVisible = useFormsStore(state => state.deleteConfFormVisible)
  const setDeleteConfFormVisible = useFormsStore(state => state.setDeleteConfFormVisible)
  const { handleGoogleLogOut } = useGoogleAuth()
  const location = useLocation()

  const handleShowSearch = () => {
    const search = document.getElementById('searchForm')
    search.classList.toggle('show')
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
  const handleShowAddDesktop = () => {
    setAddDeskFormVisible(!addDeskFormVisible)
  }
  const handleShowDeleteDesktop = () => {
    setDeleteConfFormVisible(!deleteConfFormVisible)
  }
  return (
        <section className={styles.sidebar_controls}>
          <div className={styles.settings} onClick={handleShowSearch}>
            <SearchIcon />
          </div>
          <div className={styles.settings} onClick={handleChangeTheme}>
            <ThemeChangeIcon />
          </div>
          {
            location.pathname !== '/profile' && (
              <div className={styles.settings}>
                <SettingsIcon />
                <div className={styles.sidebar_inner_controls}>
                  <span onClick={handleShowAddDesktop}>
                    <AddDesktopIcon />
                    <span>Añade escritorio</span>
                  </span>
                  <span>
                    <ChangeLayoutIcon />
                    <span>Cambiar vista</span>
                  </span>
                  <span onClick={handleShowDeleteDesktop}>
                    <TrashIcon />
                    <span>Eliminar escritorio</span>
                  </span>
                </div>
            </div>
            )
          }
          <Link to={'/profile'} className={styles.settings_image_link}><img src={user.profileImage ? user.profileImage : '/img/avatar.svg' } alt={user.realName}/></Link>
          <div className={styles.settings} onClick={handleGoogleLogOut}>
            <SwitchOffIcon />
          </div>
        </section>
  )
}
