import { useRef } from 'react'
// import { useLinksStore } from '../../store/links'
import { useParams } from 'react-router-dom'
// import styles from './EditLinkForm.module.css'
import { usePreferencesStore } from '../../store/preferences'
import useHideForms from '../../hooks/useHideForms'
import { useFormsStore } from '../../store/forms'
import { editLink } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { toast } from 'react-toastify'
import { useGlobalStore } from '../../store/global'

export default function EditLinkForm ({ formVisible, setFormVisible }) {
  const visibleClassName = formVisible ? 'flex' : 'hidden'
  // const setLinksStore = useLinksStore(state => state.setLinksStore)
  // const linksStore = useLinksStore(state => state.linksStore)
  const formRef = useRef()
  const { desktopName } = useParams()
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  // Link sobre el que se hace click contextual se setea en customlink, podriamos pasarselo desde el custom hook y limpiar mas el componente?
  const activeLink = useFormsStore(state => state.activeLink)
  useHideForms({ form: formRef.current, setFormVisible })
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  // Habrá que hacer un custom hook que devuelva la funcion handleEditLinkSubmit
  const handleSubmit = async (event) => {
    event.preventDefault()
    const { elements } = event.currentTarget
    const name = elements.namedItem('editlinkName').value
    const URL = elements.namedItem('editlinkURL').value
    const description = elements.namedItem('editlinkDescription').value
    const id = activeLink._id
    const response = await editLink({ id, name, URL, description })

    const { hasError, message } = handleResponseErrors(response)
    let error
    if (response.message !== undefined) {
      error = response.message.join('\n')
    } else {
      error = message
    }
    if (hasError) {
      toast(error)
      return
    }
    setFormVisible(false)
    const updatedState = [...globalLinks]
    const elementIndex = updatedState.findIndex(element => element._id === activeLink._id)
    if (elementIndex !== -1) {
      const objeto = updatedState[elementIndex]
      const { link } = response
      updatedState[elementIndex] = { ...objeto, ...link }
    }
    setGlobalLinks(updatedState)
    activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(updatedState.toSorted((a, b) => (a.orden - b.orden))))
  }

  return (
      <form ref={formRef} onSubmit={handleSubmit} className={`deskForm ${visibleClassName}`}>
        <h2>Edita Link</h2>
        <fieldset>
          <legend>Nombre, URL y Descripción</legend>
          <label htmlFor="editLinkName">Nombre</label>
          <input id="editlinkName" type="text" name="editlinkName" maxLength="35" required="" defaultValue={activeLink?.name || ''} />
          <label htmlFor="editLinkURL">URL</label>
          <input id="editlinkURL" type="text" name="editlinkURL" defaultValue={activeLink?.URL || ''}/>
          <label htmlFor="editLinkDescription">Descripción</label>
          <input id="editlinkDescription" type="text" name="editlinkDescription" defaultValue={activeLink?.description || ''}/>
          <div className='button_group'>
            <button id="editlinkSubmit" type="submit">Modificar</button>
            <button type='button' onClick={() => setFormVisible(false)}>Cancelar</button>
          </div>
        </fieldset>
      </form>
  )
}
