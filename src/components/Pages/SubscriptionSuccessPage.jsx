import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getSubscriptionStatus } from '../../services/dbQueries'
import { useSessionStore } from '../../store/session'
import styles from './SubscriptionSuccessPage.module.css'

export default function SubscriptionSuccessPage () {
  const { t } = useTranslation('subscription')
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
        await new Promise(resolve => setTimeout(resolve, 2000))

        const response = await getSubscriptionStatus()
        if (!response.hasError) {
          setSubscription(response)
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
        console.error('Error checking subscription:', error)
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

        <h1 className={styles.title}>{t('title')}</h1>

        {isLoading
          ? (
            <div className={styles.loading}>
              <p>{t('verifying')}</p>
              <div className={styles.spinner}></div>
            </div>
            )
          : (
            <>
              <p className={styles.message}>
                {t('activeMessage', { plan: subscription?.plan || t('defaultPlan') })}
              </p>
              <p className={styles.submessage}>
                {t('submessage')}
              </p>

              <div className={styles.buttonGroup}>
                <button className={styles.primaryBtn} onClick={handleGoToDashboard}>
                  {t('goDashboard')}
                </button>
                <button className={styles.secondaryBtn} onClick={handleGoToProfile}>
                  {t('viewSubscription')}
                </button>
              </div>
            </>
            )}
      </div>
    </div>
  )
}
