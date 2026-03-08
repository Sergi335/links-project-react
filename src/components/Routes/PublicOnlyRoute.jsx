import { Navigate } from 'react-router-dom'
import { useSessionStore } from '../../store/session'
import { useTopLevelCategoriesStore } from '../../store/useTopLevelCategoriesStore'

// 🔧 Componente para rutas públicas (solo para usuarios no autenticados)
export const PublicOnlyRoute = ({ children }) => {
  const user = useSessionStore(state => state.user)
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH
  const topLevelCategoriesStore = useTopLevelCategoriesStore(state => state.topLevelCategoriesStore)
  // //console.log('🚀 ~ PublicOnlyRoute ~ topLevelCategoriesStore:', topLevelCategoriesStore)
  const savedFirstDesktop = localStorage.getItem('firstDesktop')
  let firstDesktopFromStorage = ''

  if (savedFirstDesktop) {
    try {
      firstDesktopFromStorage = JSON.parse(savedFirstDesktop) || ''
    } catch {
      firstDesktopFromStorage = savedFirstDesktop
    }
  }

  const firstDesktop = firstDesktopFromStorage || topLevelCategoriesStore[0]?.slug || ''
  const targetPath = firstDesktop
    ? `${rootPath}${basePath}/${firstDesktop}`
    : `${rootPath}${basePath}`

  return user === null
    ? children
    : <Navigate to={targetPath} replace={true} />
}
