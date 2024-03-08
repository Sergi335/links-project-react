import { useEffect, useRef, useState } from 'react'
import ImagesLoader from './Loaders/ImagesLoader'
export default function ImageLoader ({ src, alt, imageRef, handleShowImageModal }) {
  const [loading, setLoading] = useState(true)
  const isMountingRef = useRef(false)
  const handleImageLoad = () => {
    setLoading(false)
  }

  useEffect(() => {
    isMountingRef.current = true
  }, [])
  useEffect(() => {
    if (!isMountingRef.current) {
      setLoading(true)
      isMountingRef.current = false
    }
  }, [src])
  return (
    <>
      {loading && <ImagesLoader/>}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={{ width: '100%', height: '', opacity: !loading ? 1 : 0, transition: 'opacity .5s', objectFit: 'contain' }}
        onLoad={handleImageLoad}
        onClick={handleShowImageModal}
      />
    </>
  )
}
