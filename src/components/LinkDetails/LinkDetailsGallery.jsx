import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { fetchImage } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
import DeleteImageConfirmForm from '../Forms/DeleteImageConfirmForm'
import ImageLoader from './ImageLoader'
import styles from './LinkDetails.module.css'

export function ResponsiveColumnsMasonry ({ images, linkId, className }) {
  const [deleteConfFormVisible, setDeleteConfFormVisible] = useState(false)
  const [url, setUrl] = useState()
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)

  const handleDeleteImage = (event) => {
    // console.log(event.currentTarget.id)
    const element = document.getElementById(event.currentTarget.id).parentNode.childNodes[0]
    // LLamar a confirmación mostrar estado glob
    setDeleteConfFormVisible(true)
    // establecer el id global para acceder desde formscontainer
    setUrl(element.src)
    // actualizar estado
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
        <OverlayScrollbarsComponent style={{ flexGrow: '1', marginBottom: '8px' }} defer>
          <div
            id='gallery'
            style={{ flexGrow: '1', columnCount: '4', columnGap: '5px', padding: '5px' }}
            className={className}
          >
            {images.map((item) => {
              return <ImageLoader key={item} src={item} alt={'my picture'} handleDeleteImage={handleDeleteImage}/>
            })}
          </div>
          <DeleteImageConfirmForm visible={deleteConfFormVisible} setVisible={setDeleteConfFormVisible} itemType='imagen' imageUrl={url}links={globalLinks} setLinks={setGlobalLinks} linkId={linkId} />
        </OverlayScrollbarsComponent>
      </>
  )
}
export default function LinkDetailsGallery ({ data }) {
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
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
              const elementIndex = globalLinks.findIndex(link => link._id === data._id)
              const newState = [...globalLinks]
              const response = await fetchImage({ imageUrl, linkId: data._id })

              const { hasError, message } = handleResponseErrors(response)

              if (hasError) {
                // console.log(message)
                toast.update(pasteLoading, { render: message, type: 'error', isLoading: false, autoClose: 3000 })
              } else {
                newState[elementIndex].images.push(response.data.images[response.data.images.length - 1])
                setGlobalLinks(newState)
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
  // console.log('🚀 ~ LinkDetailsGallery ~ data:', data?.images.length)
  return (
    <>
    <div style={{ backgroundImage: data?.images.length <= 0 ? 'url(\'/img/placeholderImg.png\')' : 'none' }} className={styles.imageGalleryContainer}>
      {
        data?.images.length > 0 && (
            <ResponsiveColumnsMasonry className={styles.imageGallery} images={data?.images} linkId={data?._id} />
        )

        }
      </div>
        <button id='pasteImageButton' className={styles.pasteImageButton} onClick={handlePasteImage}>Pegar Imagen</button>
      </>
  )
}
