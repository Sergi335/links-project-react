import { useRef } from 'react'
import { toast } from 'react-toastify'
import { deleteImage } from '../../services/dbQueries'

export default function DeleteImageConfirmForm ({ visible, setVisible, imageKey, setImages, images, linkId }) {
  const formRef = useRef()
  const popoverRef = useRef(null)
  const handleDeleteImage = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    popoverRef.current?.hidePopover()
    const response = await deleteImage({ imageKey, linkId })
    if (response.message) {
      const newState = images.filter(image => image.key !== imageKey)
      setImages(newState)
      setVisible(false)
      toast.success('Imagen Borrada Correctamente')
      // primero no encuentra el blob al pegar y borrar rapido -> cambiar la url
    } else {
      toast.error('Error al borrar la imagen')
    }
  }
  return (
    // eslint-disable-next-line react/no-unknown-property
    <div popover="" id='delete-image-form' ref={popoverRef}>
      <form ref={formRef} onSubmit={handleDeleteImage} className='deskForm'>
        <h2>{`Seguro que quieres borrar esta imagen?
        Esta acción no se puede deshacer`}</h2>
        <div className="button_group">
          <button id="confDeletedeskSubmit" type="submit">Si</button>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <button id="noDeletedeskSubmit" type="button" popovertarget="delete-image-form" popovertargetaction="hide">No</button>
        </div>
      </form>
    </div>
  )
}
