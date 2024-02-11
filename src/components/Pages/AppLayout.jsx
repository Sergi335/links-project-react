import Header from '../Header'
// import Nav from '../Nav'
import { Outlet, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import useDbQueries from '../../hooks/useDbQueries'
import { useFormsStore } from '../../store/forms'
// import ListOfLinks from '../ListOfLinks'

export default function AppLayout ({ children }) {
  const { desktopName } = useParams()
  useDbQueries({ desktopName })
  const setActualDesktop = useFormsStore(state => state.setActualDesktop)
  useEffect(() => {
    if (desktopName !== undefined) {
      const root = document.getElementById('root')
      if (root.classList.contains('fullscreen')) root.classList.remove('fullscreen')
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
