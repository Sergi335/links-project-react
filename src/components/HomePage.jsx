import { Link } from 'react-router-dom'

export default function HomePage () {
  return (
      <>
        <h1>Bienvenido a JustLinks</h1>
        {/* <Link to={'/desktop/javascript'}>{'Go Desktops'}</Link> */}
        <Link to={'/login'}>{'Login'}</Link>
      </>
  )
}
