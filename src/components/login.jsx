import { useState } from 'react'
import useGoogleAuth from '../hooks/useGoogleAuth'

export default function Login () {
  const [user, setUser] = useState(null)
  const [password, setPassword] = useState(null)
  const { handleGoogleLogin } = useGoogleAuth()

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Submit')
    const body = JSON.stringify({ name: user, password })
    fetch('http://localhost:3003/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
      })
      .catch(error => {
        console.log(error)
      })
  }
  return (
    <div className="loginWrapper">
      <form className="loginForm" action="">
        <input onChange={event => setUser(event.target.value)} type="text" />
        <input onChange={event => setPassword(event.target.value)} type="text" />
        <button onClick={handleSubmit}>{'Log In'}</button>
      </form>
      <button onClick={handleGoogleLogin}>{'Sign In With Google'}</button>
      {/* <button onClick={handleGoogleLogOut}>{'Log Out'}</button> */}
    </div>
  )
}
