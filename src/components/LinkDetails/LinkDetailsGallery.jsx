import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { useEffect, useState } from 'react'
import DeleteImageConfirmForm from '../components/Forms/DeleteImageConfirmForm'
import { useGlobalStore } from '../store/global'
import ImageLoader from './ImageLoader'
import styles from './Pages/LinkDetails.module.css'

export function ResponsiveColumnsMasonry ({ images, linkId, className }) {
  const [deleteConfFormVisible, setDeleteConfFormVisible] = useState(false)
  const [url, setUrl] = useState()
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)

  const handleDeleteImage = (event) => {
    console.log(event.currentTarget.id)
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
  return (
    <div className={styles.imageGalleryContainer} style={{ backgroundImage: data?.images.length ? '' : 'var(--placeholderImg)' }}>
    {data?.images.length
      ? (

        <ResponsiveColumnsMasonry className={styles.imageGallery} images={data?.images} linkId={data?._id} />

        )
      : null}
</div>
  )
}
