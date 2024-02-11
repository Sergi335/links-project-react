import { useState, useEffect } from 'react'
import ImagesLoader from './Loaders/ImagesLoader'
export default function ImageLoader ({ src, alt, ref, handleShowImageModal }) {
  const [loaded, setLoaded] = useState(false)

  const handleImageLoad = () => {
    setLoaded(true)
  }

  useEffect(() => {
    setLoaded(false) // Resetea el estado cuando cambia la URL de la imagen
  }, [src])
  return (
    <>
      {!loaded && <ImagesLoader/>}
      <img
        ref={ref}
        src={src}
        alt={alt}
        style={{ width: '100%', height: '', opacity: loaded ? 1 : 0, transition: 'opacity .5s', objectFit: 'contain' }}
        onLoad={handleImageLoad}
        onClick={handleShowImageModal}
      />
    </>
  )
}
