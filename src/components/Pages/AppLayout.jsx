import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import useDbQueries from '../../hooks/useDbQueries'
import { useFormsStore } from '../../store/forms'
import Bookmarks from '../Bookmarks'
import LogoDisplay from '../NavBar/LogoDisplay'
import ScrollToTop from '../ScrollToTop'
import SideBar from '../SideBar/SideBar'
import SideBarInfo from '../SideBar/SideBarInfo'
import ToolBar from '../ToolBar/ToolBar'
import styles from './HomePage.module.css'

export default function AppLayout () {
  const { desktopName, id } = useParams()
  useDbQueries({ desktopName })
  const setActualDesktop = useFormsStore(state => state.setActualDesktop)

  useEffect(() => {
    if (desktopName !== undefined) {
      const root = document.getElementById('root')
      if (root.classList.contains('fullscreen')) root.classList.remove('fullscreen')
      if (document.body.classList.contains(`${styles.home}`)) document.body.classList.remove(`${styles.home}`)
      setActualDesktop(desktopName)
      localStorage.setItem('actualDesktop', JSON.stringify(desktopName))
    }
    document.body.classList.remove('home')
  }, [desktopName])

  return (
    <>
      <SideBar />
      <div id="grid" className="grid">
        {id === undefined && <ToolBar />}
      <header>
        <LogoDisplay />
        <Bookmarks />
        <SideBarInfo />
      </header>
        <Outlet />
      </div>
      <ScrollToTop />
    </>
  )
}
