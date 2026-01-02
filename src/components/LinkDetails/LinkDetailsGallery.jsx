import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { useEffect, useState } from 'react'
import Masonry from 'react-layout-masonry'
import { toast } from 'react-toastify'
import { fetchImage, getLinkImages } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import DeleteImageConfirmForm from '../Forms/DeleteImageConfirmForm'
import ImageLoader from './ImageLoader'
import styles from './LinkDetails.module.css'

export function ResponsiveColumnsMasonry ({ images, setImages, linkId, className }) {
  const [deleteConfFormVisible, setDeleteConfFormVisible] = useState(false)
  const [imageKey, setImageKey] = useState()

  const handleDeleteImage = (event) => {
    setDeleteConfFormVisible(true)
    setImageKey(event.currentTarget.id)
  }

  useEffect(() => {
    let lightbox = new PhotoSwipeLightbox({
      gallery: '#gallery',
      children: 'a',
      pswpModule: () => import('photoswipe')
    })
    lightbox.init()
    return () => {
      lightbox.destroy()
      lightbox = null
    }
  })
  return (
      <>
        <OverlayScrollbarsComponent
          style={{ flexGrow: '1', marginBottom: '8px' }}
          defer
          options={{ scrollbars: { autoHide: true } }}
        >
          <Masonry
            id='gallery'
            columns={{ 640: 1, 768: 2, 1024: 3, 1280: 4 }}
            gap={16}
            className={className}
          >
            {images.map((item) => {
              return <ImageLoader key={item.url} src={item.url} alt={'my picture'} imageKey={item.key} handleDeleteImage={handleDeleteImage}/>
            })}
          </Masonry>
          <DeleteImageConfirmForm visible={deleteConfFormVisible} setVisible={setDeleteConfFormVisible} itemType='imagen' imageKey={imageKey} images={images} setImages={setImages} linkId={linkId} />
        </OverlayScrollbarsComponent>
      </>
  )
}
export default function LinkDetailsGallery ({ data }) {
  const [images, setImages] = useState([])
  const [isDragging, setIsDragging] = useState(false)

  const getImages = async () => {
    const response = await getLinkImages({ linkId: data?._id })
    const { hasError, message } = handleResponseErrors(response)
    if (!hasError) {
      setImages(response.data.map(img => { return { url: img.url, key: img.key } }))
    } else {
      toast.error(message)
    }
  }

  const handlePasteImage = () => {
    const pasteLoading = toast.loading('Subiendo archivo ...')
    navigator.clipboard.read().then(clipboardItems => {
      let foundImage = false
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            foundImage = true
            // es una imagen
            clipboardItem.getType(type).then(async blob => {
              // TODO a constante limitar a 10MB el tamaño de la imagen subida
              if (blob.size > 1e+7) {
                toast.update(pasteLoading, { render: 'Imagen muy grande', type: 'error', isLoading: false, autoClose: 3000 })
                return
              }
              const imageUrl = URL.createObjectURL(blob)
              const response = await fetchImage({ imageUrl, linkId: data._id })

              const { hasError, message } = handleResponseErrors(response)

              if (hasError) {
                toast.update(pasteLoading, { render: message, type: 'error', isLoading: false, autoClose: 3000 })
              } else {
                const newState = [...images]
                newState.push({ url: response.data.signedUrl, key: null })
                setImages(newState)
                toast.update(pasteLoading, { render: 'Imagen Guardada!', type: 'success', isLoading: false, autoClose: 1500 })
              }
            })
          }
        }
      }
      if (!foundImage) {
        toast.update(pasteLoading, { render: 'No hay imagen en el portapapeles', type: 'error', isLoading: false, autoClose: 3000 })
      }
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Solo cambiar el estado si salimos del contenedor principal
    if (e.currentTarget === e.target) {
      setIsDragging(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length === 0) {
      toast.error('No se encontraron imágenes en los archivos soltados')
      return
    }

    for (const file of imageFiles) {
      const uploadLoading = toast.loading(`Subiendo ${file.name}...`)

      // Validar tamaño (10MB máximo)
      if (file.size > 1e+7) {
        toast.update(uploadLoading, {
          render: `${file.name} es muy grande (máx. 10MB)`,
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
        continue
      }

      try {
        const imageUrl = URL.createObjectURL(file)
        const response = await fetchImage({ imageUrl, linkId: data._id })

        const { hasError, message } = handleResponseErrors(response)

        if (hasError) {
          toast.update(uploadLoading, {
            render: message,
            type: 'error',
            isLoading: false,
            autoClose: 3000
          })
        } else {
          setImages(prevImages => [...prevImages, { url: response.data.signedUrl, key: response.data.key || null }])
          toast.update(uploadLoading, {
            render: `${file.name} guardada!`,
            type: 'success',
            isLoading: false,
            autoClose: 1500
          })
        }
      } catch (error) {
        toast.update(uploadLoading, {
          render: `Error al subir ${file.name}`,
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
      }
    }
  }

  useEffect(() => {
    if (!data?._id) return
    getImages()
  }, [data])

  return (
    <>
    <div
      style={{ backgroundImage: images.length <= 0 ? 'var(--placeholderImg)' : 'none' }}
      className={`${styles.imageGalleryContainer} ${isDragging ? styles.dragging : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {
        images.length > 0 && (
            <ResponsiveColumnsMasonry className={styles.imageGallery} images={images} setImages={setImages} linkId={data?._id} />
        )

        }
      </div>
        <button id='pasteImageButton' className={styles.pasteImageButton} onClick={handlePasteImage}>Pegar Imagen</button>
      </>
  )
}
