import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import useDbQueries from '../../hooks/useDbQueries'
import useResizeWindow from '../../hooks/useResizeWindow'
import { useFormsStore } from '../../store/forms'
import Bookmarks from '../Bookmarks'
import SideBar from '../SideBar/SideBar'
import ToolBar from '../ToolBar/ToolBar'
import styles from './HomePage.module.css'

export default function AppLayout () {
  const { desktopName, id } = useParams()
  useDbQueries({ desktopName })
  const setActualDesktop = useFormsStore(state => state.setActualDesktop)
  const windowSize = useResizeWindow()
  const isDesktop = windowSize.width > 1280 // Hacerlo en el hook

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

  // if (!isDesktop) {
  //   return (
  //     <>
  //       {id === undefined && <ToolBar />}
  //       <SideBar />
  //       {id === undefined && <Bookmarks />}
  //       <div className={'root root-mobile'}>
  //         <Outlet />
  //       </div>
  //     </>
  //   )
  // }

  return (
    <>
      <SideBar />
      <div className={isDesktop ? 'root' : 'root root-mobile'}>
        {id === undefined && <ToolBar />}
        <Outlet />
      </div>
      {id === undefined && <Bookmarks />}
    </>
  )
}
