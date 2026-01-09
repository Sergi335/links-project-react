import { useEffect, useState } from 'react'
import { getSignedUrl } from '../../services/dbQueries'
import { useSessionStore } from '../../store/session'

export default function ProfileImage ({ imageKey, id, className }) {
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

  if (className === 'uploadForm') {
    return (
      <img id={id} src={imageUrl || '/img/avatar.svg'} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
    )
  }
  return (
    // eslint-disable-next-line react/no-unknown-property
    <button popovertarget='user-info-menu' className={className} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
      <img id={id} src={imageUrl || '/img/avatar.svg'} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
    </button>
  )
}
