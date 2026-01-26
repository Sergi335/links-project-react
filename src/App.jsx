import '@fontsource-variable/inter'
import { useOverlayScrollbars } from 'overlayscrollbars-react'
import 'overlayscrollbars/overlayscrollbars.css'
import { useEffect, useMemo, useState } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSessionStore } from '../src/store/session'
import ListOfLinks from './components/ListOfLinks'
import NotFound from './components/Pages/404'
import InternalError from './components/Pages/500'
import AppLayout from './components/Pages/AppLayout'
import ArticleRenderer from './components/Pages/article'
import CookiesPolicy from './components/Pages/CookiesPolicyPage'
import HomePage from './components/Pages/HomePage'
import FeaturesPage from './components/Pages/FeaturesPage'
import LegalAdvisePage from './components/Pages/LegalAdvisePage'
import Login from './components/Pages/LoginPage'
import PricingPage from './components/Pages/PricingPage'
import PrivacyPolicyPage from './components/Pages/PrivacyPolicyPage'
import ProfilePage from './components/Pages/ProfilePage'
import ReadingList from './components/Pages/ReadingList'
import RecoveryPassword from './components/Pages/RecoveryPassword'
import SingleColumnPage from './components/Pages/SingleColumnPage'
import SubscriptionSuccessPage from './components/Pages/SubscriptionSuccessPage'
import TermsAndConditions from './components/Pages/TermsAndConditionsPage'
import { ProtectedRoute } from './components/Routes/ProtectedRoute'
import { PublicOnlyRoute } from './components/Routes/PublicOnlyRoute'
import { constants } from './services/constants'
import { keepServerAwake } from './services/functions'
import { useGlobalStore } from './store/global'

function App () {
  const fetchCsrfToken = useSessionStore(state => state.fetchCsrfToken)
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH
  const globalArticles = useGlobalStore(state => state.globalArticles)
  const [article, setArticle] = useState()

  useEffect(() => {
    setArticle(globalArticles)
  }, [globalArticles])
  // const setGlobalArticles = useGlobalStore(state => state.setGlobalArticles)

  // 🔧 Mover keepServerAwake a useEffect para mejor control
  useEffect(() => {
    const intervalId = keepServerAwake(`${constants.BASE_API_URL}/health`, 10)
    return () => clearInterval(intervalId) // Limpieza al desmontar
  }, [])

  // 🔧 Obtener token CSRF al iniciar
  useEffect(() => {
    fetchCsrfToken()
  }, []) // Sin dependencias para que solo se ejecute al montar

  // 🔧 Memoizar el router para evitar recreaciones innecesarias
  const router = useMemo(() => createBrowserRouter([
    // Página principal
    {
      path: rootPath,
      element: <HomePage />,
      errorElement: <InternalError />
    },
    {
      path: `${rootPath}features`,
      element: <FeaturesPage />,
      errorElement: <InternalError />
    },

    // Página de precios (pública)
    {
      path: `${rootPath}pricing`,
      element: <PricingPage />,
      errorElement: <InternalError />
    },
    {
      path: `${rootPath}aviso-legal`,
      element: <LegalAdvisePage />,
      errorElement: <InternalError />
    },
    {
      path: `${rootPath}privacidad`,
      element: <PrivacyPolicyPage />,
      errorElement: <InternalError />
    },
    {
      path: `${rootPath}terminos-y-condiciones`,
      element: <TermsAndConditions />,
      errorElement: <InternalError />
    },
    {
      path: `${rootPath}politica-de-cookies`,
      element: <CookiesPolicy />,
      errorElement: <InternalError />
    },

    // Rutas de la aplicación (protegidas)
    {
      path: `${rootPath}${basePath}`,
      element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
      errorElement: <InternalError />,
      children: [
        {
          path: `${rootPath}${basePath}/:desktopName`,
          element: <ListOfLinks />,
          errorElement: <InternalError />
        },
        {
          path: `${rootPath}${basePath}/:desktopName/:slug`,
          element: <ListOfLinks />,
          errorElement: <InternalError />
        },
        {
          path: `${rootPath}${basePath}/:desktopName/:slug/:id`,
          element: <SingleColumnPage />,
          errorElement: <InternalError />
        },
        // 🔧 Corregir rutas de columna
        {
          path: `${rootPath}${basePath}/column/:desktopName/:columnId`,
          element: <SingleColumnPage />,
          errorElement: <InternalError />
        },
        {
          path: `${rootPath}${basePath}/article/:id`,
          element: <ArticleRenderer article={article} />,
          errorElement: <InternalError />
        }
      ]
    },

    // Página de perfil (protegida)
    {
      path: `${rootPath}${basePath}/profile`,
      element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
      errorElement: <InternalError />,
      children: [
        {
          path: `${rootPath}${basePath}/profile`,
          element: <ProfilePage />,
          errorElement: <InternalError />
        }
      ]
    },

    // Lista de lectura (protegida)
    {
      path: `${rootPath}${basePath}/readinglist`,
      element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
      errorElement: <InternalError />,
      children: [
        {
          path: `${rootPath}${basePath}/readinglist`,
          element: <ReadingList />,
          errorElement: <InternalError />
        }
      ]
    },

    // Suscripción (protegida)
    {
      path: `${rootPath}${basePath}/subscription`,
      element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
      errorElement: <InternalError />,
      children: [
        {
          path: `${rootPath}${basePath}/subscription/success`,
          element: <SubscriptionSuccessPage />,
          errorElement: <InternalError />
        }
      ]
    },

    // Rutas públicas (solo para usuarios no autenticados)
    {
      path: `${rootPath}login`,
      element: <PublicOnlyRoute><Login /></PublicOnlyRoute>,
      errorElement: <InternalError />
    },
    {
      path: `${rootPath}recovery-password`,
      element: <PublicOnlyRoute><RecoveryPassword /></PublicOnlyRoute>,
      errorElement: <InternalError />
    },

    // 404
    {
      path: '*',
      element: <NotFound />
    }
  ]), [rootPath, basePath])

  // 🔧 OverlayScrollbars
  const [initBodyOverlayScrollbars] = useOverlayScrollbars({
    defer: true,
    options: {
      scrollbars: {
        theme: 'os-theme-light' // o usar la variable de tema cuando esté disponible
      }
    }
  })

  useEffect(() => {
    initBodyOverlayScrollbars(document.body)
  }, [initBodyOverlayScrollbars])

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // o usar la variable de tema
        transition={Zoom}
      />
    </>
  )
}

export default App
