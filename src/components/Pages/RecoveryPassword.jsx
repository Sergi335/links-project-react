import { Link } from 'react-router-dom'
import useGoogleAuth from '../../hooks/useGoogleAuth'
import styles from './LoginPage.module.css'
export default function RecoveryPassword () {
  const { handleResetPasswordWithEmail } = useGoogleAuth()
  const handleRecoveryPass = async (e) => {
    e.preventDefault()
    const textElement = document.querySelector(`.${styles.recoveryText}`)
    const email = e.target.email.value
    const response = await handleResetPasswordWithEmail(email)
    if (response.status === 'success') {
      textElement.textContent = 'Perfecto!!, te hemos enviado un correo con las instrucciones para cambiar tu contraseña. Revisa tu bandeja de entrada o la carpeta de spam.'
    } else {
      if (response.error.message === 'Firebase: Error (auth/user-not-found).') {
        textElement.textContent = `No hemos encontrado ningún usuario con el email ${email}`
      } else {
        textElement.textContent = 'Ha ocurrido un error, por favor, vuelve a intentarlo más tarde.'
      }
    }
  }
  return (
        <main className={styles.loginMain}>
            <div className={styles.loginWrapper}>
                <div className={styles.logo}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 19V5m6 14V5M6 19V5"/></svg>
                    <h2 className={styles.logoText}>Zenmarks</h2>
                </div>
                <form action="" className={styles.loginForm} onSubmit={handleRecoveryPass}>
                    <input type="email" name="email" id="email" required />
                    <button className={styles.loginButton}>Recuperar</button>
                </form>
                <p className={styles.recoveryText}>Introduce la dirección de email con la que te registraste y te mandaremos un correo con instrucciones para cambiar tu contraseña.</p>
                <Link className={styles.start} to={'/login'}>Volver</Link>
            </div>
        </main>
  )
}
