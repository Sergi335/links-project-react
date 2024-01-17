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
// Hay que hacer una peticion a / para recibir el csfr token
function App () {
  useEffect(() => {
    fetch(constants.BASE_API_URL, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
  })
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
