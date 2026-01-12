import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSubscriptionStatus } from '../../services/dbQueries'
import { useSessionStore } from '../../store/session'
import styles from './SubscriptionSuccessPage.module.css'

export default function SubscriptionSuccessPage () {
  const navigate = useNavigate()
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH
  const user = useSessionStore(state => state.user)
  const setUser = useSessionStore(state => state.setUser)
  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        // Esperar un momento para que el webhook procese el pago
        await new Promise(resolve => setTimeout(resolve, 2000))

        const response = await getSubscriptionStatus()
        if (!response.hasError) {
          setSubscription(response)
          // Actualizar el usuario en el store si hay cambios
          if (user && response.plan) {
            setUser({
              ...user,
              subscription: {
                plan: response.plan,
                status: response.status
              }
            })
          }
        }
      } catch (error) {
        console.error('Error verificando suscripción:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSubscription()
  }, [user, setUser])

  const handleGoToDashboard = () => {
    navigate(`${rootPath}${basePath}`)
  }

  const handleGoToProfile = () => {
    navigate(`${rootPath}${basePath}/profile`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <svg className={styles.successIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className={styles.title}>¡Pago realizado con éxito!</h1>

        {isLoading
          ? (
          <div className={styles.loading}>
            <p>Verificando tu suscripción...</p>
            <div className={styles.spinner}></div>
          </div>
            )
          : (
          <>
            <p className={styles.message}>
              Tu suscripción al plan <strong>{subscription?.plan || 'Pro'}</strong> está activa.
            </p>
            <p className={styles.submessage}>
              Ahora tienes acceso a todas las funcionalidades premium.
            </p>

            <div className={styles.buttonGroup}>
              <button className={styles.primaryBtn} onClick={handleGoToDashboard}>
                Ir al Dashboard
              </button>
              <button className={styles.secondaryBtn} onClick={handleGoToProfile}>
                Ver mi suscripción
              </button>
            </div>
          </>
            )}
      </div>
    </div>
  )
}
