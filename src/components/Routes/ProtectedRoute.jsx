import { Navigate } from 'react-router-dom'
import { useSessionStore } from '../../store/session'

// 🔧 Componente para rutas protegidas
export const ProtectedRoute = ({ children }) => {
  const user = useSessionStore(state => state.user)
  return user === null ? <Navigate to="/" replace={true} /> : children
}
