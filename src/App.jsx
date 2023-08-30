import './App.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import HomePage from './components/HomePage'
import AppLayout from './components/applayout'
import Login from './components/login'
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
      path: '/login',
      element: user === null ? <Login /> : <Navigate to="/desktop/inicio" replace={true} />
    }
  ])

  return (
    <RouterProvider router={router}>
    </RouterProvider>
  )
}

export default App
