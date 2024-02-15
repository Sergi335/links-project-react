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
// import { usePreferencesStore } from './store/preferences'

function App () {
  // const sidePanelElement = usePreferencesStore(state => state.sidePanelElement)
  // console.log('🚀 ~ App ~ sidePanelElement:', sidePanelElement)
  // la redireccion no debe depender del estado de la sesion, hay que comprobar si el usuario esta logueado o no en firebase
  const user = useSessionStore(state => state.user)
  // Hay que hacer una peticion a / para recibir el csfr token
  const setCsfrtoken = useSessionStore(state => state.setCsfrtoken)
  useEffect(() => {
    fetch(constants.BASE_API_URL, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        const { csrfToken } = data
        setCsfrtoken(csrfToken)
      })
  }, [])
  // Obtenemos el tema para el toast
  const theme = localStorage.getItem('theme') === null ? 'light' : JSON.parse(localStorage.getItem('theme')) // no funciona
  console.log('reload app')
  useEffect(() => {
    const theme = localStorage.getItem('theme') === null ? 'light' : JSON.parse(localStorage.getItem('theme'))
    document.documentElement.classList.add(theme)

    const accentColor = localStorage.getItem('accentColorName') === null ? '#bababa' : JSON.parse(localStorage.getItem('accentColorName'))
    constants.ACCENT_COLORS[accentColor].applyStyles()
  }, [])
  // useLayoutEffect(() => {
  //   const sideInfoStyles = localStorage.getItem('sideInfoStyles') === null ? 'theme' : JSON.parse(localStorage.getItem('sideInfoStyles'))
  //   if (sidePanelElement) constants.SIDE_INFO_STYLES[sideInfoStyles].applyStyles(sidePanelElement)
  // }, [])
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
        theme={theme}
      />
    </>
  )
}

export default App
