import { useEffect, useState } from 'react'
import { getSignedUrl } from '../services/dbQueries'

export default function ProfileImage ({ imageKey, id }) {
  const [imageUrl, setImageUrl] = useState(null)

  useEffect(() => {
    if (imageKey) {
      getSignedUrl(imageKey).then(setImageUrl)
    }
  }, [imageKey])

  if (!imageUrl) return <img id={id} src='/img/avatar.svg' alt="Profile" />

  return <img id={id} src={imageUrl} alt="Profile" />
}
