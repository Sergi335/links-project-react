import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function HomePage () {
  useEffect(() => {
    fetch('http://localhost:3001', {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.text())
      .then(data => {
        console.log(data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])
  return (
      <>
        <h1>Bienvenido a JustLinks</h1>
        {/* <Link to={'/desktop/javascript'}>{'Go Desktops'}</Link> */}
        <Link to={'/login'}>{'Login'}</Link>
      </>
  )
}
