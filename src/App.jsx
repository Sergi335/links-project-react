import './App.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import HomePage from './components/HomePage'
import AppLayout from './components/applayout'
import Login from './components/login'
import { useSessionStore } from '../src/store/session'

function App () {
  const user = useSessionStore(state => state.user)
  const getData = () => {
    // console.log('Desde el App')
    const data = 'Holaaa'
    return data
  }
  const router = createBrowserRouter([
    {
      path: '/',
      loader: getData,
      element: <HomePage />
    },
    {
      path: '/desktop/:desktopName',
      loader: getData,
      element: user === null ? <Navigate to="/" replace={true} /> : <AppLayout />
    },
    {
      path: '/login',
      loader: getData,
      element: user === null ? <Login /> : <Navigate to="/desktop/inicio" replace={true} />
    }
  ])

  return (
    <RouterProvider router={router}>
      {/* <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/desktop/:name' element={<Main />} loader={getData} />
      </Routes> */}
    </RouterProvider>
  )
}

export default App
