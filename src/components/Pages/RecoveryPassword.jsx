import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import useGoogleAuth from '../../hooks/useGoogleAuth'
import styles from './LoginPage.module.css'

export default function RecoveryPassword () {
  const { t } = useTranslation(['common', 'recovery'])
  const { handleResetPasswordWithEmail } = useGoogleAuth()

  const handleRecoveryPass = async (e) => {
    e.preventDefault()
    const textElement = document.querySelector(`.${styles.recoveryText}`)
    const email = e.target.email.value
    const response = await handleResetPasswordWithEmail(email)
    if (response.status === 'success') {
      textElement.textContent = t('recovery:success')
    } else {
      if (response.error.message === 'Firebase: Error (auth/user-not-found).') {
        textElement.textContent = t('recovery:userNotFound', { email })
      } else {
        textElement.textContent = t('recovery:genericError')
      }
    }
  }

  return (
    <main className={styles.loginMain}>
      <div className={styles.loginWrapper}>
        <div className={styles.logo}>
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 19V5m6 14V5M6 19V5"/></svg> */}
          <h2 className={styles.logoText}>{t('common:brand')}</h2>
        </div>
        <form action="" className={styles.loginForm} onSubmit={handleRecoveryPass}>
          <input type="email" name="email" id="email" required />
          <button className={styles.loginButton}>{t('recovery:button')}</button>
        </form>
        <p className={styles.recoveryText}>{t('recovery:description')}</p>
        <Link className={styles.start} to={'/login'}>{t('common:actions.back')}</Link>
      </div>
    </main>
  )
}
