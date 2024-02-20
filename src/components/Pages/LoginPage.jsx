import { useState } from 'react'
import useGoogleAuth from '../../hooks/useGoogleAuth'
import styles from './LoginPage.module.css'
import { Link } from 'react-router-dom'

export default function Login () {
  const { handleGoogleLogin, handleLoginWithMail, handleRegisterWithMail } = useGoogleAuth()
  const [login, setLogin] = useState(true)
  return (
    <main className={styles.loginMain}>
    <div className={styles.loginWrapper}>
      {
        login
          ? (
          <form className={styles.loginForm} action="" onSubmit={handleLoginWithMail}>
            <input type="text" name='email' placeholder='email' required/>
            <input type="password" name='password' placeholder='password' required/>
            <button>{'Log In'}</button>
          </form>
            )
          : (
          <form className={styles.registerForm} action="" onSubmit={handleRegisterWithMail}>
            <input type="text" id="email" name="email" placeholder="email" required/>
            <input type="password" id="password" name="password" placeholder="password" required/>
            <input type="text" id="name" name="name" placeholder="nick"/>
            <button>Register</button>
          </form>
            )
      }

      <p>
        {login ? 'Don\'t have an account? ' : 'Already have an account? '}
        <a className={styles.logSwitch} onClick={() => setLogin(!login)}>{login ? 'Register' : 'Login'}</a>
      </p>
      <p>Or</p>
      <button onClick={handleGoogleLogin}>{'Sign In With Google'}</button>
      {/* <button onClick={handleGoogleLogOut}>{'Log Out'}</button> */}
    <Link className={styles.start} to={'/'}>Go Back</Link>
    </div>
    </main>
  )
}
