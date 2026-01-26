import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { PLANS } from '../../lib/stripe'
import { createCheckoutSession } from '../../services/dbQueries'
import { useSessionStore } from '../../store/session'
import styles from './PricingPage.module.css'
import { HomeNav, HomeFooter } from './HomePage'

export function PricingTable ({ style = {} }) {
  const navigate = useNavigate()
  const user = useSessionStore(state => state.user)
  const [loadingPlan, setLoadingPlan] = useState(null)
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH
  const handleSubscribe = async (plan) => {
    if (!plan.priceId) {
      // Plan gratuito - redirigir a registro o app
      if (!user) {
        navigate(`${rootPath}login`)
      } else {
        navigate(`${rootPath}${basePath}`)
      }
      return
    }

    if (!user) {
      toast.info('Inicia sesión para suscribirte')
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

      // Redirigir a Stripe Checkout
      window.location.href = response.url
    } catch (error) {
      console.error('Error al iniciar checkout:', error)
      toast.error('Error al procesar el pago')
    } finally {
      setLoadingPlan(null)
    }
  }
  return (
    <div className={styles.pricingContainer} style={style}>
      <header className={styles.header}>
        <h1>Elige tu plan</h1>
        <p>Selecciona el plan que mejor se adapte a tus necesidades</p>
      </header>

      <div className={styles.plansGrid}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`${styles.planCard} ${plan.highlighted ? styles.highlighted : ''}`}
          >
            {plan.highlighted && <span className={styles.badge}>Más popular</span>}

            <h2 className={styles.planTitle}>{plan.title}</h2>
            <p className={styles.planDescription}>{plan.description}</p>

            <div className={styles.priceContainer}>
              <span className={styles.price}>{plan.price}</span>
              <span className={styles.period}>{plan.period}</span>
            </div>

            <ul className={styles.featuresList}>
              {plan.features.map((feature, idx) => (
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
              {loadingPlan === plan.id ? 'Procesando...' : plan.priceId ? 'Suscribirse' : 'Comenzar gratis'}
            </button>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <p>¿Tienes preguntas? <a href="mailto:support@zenmarks.com">Contáctanos</a></p>
        <p className={styles.disclaimer}>
          Los pagos son procesados de forma segura por Stripe. Puedes cancelar en cualquier momento.
        </p>
      </footer>
    </div>
  )
}

export default function PricingPage () {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }} >
    <HomeNav />
    <PricingTable />
    <HomeFooter />
    </div>
  )
}
