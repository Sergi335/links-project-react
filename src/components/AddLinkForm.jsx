import { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { constants } from '../services/constants'
import { useLinksStore } from '../store/links'
import { usePreferencesStore } from '../store/preferences'
import { addLink } from '../services/dbQueries'

export default function AddLinkForm ({ setFormVisible, params, desktopName }) {
  const setLinksStore = useLinksStore(state => state.setLinksStore)
  const linksStore = useLinksStore(state => state.linksStore)
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const formRef = useRef()
  const nameRef = useRef()
  const urlRef = useRef()

  // Hook global
  useEffect(() => {
    const hideFormOnClickOutside = (event) => {
      if (event.target !== formRef.current && event.target.nodeName !== 'SPAN' && !formRef.current.contains(event.target)) {
        setFormVisible(false)
      }
    }
    window.addEventListener('click', hideFormOnClickOutside)
    return () => {
      window.removeEventListener('click', hideFormOnClickOutside)
    }
  }, [])

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
        orden: 0
      }]
    }
    const response = await addLink(body)
    // Error de red
    if (!response._id && !response.ok && response.error === undefined) {
      toast('Error de red')
      return
    }
    // Error http
    if (!response._id && !response.ok && response.status !== undefined) {
      toast(`${response.status}: ${response.statusText}`)
      return
    }
    // Error personalizado
    if (!response._id && response.error) {
      toast(`Error: ${response.error}`)
      return
    }
    const newList = [...linksStore, response]
    setFormVisible(false)
    setLinksStore(newList)
    activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.toSorted((a, b) => (a.orden - b.orden))))
  }
  return (
      <form ref={formRef} className='deskForm' onSubmit={handleAddLinkSubmit}>
        <h2>Añade Link</h2>
        <label htmlFor="linkName">Nombre</label>
        <input ref={nameRef} id="linkName" type="text" name="linkName" maxLength="35" required/>
        <label htmlFor="linkURL">URL</label>
        <input ref={urlRef} id="linkURL" type="text" name="linkURL" required/>
        <button type="submit">Enviar</button>
      </form>
  )
}
