import { deleteImage } from '../services/dbQueries'
import { toast } from 'react-toastify'
import styles from './AddLinkForm.module.css'
export default function DeleteImageConfirmForm ({ visible, setVisible, itemType = 'imagen', imageUrl, links, setLinks, linkId }) {
  const visibleClassName = visible ? styles.flex : styles.hidden
  const handleDeleteImage = async () => {
    console.log(imageUrl)
    const response = await deleteImage({ imageUrl, linkId })
    console.log(response)
    if (response.message) {
      const linkIndex = links.findIndex(link => link._id === linkId)
      const newState = [...links]
      console.log(newState[linkIndex].images)
      newState[linkIndex].images.pop()
      setLinks(newState)
      setVisible(false)
      toast('Imagen Borrada Correctamente')
      // primero no encuentra el blob al pegar y borrar rapido -> cambiar la url
    } else {
      toast('Error al borrar la imagen')
    }
  }
  return (
    <div className={`${visibleClassName} deskForm`}>
        <h2>{`Seguro que quieres borrar esta ${itemType}
        Esta acción no se puede deshacer`}</h2>
        <button id="confDeletedeskSubmit" type="submit" onClick={handleDeleteImage}>Si</button>
        <button id="noDeletedeskSubmit" type="submit" onClick={() => { setVisible(false) }}>No</button>
    </div>
  )
}
