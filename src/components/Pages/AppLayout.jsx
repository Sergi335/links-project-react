import Header from '../Header'
import Nav from '../Nav'
import { Outlet } from 'react-router-dom'
// import ListOfLinks from '../ListOfLinks'

export default function AppLayout ({ children }) {
  return (
    <>
      <Header />
      <Nav />
      {/* <ListOfLinks /> */}
      <Outlet />
    </>
  )
}
