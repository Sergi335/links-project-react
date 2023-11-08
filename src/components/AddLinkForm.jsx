import { useEffect, useRef } from 'react'
import styles from './AddLinkForm.module.css'
import { constants } from '../services/constants'
import { useLinksStore } from '../store/links'
import { usePreferencesStore } from '../store/preferences'
import { addLink } from '../services/dbQueries'

export default function AddLinkForm ({ formVisible, setFormVisible, params, desktopName }) {
  const setLinksStore = useLinksStore(state => state.setLinksStore)
  const linksStore = useLinksStore(state => state.linksStore)
  const visibleClassName = formVisible ? styles.flex : styles.hidden
  const formRef = useRef()
  const nameRef = useRef()
  const urlRef = useRef()
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)

  useEffect(() => {
    const hideFormOnClickOutside = (event) => {
      if (event.target !== formRef.current && event.target.nodeName !== 'P' && !formRef.current.contains(event.target)) {
        setFormVisible(false)
      }
    }
    window.addEventListener('click', hideFormOnClickOutside)
    return () => {
      window.removeEventListener('click', hideFormOnClickOutside)
    }
  }, [])

  const handleSubmit = async (event) => {
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
    const data = await addLink(body) // que pasa si data es lo que no es
    const newList = [...linksStore, data]
    setFormVisible(false)
    setLinksStore(newList)
    activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.toSorted((a, b) => (a.orden - b.orden))))
  }
  return (
      <form ref={formRef} className={`deskForm ${visibleClassName}`} onSubmit={handleSubmit}>
        <h2>Añade Link</h2>
        <label htmlFor="linkName">Nombre</label>
        <input ref={nameRef} id="linkName" type="text" name="linkName" maxLength="35" required/>
        <label htmlFor="linkURL">URL</label>
        <input ref={urlRef} id="linkURL" type="text" name="linkURL" required/>
        <button type="submit">Enviar</button>
      </form>
  )
}
