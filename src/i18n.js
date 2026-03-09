import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import enCommon from './locales/en/common.json'
import enErrors from './locales/en/errors.json'
import enFeatures from './locales/en/features.json'
import enHome from './locales/en/home.json'
import enLegal from './locales/en/legal.json'
import enLogin from './locales/en/login.json'
import enPricing from './locales/en/pricing.json'
import enRecovery from './locales/en/recovery.json'
import enSubscription from './locales/en/subscription.json'
import esCommon from './locales/es/common.json'
import esErrors from './locales/es/errors.json'
import esFeatures from './locales/es/features.json'
import esHome from './locales/es/home.json'
import esLegal from './locales/es/legal.json'
import esLogin from './locales/es/login.json'
import esPricing from './locales/es/pricing.json'
import esRecovery from './locales/es/recovery.json'
import esSubscription from './locales/es/subscription.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        errors: enErrors,
        features: enFeatures,
        home: enHome,
        legal: enLegal,
        login: enLogin,
        pricing: enPricing,
        recovery: enRecovery,
        subscription: enSubscription
      },
      es: {
        common: esCommon,
        errors: esErrors,
        features: esFeatures,
        home: esHome,
        legal: esLegal,
        login: esLogin,
        pricing: esPricing,
        recovery: esRecovery,
        subscription: esSubscription
      }
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    load: 'languageOnly',
    ns: ['common', 'errors', 'features', 'home', 'legal', 'login', 'pricing', 'recovery', 'subscription'],
    defaultNS: 'common',
    detection: {
      order: ['navigator'],
      caches: []
    },
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
