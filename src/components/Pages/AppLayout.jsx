import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import useDbQueries from '../../hooks/useDbQueries'
import useResizeWindow from '../../hooks/useResizeWindow'
import { useFormsStore } from '../../store/forms'
import Bookmarks from '../Bookmarks'
import SideBar from '../SideBar/SideBar'
import SideControl from '../SideControl'
import styles from './HomePage.module.css'

export default function AppLayout () {
  const { desktopName, id } = useParams()

  useDbQueries({ desktopName })
  const setActualDesktop = useFormsStore(state => state.setActualDesktop)
  const windowSize = useResizeWindow()
  const isDesktop = windowSize.width > 1536
  // console.log(localStorage.getItem('bodyBackground') !== 'null')
  // Cambiar el fondo del body en la aplicación únicamente, no en el homepage ya que appLayout no afecta a HomePage
  // if (localStorage.getItem('bodyBackground') !== 'null') {
  //   const element = document.getElementById('mainContentWrapper')
  //   element.style.background = `url(${JSON.parse(localStorage.getItem('bodyBackground'))})`
  //   element.style.backgroundSize = 'cover'
  // }
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
      {isDesktop && <SideBar environment={'listoflinks'}/>}
      <div className="root">
        {id === undefined && <SideControl />}
        <Outlet />
      </div>
      {id === undefined && <Bookmarks />}
    </>
  )
}
