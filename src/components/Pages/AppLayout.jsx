import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import useDbQueries from '../../hooks/useDbQueries'
import { useFormsStore } from '../../store/forms'
import Header from '../Header'
import styles from './HomePage.module.css'

export default function AppLayout ({ children }) {
  const { desktopName } = useParams()
  useDbQueries({ desktopName })
  const setActualDesktop = useFormsStore(state => state.setActualDesktop)
  console.log(localStorage.getItem('bodyBackground') !== 'null')
  // Cambiar el fondo del body en la aplicación únicamente, no en el homepage ya que appLayout no afecta a HomePage
  if (localStorage.getItem('bodyBackground') !== 'null') {
    document.body.style.backgroundImage = `url(${JSON.parse(localStorage.getItem('bodyBackground'))})`
    document.body.style.backgroundSize = 'cover'
  }
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
    <div className="root">
      <Header />
      {/* <ListOfLinks /> */}
      <Outlet />
    </div>
  )
}
