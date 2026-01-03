import { useEffect, useState } from 'react'
import { getSignedUrl } from '../services/dbQueries'
import { useSessionStore } from '../store/session'

export default function ProfileImage ({ imageKey, id, className, onClick }) {
  const [imageUrl, setImageUrl] = useState(null)
  const csrfToken = useSessionStore(state => state.csfrtoken)
  const isTokenReady = useSessionStore(state => state.isTokenReady)
  const user = useSessionStore(state => state.user)
  // console.log('avatar user:', user)

  // Esperar a que el token esté sincronizado antes de pedir la URL
  useEffect(() => {
    if (isTokenReady && csrfToken && imageKey) {
      getSignedUrl(imageKey).then(setImageUrl)
    }
  }, [isTokenReady, csrfToken, imageKey, user])

  if (!imageUrl) return <img id={id} src='/img/avatar.svg' alt="Profile" className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }} />

  return <img id={id} src={imageUrl} alt="Profile" className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }} />
}
