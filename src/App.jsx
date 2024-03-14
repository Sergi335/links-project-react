import '@fontsource-variable/inter'
import { useOverlayScrollbars } from 'overlayscrollbars-react'
import 'overlayscrollbars/overlayscrollbars.css'
import { useEffect } from 'react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDesktopsStore } from '../src/store/desktops'
import { useSessionStore } from '../src/store/session'
import ListOfLinks from './components/ListOfLinks'
import NotFound from './components/Pages/404'
import InternalError from './components/Pages/500'
import AppLayout from './components/Pages/AppLayout'
import HomePage from './components/Pages/HomePage'
import LinkDetails from './components/Pages/LinkDetails'
import Login from './components/Pages/LoginPage'
import ProfilePage from './components/Pages/ProfilePage'
import ReadingList from './components/Pages/ReadingList'
import RecoveryPassword from './components/Pages/RecoveryPassword'
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
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  // console.log('🚀 ~ App ~ desktopsStore:', desktopsStore)
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
      element: <HomePage />,
      errorElement: <InternalError />
    },
    {
      path: '/desktop',
      element: user === null ? <Navigate to="/" replace={true} /> : <AppLayout />,
      errorElement: <InternalError />,
      children: [
        {
          path: '/desktop/:desktopName',
          element: <ListOfLinks />,
          errorElement: <InternalError />
        },
        {
          path: '/desktop/readinglist',
          element: <ReadingList />,
          errorElement: <InternalError />
        },
        {
          path: '/desktop/link/:id',
          element: <LinkDetails />,
          errorElement: <InternalError />
        },
        {
          path: '/desktop/profile',
          element: <ProfilePage />,
          errorElement: <InternalError />
        },
        {
          path: '/desktop/',
          element: <ListOfLinks />,
          errorElement: <InternalError />
        }
      ]
    },
    {
      path: '/link/:id',
      element: user === null ? <Navigate to="/" replace={true} /> : <LinkDetails />,
      errorElement: <InternalError />
    },
    {
      path: '/login',
      element: user === null ? <Login /> : <Navigate to={`/desktop/${desktopsStore[0]?.name}`} replace={true} />,
      errorElement: <InternalError />
    },
    {
      path: '/recovery-password',
      element: user === null ? <RecoveryPassword /> : <Navigate to={`/desktop/${desktopsStore[0]?.name}`} replace={true} />,
      errorElement: <InternalError />
    },
    {
      path: '*',
      element: <NotFound />
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
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={themeforToastify}
        transition={Zoom}
      />
    </>
  )
}

export default App
