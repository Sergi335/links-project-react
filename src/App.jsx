import '@fontsource-variable/inter'
import { useOverlayScrollbars } from 'overlayscrollbars-react'
import 'overlayscrollbars/overlayscrollbars.css'
import { useEffect } from 'react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDesktopsStore } from '../src/store/desktops'
import { useSessionStore } from '../src/store/session'
import LinkDetailsPage from './components/LinkDetails/LinkDetailsPage'
import ListOfLinks from './components/ListOfLinks'
import NotFound from './components/Pages/404'
import InternalError from './components/Pages/500'
import AppLayout from './components/Pages/AppLayout'
import HomePage from './components/Pages/HomePage'
import Login from './components/Pages/LoginPage'
import ProfilePage from './components/Pages/ProfilePage'
import ReadingList from './components/Pages/ReadingList'
import RecoveryPassword from './components/Pages/RecoveryPassword'
import SingleColumnPage from './components/SingleColumnPage'
import { useStyles } from './hooks/useStyles'
import { constants } from './services/constants'

function App () {
  function keepServerAwake(apiUrl, intervalMinutes = 14) {
  const wakeUp = async () => {
    try {
        await fetch(apiUrl);
        console.log('Server pinged at:', new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Ping failed:', error);
      }
    }

    // Ejecutar inmediatamente y luego periódicamente
    wakeUp();
    return setInterval(wakeUp, intervalMinutes * 60 * 1000);
  }

  // Iniciar (guarda el intervalo para limpiarlo luego si es necesario)
  const intervalId = keepServerAwake(`${constants.BASE_API_URL}/health`, 10)

  // Para detenerlo:
  // clearInterval(intervalId)
  
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
  // TODO la desktops store se guarda en memoria pero la sesion sigue iniciada si se recarga la pagina no existe desktops store
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const firstDesktop = localStorage.getItem('firstDesktop') === null ? desktopsStore[0]?.name : JSON.parse(localStorage.getItem('firstDesktop'))

  const { themeforToastify, theme } = useStyles()
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH
  // console.log('🚀 ~ App ~ basePath:', basePath)
  // console.log('🚀 ~ App ~ basePath:', rootPath)

  const router = createBrowserRouter([
    {
      path: rootPath,
      element: <HomePage />,
      errorElement: <InternalError />
    },
    {
      path: `${rootPath}${basePath}`,
      element: user === null ? <Navigate to="/" replace={true} /> : <AppLayout />,
      errorElement: <InternalError />,
      children: [
        {
          path: `${rootPath}${basePath}/:desktopName`,
          element: <ListOfLinks />,
          errorElement: <InternalError />
        },
        {
          path: `${rootPath}${basePath}/:desktopName/:slug/:id`,
          element: <SingleColumnPage />,
          errorElement: <InternalError />
        },
        {
          path: `${rootPath}${basePath}/:desktopName/link/:id`,
          element: <LinkDetailsPage />,
          errorElement: <InternalError />
        }
      ]
    },
    {
      path: '/column',
      element: user === null ? <Navigate to="/" replace={true} /> : <AppLayout />,
      errorElement: <InternalError />,
      children: [
        {
          path: '/column/:desktopName/:columnId',
          element: <SingleColumnPage />,
          errorElement: <InternalError />
        }
        // {
        //   path: '/desktop/:desktopName/link/:id',
        //   element: <LinkDetailsPage />,
        //   errorElement: <InternalError />
        // }
      ]
    },
    {
      path: '/profile',
      element: user === null ? <Navigate to="/" replace={true} /> : <AppLayout />,
      errorElement: <InternalError />,
      children: [
        {
          path: '/profile',
          element: <ProfilePage />,
          errorElement: <InternalError />
        }
      ]
    },
    {
      path: '/readinglist',
      element: user === null ? <Navigate to="/" replace={true} /> : <AppLayout />,
      errorElement: <InternalError />,
      children: [
        {
          path: '/readinglist',
          element: <ReadingList />,
          errorElement: <InternalError />
        }
      ]
    },
    {
      path: '/login',
      element: user === null ? <Login /> : <Navigate to={`/desktop/${firstDesktop}`} replace={true} />,
      errorElement: <InternalError />
    },
    {
      path: '/recovery-password',
      element: user === null ? <RecoveryPassword /> : <Navigate to={`/desktop/${firstDesktop}`} replace={true} />,
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
          theme: `os-theme-${theme}`
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
