import Header from '../Header'
// import Nav from '../Nav'
import { Outlet, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import useDbQueries from '../../hooks/useDbQueries'
import { useFormsStore } from '../../store/forms'
import styles from './HomePage.module.css'
// import ListOfLinks from '../ListOfLinks'

export default function AppLayout ({ children }) {
  const { desktopName } = useParams()
  useDbQueries({ desktopName })
  const setActualDesktop = useFormsStore(state => state.setActualDesktop)
  // Cambiar el fondo del body en la aplicación únicamente, no en el homepage ya que appLayout no afecta a HomePage
  if (localStorage.getItem('bodyBackground') !== '') {
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
