import { useRef, useState } from 'react'
// import { useLinksStore } from '../../store/links'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useHideForms from '../../hooks/useHideForms'
import { deleteLink } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
import { usePreferencesStore } from '../../store/preferences'
import styles from './AddLinkForm.module.css'
// TODO hay que navegar al siguiente link o al anterior si es el último en un contexto de singlecol.
export default function DeleteLinkForm ({ deleteFormVisible, setDeleteFormVisible, params }) {
  const navigate = useNavigate()
  const { desktopName } = useParams()
  const [isDeleting, setIsDeleting] = useState(false)
  const visibleClassName = deleteFormVisible ? styles.flex : styles.hidden
  const formRef = useRef()
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  useHideForms({ form: formRef.current, setFormVisible: setDeleteFormVisible })
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const globalColumns = useGlobalStore(state => state.globalColumns)

  // //console.log(params)
  // Habrá que hacer un custom hook que devuelva la funcion handleDeleteLinkSubmit
  const handleClick = async (event) => {
    event.preventDefault()
    if (isDeleting) return
    setIsDeleting(true)

    let autoNavigationUrl = null

    // Si es un solo link, calculamos a dónde navegar antes de borrarlo
    if (!Array.isArray(params) && params?.categoryId) {
      const columnLinks = globalLinks
        .filter(link => link.categoryId === params.categoryId)
        .sort((a, b) => a.order - b.order)

      const currentIndex = columnLinks.findIndex(link => link._id === params._id)
      const nextLink = columnLinks[currentIndex + 1]
      const prevLink = columnLinks[currentIndex - 1]

      const slug = globalColumns.find(column => column._id === params.categoryId)?.slug
      if (slug) {
        if (nextLink) {
          autoNavigationUrl = `/app/${desktopName}/${slug}/${nextLink._id}`
        } else if (prevLink) {
          autoNavigationUrl = `/app/${desktopName}/${slug}/${prevLink._id}`
        }
      }
    }

    setDeleteFormVisible(false)

    // Actualización optimista del estado global
    const idsToDelete = Array.isArray(params) ? params : [params._id]
    const newList = globalLinks.filter(link => !idsToDelete.includes(link._id))
    setGlobalLinks(newList)
    activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.sort((a, b) => (a.order - b.order))))

    const body = {
      linkId: Array.isArray(params) ? params : params._id
    }

    const response = await deleteLink({ body })

    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast.error(message)
      // TODO: Revertir estado global en caso de error
      setIsDeleting(false)
    } else {
      if (autoNavigationUrl) {
        navigate(autoNavigationUrl, { replace: true })
      }
      setIsDeleting(false)
    }
  }
  return (
      <form ref={formRef} onSubmit={handleClick} className={`deskForm ${visibleClassName}`}>
        <h2>Seguro que quieres borrar <small>{params?.name}</small>?</h2>
        <div className="button_group">
          <button type='submit'>Si</button>
          <button type='button' onClick={() => setDeleteFormVisible(false)}>No</button>
        </div>
      </form>
  )
}
