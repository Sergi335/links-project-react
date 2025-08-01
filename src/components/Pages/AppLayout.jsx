import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import useDbQueries from '../../hooks/useDbQueries'
import { useFormsStore } from '../../store/forms'
import Bookmarks from '../Header/Bookmarks'
import HeaderInfo from '../Header/HeaderInfo'
import ScrollToTop from '../ScrollToTop'
import SideBar from '../SideBar/SideBar'
import ToolBar from '../ToolBar/ToolBar'
import styles from './HomePage.module.css'

export default function AppLayout () {
  const { desktopName } = useParams()
  // // console.log('🚀 ~ AppLayout ~ id:', id)
  useDbQueries()
  const setActualDesktop = useFormsStore(state => state.setActualDesktop)

  useEffect(() => {
    window.scrollTo(0, 0)
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
        <ToolBar />
      <header className='main_header'>
        <Bookmarks />
        <HeaderInfo />
      </header>
        <Outlet />
      </div>
      <ScrollToTop />
    </>
  )
}
