import './App.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import HomePage from './components/Pages/HomePage'
import AppLayout from './components/Pages/AppLayout'
import Login from './components/Pages/LoginPage'
import LinkDetails from './components/Pages/LinkDetails'
import { useSessionStore } from '../src/store/session'
import ListOfLinks from './components/ListOfLinks'
import ReadingList from './components/Pages/ReadingList'
import ProfilePage from './components/Pages/ProfilePage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'overlayscrollbars/overlayscrollbars.css'
import { useOverlayScrollbars } from 'overlayscrollbars-react'
import { constants } from './services/constants'

function App () {
  useEffect(() => {
    if (localStorage.getItem('bodyBackground')) {
      document.body.style.backgroundImage = `url(${JSON.parse(localStorage.getItem('bodyBackground'))})`
      document.body.style.backgroundSize = 'cover'
    }
    if (localStorage.getItem('theme')) {
      JSON.parse(localStorage.getItem('theme')) === 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
    }
    if (localStorage.getItem('sideInfoStyles')) {
      const panel = document.getElementById('sideinfo')
      panel && constants.SIDE_INFO_STYLES[JSON.parse(localStorage.getItem('sideInfoStyles'))].applyStyles(panel)
    }
    if (localStorage.getItem('accentColorName')) {
      constants.ACCENT_COLORS[JSON.parse(localStorage.getItem('accentColorName'))].applyStyles()
    }
  }, [])
  const user = useSessionStore(state => state.user) // la redireccion no debe depender del estado de la sesion, hay que comprobar si el usuario esta logueado o no en firebase
  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />
    },
    {
      path: '/desktop',
      element: user === null ? <Navigate to="/" replace={true} /> : <AppLayout />,
      children: [
        {
          path: '/desktop/:desktopName',
          element: <ListOfLinks />
        },
        {
          path: '/desktop/readinglist',
          element: <ReadingList />
        },
        {
          path: '/desktop/link/:id',
          element: <LinkDetails />
        },
        {
          path: '/desktop/profile',
          element: <ProfilePage />
        }
      ]
    },
    {
      path: '/link/:id',
      element: user === null ? <Navigate to="/" replace={true} /> : <LinkDetails />
    },
    {
      path: '/login',
      element: user === null ? <Login /> : <Navigate to="/desktop/inicio" replace={true} />
    }
  ])
  const [initBodyOverlayScrollbars] =
    useOverlayScrollbars({
      defer: true,
      options: {
        scrollbars: {
          theme: 'os-theme-light'
        }
      }
    })
  useEffect(() => {
    initBodyOverlayScrollbars(document.body)
  }, [])
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App
