import { useEffect, useState } from 'react'
import { getSignedUrl } from '../services/dbQueries'
import { useSessionStore } from '../store/session'

export default function ProfileImage ({ imageKey, id }) {
  const [imageUrl, setImageUrl] = useState(null)
  const csrfToken = useSessionStore(state => state.csfrtoken)
  const isTokenReady = useSessionStore(state => state.isTokenReady)

  // Esperar a que el token esté sincronizado antes de pedir la URL
  useEffect(() => {
    if (isTokenReady && csrfToken && imageKey) {
      getSignedUrl(imageKey).then(setImageUrl)
    }
  }, [isTokenReady, csrfToken, imageKey])

  if (!imageUrl) return <img id={id} src='/img/avatar.svg' alt="Profile" />

  return <img id={id} src={imageUrl} alt="Profile" />
}
