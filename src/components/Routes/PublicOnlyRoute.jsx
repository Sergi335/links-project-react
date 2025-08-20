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
  const firstDesktop = localStorage.getItem('firstDesktop') === null
    ? topLevelCategoriesStore[0]?.slug
    : ''

  return user === null
    ? children
    : <Navigate to={`${rootPath}${basePath}/${firstDesktop}`} replace={true} />
}
