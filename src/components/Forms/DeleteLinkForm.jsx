import { useRef } from 'react'
// import { useLinksStore } from '../../store/links'
import { useParams } from 'react-router-dom'
import { usePreferencesStore } from '../../store/preferences'
import styles from './DeleteLinkForm.module.css'
import useHideForms from '../../hooks/useHideForms'
import { deleteLink } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { toast } from 'react-toastify'
import { useGlobalStore } from '../../store/global'

export default function DeleteLinkForm ({ deleteFormVisible, setDeleteFormVisible, params }) {
  const { desktopName } = useParams()
  const visibleClassName = deleteFormVisible ? styles.flex : styles.hidden
  const formRef = useRef()
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  useHideForms({ form: formRef.current, setFormVisible: setDeleteFormVisible })
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  // Habrá que hacer un custom hook que devuelva la funcion handleDeleteLinkSubmit
  const handleClick = async (event) => {
    event.preventDefault()
    setDeleteFormVisible(false)
    const newList = [...globalLinks].filter(link => link._id !== params._id)
    setGlobalLinks(newList)
    const body = {
      linkId: params._id,
      idpanel: params.idpanel
    }
    const response = await deleteLink({ body })
    console.log(response)

    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
      // devolver estado anterior
      return
    }

    activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.toSorted((a, b) => (a.orden - b.orden))))
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
