import './App.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import HomePage from './components/Pages/HomePage'
import AppLayout from './components/Pages/AppLayout'
import Login from './components/Pages/LoginPage'
import LinkDetails from './components/Pages/LinkDetails'
import { useSessionStore } from '../src/store/session'

function App () {
  const user = useSessionStore(state => state.user)
  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />
    },
    {
      path: '/desktop/:desktopName',
      element: user === null ? <Navigate to="/" replace={true} /> : <AppLayout />
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
    <RouterProvider router={router} />
  )
}

export default App
