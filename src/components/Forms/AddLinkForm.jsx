import { useRef } from 'react'
import { toast } from 'react-toastify'
import { constants } from '../../services/constants'
import { addLink } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
// import { usePreferencesStore } from '../../store/preferences'
// import styles from './AddLinkForm.module.css'

export default function AddLinkForm ({ params }) {
  // const visibleClassName = formVisible ? `${styles.flex}` : `${styles.hidden}`
  // const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const formRef = useRef()
  const nameRef = useRef()
  const urlRef = useRef()
  const typeRef = useRef()
  const popoverRef = useRef(null)
  // useHideForms({ form: formRef.current, setFormVisible })
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)

  const getAddedLinkOrder = () => {
    if (String(params?._id).startsWith('virtual-')) {
      const destinyId = String(params._id).split('virtual-')[1]
      return globalLinks?.filter(link => link.categoryId === destinyId).length ?? 0
    } else {
      return globalLinks?.filter(link => link.categoryId === params?._id).length ?? 0
    }
  }
  const getDestinyId = () => {
    if (String(params?._id).startsWith('virtual-')) {
      return String(params._id).split('virtual-')[1]
    } else {
      return params?._id
    }
  }
  const handleAddLinkSubmit = async (event) => {
    event.preventDefault()
    popoverRef.current?.hidePopover()
    const imgUrl = constants.BASE_LINK_IMG_URL(urlRef.current.value)
    const body = {
      categoryId: getDestinyId(),
      name: nameRef.current.value,
      url: urlRef.current.value,
      imgUrl,
      order: getAddedLinkOrder(),
      type: typeRef.current.value
    }
    const response = await addLink(body)
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast.error(message)
      return
    }
    const { data } = response
    const newList = [...globalLinks, data]
    setGlobalLinks(newList)
    // activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.toSorted((a, b) => (a.orden - b.orden))))
  }
  return (
      // eslint-disable-next-line react/no-unknown-property
      <div popover="" id="add-link-form" ref={popoverRef}>
        <form ref={formRef} onSubmit={handleAddLinkSubmit} className='deskForm'>
          <h2>Añade Link</h2>
          <label htmlFor="linkName">Nombre</label>
          <input ref={nameRef} id="linkName" type="text" name="linkName" maxLength="250" required placeholder='ej. Google'/>
          <label htmlFor="linkURL">URL</label>
          <input ref={urlRef} id="linkURL" type="text" name="linkURL" maxLength="2000" required placeholder='ej. https://www.google.com'/>
          <label htmlFor="linkType">Tipo</label>
          <select ref={typeRef} id="linkType" name="linkType" defaultValue="general">
            <option value="general">General</option>
            <option value="video">Vídeo</option>
            <option value="note">Nota</option>
            <option value="article">Artículo</option>
          </select>
          <div className="button_group">
            <button type="submit">Enviar</button>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <button type="button" popovertarget="add-link-form" popovertargetaction="hide">Cancelar</button>
          </div>
        </form>
      </div>
  )
}
