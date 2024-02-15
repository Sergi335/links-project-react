import { Link } from 'react-router-dom'
import useGoogleAuth from '../hooks/useGoogleAuth'
import { useSessionStore } from '../store/session'
import { useFormsStore } from '../store/forms'
import styles from './Header.module.css'
import { MenuIcon } from './Icons/icons'
import Search from './Search'
import Nav from './Nav'
import { usePreferencesStore } from '../store/preferences'
import { useEffect } from 'react'
// import { constants } from '../services/constants'

export default function Header () {
  const user = useSessionStore(state => state.user)
  const addDeskFormVisible = useFormsStore(state => state.addDeskFormVisible)
  const setAddDeskFormVisible = useFormsStore(state => state.setAddDeskFormVisible)
  const deleteConfFormVisible = useFormsStore(state => state.deleteConfFormVisible)
  const setDeleteConfFormVisible = useFormsStore(state => state.setDeleteConfFormVisible)
  const { handleGoogleLogOut } = useGoogleAuth()
  const navScroll = usePreferencesStore(state => state.navScroll)
  const setNavScroll = usePreferencesStore(state => state.setNavScroll)
  const navElement = usePreferencesStore(state => state.navElement)
  const limit = navElement?.scrollWidth - navElement?.offsetWidth || 0

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
  const handleScrollNav = (e) => {
    console.log(navElement.scrollWidth - navElement.offsetWidth)
    // console.log(navElement.offsetWidth)
    console.log(navScroll)
    if (e.currentTarget.childNodes[0].id === 'prev') {
      setNavScroll(navElement.scrollLeft)
      navElement.scrollLeft -= 100
    } else if (e.currentTarget.childNodes[0].id === 'next') {
      setNavScroll(navElement.scrollLeft)
      navElement.scrollLeft += 100
    }
  }
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
            <Search />
          </div>
          <div className={styles.headCenter} id='mobileMenu'>
          {
            navScroll > 0 && (
              <div className={styles.settings} style={{ position: 'absolute', left: '25px' }} onClick={handleScrollNav}>
                <svg xmlns="http://www.w3.org/2000/svg" id='prev' className={`uiIcon ${styles.prev}`} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" /></svg>
              </div>
            )
           }
           <Nav toggleMobileMenu={toggleMobileMenu}/>
           {
            navScroll < limit && (
              <div className={styles.settings} style={{ position: 'absolute', right: '25px' }} onClick={handleScrollNav}>
                <svg xmlns="http://www.w3.org/2000/svg" id='next' className={`uiIcon ${styles.next}`} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" /></svg>
              </div>
            )
           }
          </div>
          <div className={styles.headRight}>
          <div className={styles.settings} onClick={handleChangeTheme}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="uiIcon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>

          </div>
          <div className={styles.settings}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="uiIcon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
            </svg>
            <div className={styles.bodcontrols}>
              <span id="addDesk" onClick={() => setAddDeskFormVisible(!addDeskFormVisible)}>
                <svg className="uiIcon icofont-plus" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Añade escritorio</span>
              </span>
              <span id="selectLayout">
                <svg className="uiIcon icofont-edit" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z"></path></svg>
                <span>Cambiar vista</span>
              </span>
              <span id="removeDesk" onClick={() => setDeleteConfFormVisible(!deleteConfFormVisible)}>
                <svg className="uiIcon icofont-recycle" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
                <span>Eliminar escritorio</span>
              </span>
            </div>
          </div>

            <Link to={'/desktop/profile'} className={styles.settingsImg}><img src={user.profileImage ? user.profileImage : '/img/avatar.svg' } alt={user.realName}/></Link>

          <div className={styles.settings} onClick={handleGoogleLogOut}>
            <svg className="uiIcon icofont-exit" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"></path></svg>

          </div>
          </div>
        </header>

  )
}
