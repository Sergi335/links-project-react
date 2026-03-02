import { useEffect, useState } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import useDbQueries from '../../hooks/useDbQueries'
import { useTitle } from '../../hooks/useTitle'
import { useFormsStore } from '../../store/forms'
import CustomizeDesktopPanel from '../CustomizeDesktopPanel'
import FormsContainer from '../FormsContainer'
import Bookmarks from '../Header/Bookmarks'
import HeaderInfo from '../Header/HeaderInfo'
import ScrollToTop from '../ScrollToTop'
import SideBar from '../SideBar/SideBar'
import ToolBar from '../ToolBar/ToolBar'

export default function AppLayout () {
  const { desktopName, slug } = useParams()
  const location = useLocation()
  useTitle({ slug, desktopName })
  useDbQueries()
  const setActualDesktop = useFormsStore(state => state.setActualDesktop)
  const [isProfilePage, setIsProfilePage] = useState(false)
  const customizePanelVisible = useFormsStore(state => state.customizePanelVisible)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (desktopName !== undefined) {
      const root = document.getElementById('root')
      if (root.classList.contains('fullscreen')) root.classList.remove('fullscreen')
      setActualDesktop(desktopName)
      localStorage.setItem('actualDesktop', JSON.stringify(desktopName))
    }
    document.body.classList.remove('home')
  }, [desktopName])

  useEffect(() => {
    if (location.pathname === '/app/profile') {
      setIsProfilePage(true)
    } else {
      setIsProfilePage(false)
    }
  }, [location.pathname])

  return (
    <>
      <SideBar />
      <div id="grid" className={`grid${isProfilePage ? ' profile-page' : ''}`}>
        <ToolBar />
        <header className='main_header'>
          <Bookmarks />
          <HeaderInfo />
        </header>
        <Outlet />
      </div>
      <CustomizeDesktopPanel customizePanelVisible={customizePanelVisible} />
      <FormsContainer />
      <ScrollToTop />
    </>
  )
}
