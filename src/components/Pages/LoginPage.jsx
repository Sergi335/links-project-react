import useGoogleAuth from '../../hooks/useGoogleAuth'

export default function Login () {
  // const [user, setUser] = useState(null)
  // const [password, setPassword] = useState(null)
  const { handleGoogleLogin, handleLoginWithMail, handleRegisterWithMail } = useGoogleAuth()

  // const handleSubmit = (event) => {
  //   event.preventDefault()
  //   console.log('Submit')
  //   const body = JSON.stringify({ name: user, password })
  //   fetch('http://localhost:3003/login', {
  //     method: 'POST',
  //     headers: {
  //       'content-type': 'application/json'
  //     },
  //     body
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log(data)
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     })
  // }
  return (
    <>
    <div className="loginWrapper">
      <form className="loginForm" action="" onSubmit={handleLoginWithMail}>
        <input type="text" name='email' />
        <input type="text" name='password'/>
        <button>{'Log In'}</button>
      </form>
      <button onClick={handleGoogleLogin}>{'Sign In With Google'}</button>
      {/* <button onClick={handleGoogleLogOut}>{'Log Out'}</button> */}
    <form className="registerForm" action="" onSubmit={handleRegisterWithMail}>
        <input type="text" id="email" name="email" placeholder="email"/>
        <input type="text" id="password" name="password" placeholder="password"/>
        <input type="text" id="name" name="name" placeholder="nombre"/>
        <button>Register</button>
      </form>
    </div>
    </>
  )
}
