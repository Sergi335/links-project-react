import { deleteImage } from '../../services/dbQueries'
import { toast } from 'react-toastify'
import styles from './AddLinkForm.module.css'
import useHideForms from '../../hooks/useHideForms'
import { useRef } from 'react'

export default function DeleteImageConfirmForm ({ visible, setVisible, itemType = 'imagen', imageUrl, links, setLinks, linkId }) {
  const visibleClassName = visible ? styles.flex : styles.hidden
  const formRef = useRef()
  useHideForms({ form: formRef.current, setFormVisible: setVisible })
  const handleDeleteImage = async (event) => {
    event.preventDefault()
    const response = await deleteImage({ imageUrl, linkId })
    if (response.message) {
      const linkIndex = links.findIndex(link => link._id === linkId)
      const newState = [...links]
      const imageIndex = newState[linkIndex].images.findIndex(image => image === imageUrl)
      newState[linkIndex].images.splice(imageIndex, 1)
      setLinks(newState)
      setVisible(false)
      toast('Imagen Borrada Correctamente')
      // primero no encuentra el blob al pegar y borrar rapido -> cambiar la url
    } else {
      toast('Error al borrar la imagen')
    }
  }
  return (
    <form ref={formRef} onSubmit={handleDeleteImage} className={`${visibleClassName} deskForm`}>
        <h2>{`Seguro que quieres borrar esta ${itemType}
        Esta acción no se puede deshacer`}</h2>
        <div className="button_group">
          <button id="confDeletedeskSubmit" type="submit">Si</button>
          <button id="noDeletedeskSubmit" type="button" onClick={() => { setVisible(false) }}>No</button>
        </div>
    </form>
  )
}
