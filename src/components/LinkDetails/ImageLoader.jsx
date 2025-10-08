import { useEffect, useRef, useState } from 'react'
import { CloseIcon } from '../Icons/icons'
import ImagesLoader from '../Loaders/ImagesLoader'
export default function ImageLoader ({ src, alt, handleDeleteImage, imageKey }) {
  const [loading, setLoading] = useState(true)
  const [width, setWidth] = useState()
  const [height, setHeight] = useState()
  const isMountingRef = useRef(false)
  const handleImageLoad = () => {
    const img = new Image()
    img.src = src
    setWidth(img.naturalWidth)
    setHeight(img.naturalHeight)
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
      <a
        href={src}
        data-pswp-width={width}
        data-pswp-height={height}
        target='_blank' rel="noreferrer"
        style={{ position: 'relative', display: 'block' }}
      >
      <img
        src={src}
        data-pswp-width={width}
        data-pswp-height={height}
        alt={alt}
        style={{ width: '100%', height: '', opacity: !loading ? 1 : 0, transition: 'opacity .5s', objectFit: 'contain' }}
        onLoad={handleImageLoad}
      />
      <span id={imageKey} onClick={handleDeleteImage}><CloseIcon/></span>
      </a>
    </>
  )
}
