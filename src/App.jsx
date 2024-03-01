import '@fontsource-variable/inconsolata'
import '@fontsource-variable/inter'
import '@fontsource-variable/montserrat'
import '@fontsource-variable/noto-sans'
import '@fontsource-variable/open-sans'
import '@fontsource-variable/readex-pro'
import { useOverlayScrollbars } from 'overlayscrollbars-react'
import 'overlayscrollbars/overlayscrollbars.css'
import { useEffect } from 'react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSessionStore } from '../src/store/session'
import ListOfLinks from './components/ListOfLinks'
import AppLayout from './components/Pages/AppLayout'
import HomePage from './components/Pages/HomePage'
import LinkDetails from './components/Pages/LinkDetails'
import Login from './components/Pages/LoginPage'
import ProfilePage from './components/Pages/ProfilePage'
import ReadingList from './components/Pages/ReadingList'
import { constants } from './services/constants'

function App () {
  // TODO la redireccion no debe depender del estado de la sesion, hay que comprobar si el usuario esta logueado o no en firebase
  const user = useSessionStore(state => state.user)
  // TODO Hay que hacer una peticion a / para recibir el csfr token, limitar a solo cuando acceda a / o /login
  const setCsfrtoken = useSessionStore(state => state.setCsfrtoken)
  useEffect(() => {
    fetch(constants.BASE_API_URL, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
      .then(res => res.json())
      .then(data => {
        const { csrfToken } = data
        setCsfrtoken(csrfToken)
      })
  }, [])

  // Obtenemos el tema para el toast -> no funciona?
  const themeforToastify = localStorage.getItem('theme') === null ? 'light' : JSON.parse(localStorage.getItem('theme')) // no funciona?
  useEffect(() => {
    const theme = localStorage.getItem('theme') === null ? 'light' : JSON.parse(localStorage.getItem('theme'))
    document.documentElement.classList.add(theme)

    const accentColors = Object.keys(constants.ACCENT_COLORS)
    const accentColor = JSON.parse(localStorage.getItem('accentColorName')) ?? accentColors[0]
    constants.ACCENT_COLORS[accentColor].applyStyles()

    if (localStorage.getItem('themeVariant') === null) {
      localStorage.setItem('themeVariant', JSON.stringify('solid'))
      constants.THEME_VARIANTS.solid.applyStyles()
    } else {
      const themeVariant = JSON.parse(localStorage.getItem('themeVariant'))
      constants.THEME_VARIANTS[themeVariant].applyStyles()
    }
  }, [])

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
        theme={themeforToastify}
      />
    </>
  )
}

export default App
