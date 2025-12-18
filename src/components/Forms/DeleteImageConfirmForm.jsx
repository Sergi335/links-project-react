import { useRef } from 'react'
import { toast } from 'react-toastify'
import useHideForms from '../../hooks/useHideForms'
import { deleteImage } from '../../services/dbQueries'
import styles from './AddLinkForm.module.css'

export default function DeleteImageConfirmForm ({ visible, setVisible, imageKey, setImages, images, linkId }) {
  const visibleClassName = visible ? styles.flex : styles.hidden
  const formRef = useRef()
  useHideForms({ form: formRef.current, setFormVisible: setVisible })
  const handleDeleteImage = async (event) => {
    event.preventDefault()
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
    <form ref={formRef} onSubmit={handleDeleteImage} className={`${visibleClassName} deskForm`}>
        <h2>{`Seguro que quieres borrar esta imagen?
        Esta acción no se puede deshacer`}</h2>
        <div className="button_group">
          <button id="confDeletedeskSubmit" type="submit">Si</button>
          <button id="noDeletedeskSubmit" type="button" onClick={() => { setVisible(false) }}>No</button>
        </div>
    </form>
  )
}
