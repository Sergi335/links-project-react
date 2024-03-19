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

  const handleAddLinkSubmit = async (event) => {
    event.preventDefault()
    const imgURL = constants.BASE_LINK_IMG_URL(urlRef.current.value)
    const body = {
      idpanel: params._id,
      data: [{
        name: nameRef.current.value,
        URL: urlRef.current.value,
        imgURL,
        escritorio: params.escritorio,
        panel: params.name,
        idpanel: params._id,
        orden: 0 // añadir al final
      }]
    }
    const response = await addLink(body)
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast.error(message)
      return
    }
    const { link } = response
    const newList = [...globalLinks, link]
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
