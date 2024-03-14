import { useRef } from 'react'
// import { useLinksStore } from '../../store/links'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useHideForms from '../../hooks/useHideForms'
import { deleteLink } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
import { usePreferencesStore } from '../../store/preferences'
import styles from './AddLinkForm.module.css'

export default function DeleteLinkForm ({ deleteFormVisible, setDeleteFormVisible, params }) {
  const { desktopName } = useParams()
  const visibleClassName = deleteFormVisible ? styles.flex : styles.hidden
  const formRef = useRef()
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  useHideForms({ form: formRef.current, setFormVisible: setDeleteFormVisible })
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  // console.log(params)
  // Habrá que hacer un custom hook que devuelva la funcion handleDeleteLinkSubmit
  const handleClick = async (event) => {
    event.preventDefault()
    setDeleteFormVisible(false)
    if (Array.isArray(params)) {
      const newList = [...globalLinks].filter(link => !params.includes(link._id))
      setGlobalLinks(newList)
      activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.toSorted((a, b) => (a.orden - b.orden))))
    } else {
      const newList = [...globalLinks].filter(link => link._id !== params._id)
      setGlobalLinks(newList)
      activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.toSorted((a, b) => (a.orden - b.orden))))
    }
    const body = {
      linkId: Array.isArray(params) ? params : params._id
    }
    const response = await deleteLink({ body })
    console.log(response)

    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast.error(message)
      // devolver estado anterior
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
