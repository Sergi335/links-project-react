import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { PLANS } from '../../lib/stripe'
import { createCheckoutSession } from '../../services/dbQueries'
import { useSessionStore } from '../../store/session'
import styles from './PricingPage.module.css'
import { HomeFooter, HomeNav } from './HomePage'

export function PricingTable ({ style = {} }) {
  const { t } = useTranslation('pricing')
  const navigate = useNavigate()
  const user = useSessionStore(state => state.user)
  const [loadingPlan, setLoadingPlan] = useState(null)
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH

  const handleSubscribe = async (plan) => {
    if (!plan.priceId) {
      if (!user) {
        navigate(`${rootPath}login`)
      } else {
        navigate(`${rootPath}${basePath}`)
      }
      return
    }

    if (!user) {
      toast.info(t('toast.loginToSubscribe'))
      navigate(`${rootPath}login`)
      return
    }

    setLoadingPlan(plan.id)

    try {
      const response = await createCheckoutSession({
        priceId: plan.priceId,
        successUrl: `${window.location.origin}${rootPath}${basePath}/subscription/success`,
        cancelUrl: `${window.location.origin}${rootPath}pricing`
      })

      if (response.hasError) {
        toast.error(response.message)
        return
      }

      window.location.href = response.url
    } catch (error) {
      console.error('Error starting checkout:', error)
      toast.error(t('toast.paymentError'))
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className={styles.pricingContainer} style={style}>
      <header className={styles.header}>
        <h1>{t('header.title')}</h1>
        <p>{t('header.subtitle')}</p>
      </header>

      <div className={styles.plansGrid}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`${styles.planCard} ${plan.highlighted ? styles.highlighted : ''}`}
          >
            {plan.highlighted && <span className={styles.badge}>{t('badgePopular')}</span>}

            <h2 className={styles.planTitle}>{t(`plans.${plan.id}.title`)}</h2>
            <p className={styles.planDescription}>{t(`plans.${plan.id}.description`)}</p>

            <div className={styles.priceContainer}>
              <span className={styles.price}>{plan.price}</span>
              <span className={styles.period}>{t(`plans.${plan.id}.period`)}</span>
            </div>

            <ul className={styles.featuresList}>
              {t(`plans.${plan.id}.features`, { returnObjects: true }).map((feature, idx) => (
                <li key={idx} className={styles.feature}>
                  <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`${styles.subscribeBtn} ${plan.highlighted ? styles.primaryBtn : styles.secondaryBtn}`}
              onClick={() => handleSubscribe(plan)}
              disabled={loadingPlan === plan.id}
            >
              {loadingPlan === plan.id ? t('buttons.processing') : plan.priceId ? t('buttons.subscribe') : t('buttons.startFree')}
            </button>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <p>{t('footer.questions')} <a href="mailto:support@zenmarks.com">{t('footer.contact')}</a></p>
        <p className={styles.disclaimer}>
          {t('footer.disclaimer')}
        </p>
      </footer>
    </div>
  )
}

export default function PricingPage () {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <HomeNav />
      <PricingTable />
      <HomeFooter />
    </div>
  )
}
