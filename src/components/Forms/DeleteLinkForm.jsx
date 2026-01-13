import { useRef, useState } from 'react'
// import { useLinksStore } from '../../store/links'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { deleteLink } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
import { usePreferencesStore } from '../../store/preferences'
// import styles from './AddLinkForm.module.css'
// TODO hay que navegar al siguiente link o al anterior si es el último en un contexto de singlecol.
export default function DeleteLinkForm ({ deleteFormVisible, setDeleteFormVisible, params }) {
  const navigate = useNavigate()
  const { desktopName, id } = useParams()
  const [isDeleting, setIsDeleting] = useState(false)
  const formRef = useRef()
  const popoverRef = useRef(null)
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const globalColumns = useGlobalStore(state => state.globalColumns)

  // //console.log(params)
  // Habrá que hacer un custom hook que devuelva la funcion handleDeleteLinkSubmit
  const handleClick = async (event) => {
    event.preventDefault()
    if (isDeleting) return
    setIsDeleting(true)
    popoverRef.current?.hidePopover()

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
        if (nextLink && id) {
          autoNavigationUrl = `/app/${desktopName}/${slug}/${nextLink._id}`
        } else if (prevLink && id) {
          autoNavigationUrl = `/app/${desktopName}/${slug}/${prevLink._id}`
        }
      }
    }

    setDeleteFormVisible(false)

    // Actualización optimista del estado global
    const idsToDelete = Array.isArray(params) ? params : [params._id]

    // Identificar categorías afectadas antes de filtrar
    const affectedCategories = [...new Set(globalLinks
      .filter(link => idsToDelete.includes(link._id))
      .map(link => link.categoryId)
    )]

    const remainingLinks = globalLinks.filter(link => !idsToDelete.includes(link._id))

    // Re-ordenar secuencialmente los links en las categorías afectadas
    const orderMap = {}
    affectedCategories.forEach(catId => {
      remainingLinks
        .filter(l => l.categoryId === catId)
        .sort((a, b) => a.order - b.order)
        .forEach((l, index) => {
          orderMap[l._id] = index
        })
    })

    const newList = remainingLinks.map(link => ({
      ...link,
      order: orderMap[link._id] !== undefined ? orderMap[link._id] : link.order
    }))

    setGlobalLinks(newList)
    activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.toSorted((a, b) => (a.order - b.order))))

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
      // eslint-disable-next-line react/no-unknown-property
      <div popover="" id='delete-link-form' ref={popoverRef}>
        <form ref={formRef} onSubmit={handleClick}>
          <h2>Seguro que quieres borrar <small>{params?.name}</small>?</h2>
          <div className="button_group">
            <button type='submit'>Si</button>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <button type='button' popovertarget="delete-link-form" popovertargetaction="hide">No</button>
          </div>
        </form>
      </div>
  )
}
