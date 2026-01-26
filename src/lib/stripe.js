import { loadStripe } from '@stripe/stripe-js'

// Inicialización de Stripe con la clave pública
// Asegúrate de tener VITE_STRIPE_PUBLIC_KEY en tu .env
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

// IDs de precios (reemplazar con los IDs reales del Dashboard de Stripe)
export const STRIPE_PRICES = {
  PRO: import.meta.env.VITE_STRIPE_PRICE_ID_PRO || 'price_pro_placeholder',
  ENTERPRISE: import.meta.env.VITE_STRIPE_PRICE_ID_ENTERPRISE || 'price_enterprise_placeholder'
}

// Configuración de planes
export const PLANS = [
  {
    id: 'free',
    title: 'Free',
    price: '0€',
    period: '/mes',
    description: 'Para uso personal',
    features: [
      '50MB de almacenamiento',
      '5 llamadas IA al mes',
      'Soporte básico'
    ],
    priceId: null,
    highlighted: false
  },
  {
    id: 'pro',
    title: 'Pro',
    price: '10€',
    period: '/mes',
    description: 'Para usuarios avanzados',
    features: [
      '5GB de almacenamiento',
      '50 llamadas IA al mes',
      'Soporte prioritario',
      'Exportación de datos'
    ],
    priceId: STRIPE_PRICES.PRO,
    highlighted: true
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    price: '50€',
    period: '/mes',
    description: 'Para equipos y empresas',
    features: [
      '50GB de almacenamiento',
      'Llamadas IA ilimitadas',
      'Soporte dedicado 24/7',
      'API personalizada',
      'Onboarding asistido'
    ],
    priceId: STRIPE_PRICES.ENTERPRISE,
    highlighted: false
  }
]
