import { useRef, useEffect } from 'react'
import { useLinksStore } from '../store/links'
import { useParams } from 'react-router-dom'
import styles from './EditLinkForm.module.css'
import { usePreferencesStore } from '../store/preferences'

export default function EditLinkForm ({ formVisible, setFormVisible, params }) {
  const visibleClassName = formVisible ? styles.flex : styles.hidden
  const setLinksStore = useLinksStore(state => state.setLinksStore)
  const linksStore = useLinksStore(state => state.linksStore)
  const formRef = useRef()
  const { desktopName } = useParams()
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target !== formRef.current && event.target.nodeName !== 'SPAN' && !formRef.current.contains(event.target)) {
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
    const { elements } = event.currentTarget
    const name = elements.namedItem('editlinkName')
    const URL = elements.namedItem('editlinkURL')
    const description = elements.namedItem('editlinkDescription')
    const body = {
      id: params._id,
      fields: {
        name: name.value,
        URL: URL.value,
        description: description.value
      }
    }
    fetch('http://localhost:3003/api/links', {
      method: 'PATCH',
      headers: {
        'Content-type': 'Application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        setFormVisible(false)
        const updatedState = [...linksStore]
        const elementIndex = updatedState.findIndex(element => element._id === params._id)
        if (elementIndex !== -1) {
          const objeto = updatedState[elementIndex]
          updatedState[elementIndex] = { ...objeto, ...data }
        }
        setLinksStore(updatedState)
        activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(updatedState.toSorted((a, b) => (a.orden - b.orden))))
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
      <form ref={formRef} onSubmit={handleSubmit} className={`deskForm ${visibleClassName}`} id="editLinkForm">
        <h2>Edita Link</h2>
        <fieldset>
          <legend>Nombre y URL</legend>
          <label htmlFor="editLinkName">Nombre</label>
          <input id="editlinkName" type="text" name="editlinkName" maxLength="35" required="" defaultValue={params.name || ''} />
          <label htmlFor="editLinkURL">URL</label>
          <input id="editlinkURL" type="text" name="editlinkURL" defaultValue={params.URL || ''}/>
          <label htmlFor="editLinkDescription">Description</label>
          <input id="editlinkDescription" type="text" name="editlinkDescription" defaultValue={params.description || ''}/>
          <button id="editlinkSubmit" type="submit">Modificar</button>
          <p id="editLinkError"></p>
        </fieldset>
      </form>
  )
}
