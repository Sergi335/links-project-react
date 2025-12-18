import { useRef } from 'react'
import { toast } from 'react-toastify'
import useHideForms from '../../hooks/useHideForms'
import { constants } from '../../services/constants'
import { addLink } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
import { usePreferencesStore } from '../../store/preferences'
import styles from './AddLinkForm.module.css'

export default function AddLinkForm ({ setFormVisible, params, desktopName, formVisible }) {
  const visibleClassName = formVisible ? `${styles.flex}` : `${styles.hidden}`
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const formRef = useRef()
  const nameRef = useRef()
  const urlRef = useRef()
  useHideForms({ form: formRef.current, setFormVisible })
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const addedLinkOrder = globalLinks?.filter(link => link.categoryId === params?._id).length ?? 0

  const handleAddLinkSubmit = async (event) => {
    event.preventDefault()
    const imgUrl = constants.BASE_LINK_IMG_URL(urlRef.current.value)
    const body = {
      categoryId: params._id,
      name: nameRef.current.value,
      url: urlRef.current.value,
      imgUrl,
      order: addedLinkOrder // añadir al final

    }
    const response = await addLink(body)
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast.error(message)
      return
    }
    const { data } = response
    const newList = [...globalLinks, data]
    setFormVisible(false)
    setGlobalLinks(newList)
    activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.toSorted((a, b) => (a.orden - b.orden))))
  }
  return (
      <form ref={formRef} className={`deskForm ${visibleClassName}`} onSubmit={handleAddLinkSubmit}>
        <h2>Añade Link</h2>
        <label htmlFor="linkName">Nombre</label>
        <input ref={nameRef} id="linkName" type="text" name="linkName" maxLength="250" required/>
        <label htmlFor="linkURL">URL</label>
        <input ref={urlRef} id="linkURL" type="text" name="linkURL" maxLength="2000"/>
        <div className="button_group">
          <button type="submit">Enviar</button>
          <button type="button" onClick={() => setFormVisible(false)}>Cancelar</button>
        </div>
      </form>
  )
}
