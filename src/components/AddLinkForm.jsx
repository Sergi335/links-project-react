import { useEffect, useRef } from 'react'
import styles from './AddLinkForm.module.css'
import { constants } from '../services/constants'
import { useLinksStore } from '../store/links'

export default function AddLinkForm ({ formVisible, setFormVisible, params, desktopName }) {
  const setLinksStore = useLinksStore(state => state.setLinksStore)
  const linksStore = useLinksStore(state => state.linksStore)
  const visibleClassName = formVisible ? styles.flex : styles.hidden
  const formRef = useRef()
  const nameRef = useRef()
  const urlRef = useRef()
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target !== formRef.current && event.target.nodeName !== 'P' && !formRef.current.contains(event.target)) {
        setFormVisible(false)
      }
    }
    window.addEventListener('click', handleClickOutside)
    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])
  const handleSubmit = (event) => {
    event.preventDefault()
    const imgURL = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${urlRef.current.value}&size=64`
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
    fetch(`${constants.BASE_API_URL}/links`, {
      method: 'POST',
      headers: {
        'Content-type': 'Application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        const newList = [...linksStore, data]
        setFormVisible(false)
        setLinksStore(newList)
        localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.toSorted((a, b) => (a.orden - b.orden))))
      })
      .catch(err => {
        console.log(err)
      })
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
