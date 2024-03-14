import { useState } from 'react'
import { Link } from 'react-router-dom'
import useGoogleAuth from '../../hooks/useGoogleAuth'
import { useGlobalStore } from '../../store/global'
import { GoogleLogo } from '../Icons/icons'
import styles from './LoginPage.module.css'

export default function Login () {
  const { handleGoogleLogin, handleLoginWithMail, handleRegisterWithMail } = useGoogleAuth()
  const loginLoading = useGlobalStore(state => state.loginLoading)
  const registerLoading = useGlobalStore(state => state.registerLoading)
  const [login, setLogin] = useState(true)
  return (
    <main className={styles.loginMain}>
    <div className={styles.loginWrapper}>
      <div className={styles.logo}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 19V5m6 14V5M6 19V5"/></svg>
        <h2 className={styles.logoText}>Zenmarks</h2>
      </div>
      {
        login
          ? (
          <form className={styles.loginForm} action="" onSubmit={handleLoginWithMail}>
            <input type="text" name='email' placeholder='email' required />
            <input type="password" name='password' placeholder='password' required />
            <button className={styles.loginButton}>Inicia Sesión</button>
            <Link to={'/recovery-password'}>olvidaste la contraseña?</Link>
          </form>
            )
          : (
          <form className={styles.registerForm} onSubmit={handleRegisterWithMail}>
            <input type="email" id="email" name="email" placeholder="email" required />
            <input type="password" id="password" name="password" placeholder="password" required />
            <input type="text" id="name" name="name" placeholder="nick" />
            <button className={styles.loginButton}>Registrarse</button>
            <div className={registerLoading ? `${styles.loaderWrapper} ${styles.visible}` : `${styles.loaderWrapper} ${styles.hidden}` }>
              <span className={styles.loader}></span>
            </div>
          </form>
            )
      }

      <p style={{ marginBottom: 0, fontSize: '1.3rem' }}>
        {login ? 'No tienes una cuenta? ' : 'Ya tienes una cuenta? '}
        <a className={styles.logSwitch} onClick={() => setLogin(!login)}>{login ? 'Regístrate' : 'Inicia Sesión'}</a>
      </p>
      <p style={{ textTransform: 'uppercase' }}>O</p>
      <button onClick={handleGoogleLogin} className={styles.google}><GoogleLogo/>Continua con Google</button>
      <div className={loginLoading ? `${styles.loaderWrapper} ${styles.visible}` : `${styles.loaderWrapper} ${styles.hidden}` }>
        <span className={styles.loader}></span>
      </div>
    <Link className={styles.start} to={'/'}>Volver</Link>
    </div>
    </main>
  )
}
