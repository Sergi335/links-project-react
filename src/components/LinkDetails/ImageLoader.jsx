import { useEffect, useRef, useState } from 'react'
import { CloseIcon } from '../Icons/icons'

export default function ImageLoader ({ src, alt, handleDeleteImage, imageKey }) {
  const [loading, setLoading] = useState(true)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const imgRef = useRef(null)

  const handleImageLoad = (event) => {
    setWidth(event.target.naturalWidth)
    setHeight(event.target.naturalHeight)
    setTimeout(() => {
      setLoading(false)
    }, 200)
  }

  useEffect(() => {
    // Si el ref a la imagen existe
    if (imgRef.current) {
      // Y la imagen ya está cargada (desde caché)
      if (imgRef.current.complete) {
        // Llama manualmente a la función de carga
        handleImageLoad({ target: imgRef.current })
      }
    }
  }, [src]) // Se ejecuta cada vez que cambia el src

  return (
    <div style={{ position: 'relative' }}>
      {/* {loading && <ImagesLoader />} */}
      <a
        href={src}
        data-pswp-width={width}
        data-pswp-height={height}
        target='_blank'
        rel="noreferrer"
        style={{
          position: 'relative',
          display: 'block',
          // Ocultar el enlace hasta que la imagen cargue para evitar un "salto"
          visibility: loading ? 'hidden' : 'visible'
        }}
      >
        <img
          ref={imgRef} // Añade una referencia al elemento img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          onError={() => setLoading(false)} // Buena práctica: manejar errores
          style={{
            // Ocultar la imagen con opacidad mientras carga
            opacity: loading ? 0 : 1,
            transition: 'opacity .3s ease-in-out',
            width: '100%',
            height: 'auto'
          }}
        />
      </a>
        {!loading && (
          // eslint-disable-next-line react/no-unknown-property
          <button id={imageKey} onClick={handleDeleteImage} popovertarget="delete-image-form" popovertargetaction="show"><CloseIcon/></button>
        )}
    </div>
  )
}
