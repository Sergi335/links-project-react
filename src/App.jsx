import './App.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
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

function App () {
  const user = useSessionStore(state => state.user)
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
