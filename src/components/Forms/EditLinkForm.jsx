import { useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { updateLink } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useFormsStore } from '../../store/forms'
import { useGlobalStore } from '../../store/global'
import { usePreferencesStore } from '../../store/preferences'
// import styles from './AddLinkForm.module.css'

export default function EditLinkForm () {
  const formRef = useRef()
  const nameRef = useRef()
  const urlRef = useRef()
  const descriptionRef = useRef()
  const popoverRef = useRef(null)
  const { desktopName } = useParams()
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  // Link sobre el que se hace click contextual se setea en customlink, podriamos pasarselo desde el custom hook y limpiar mas el componente?
  const activeLink = useFormsStore(state => state.activeLink)
  const name = useMemo(() => activeLink?.name, [activeLink])
  const url = useMemo(() => activeLink?.url, [activeLink])
  const description = useMemo(() => activeLink?.description, [activeLink])
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  useEffect(() => {
    nameRef.current.value = name
    urlRef.current.value = url
    descriptionRef.current.value = description
  }, [activeLink])
  // Habrá que hacer un custom hook que devuelva la funcion handleEditLinkSubmit
  const handleSubmit = async (event) => {
    event.preventDefault()
    popoverRef.current?.hidePopover()
    const { elements } = event.currentTarget
    const name = elements.namedItem('editlinkName').value
    const url = elements.namedItem('editlinkURL').value
    const description = elements.namedItem('editlinkDescription').value
    const id = activeLink._id

    // 🚀 Actualización optimista del estado
    const previousState = [...globalLinks]
    const optimisticState = [...globalLinks]
    const elementIndex = optimisticState.findIndex(element => element._id === activeLink._id)

    if (elementIndex !== -1) {
      const currentLink = optimisticState[elementIndex]
      optimisticState[elementIndex] = { ...currentLink, name, url, description }
      setGlobalLinks(optimisticState)
      activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(optimisticState.toSorted((a, b) => (a.orden - b.orden))))
    }

    try {
      const response = await updateLink({ items: [{ id, name, url, description }] })
      const { hasError, message } = handleResponseErrors(response)

      if (hasError) {
        // Revertir al estado anterior en caso de error
        setGlobalLinks(previousState)
        activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(previousState.toSorted((a, b) => (a.orden - b.orden))))
        toast(message)
        return
      }

      // ✅ Éxito: Actualizar con datos del servidor (si los hay)
      const { data } = response
      if (data && Array.isArray(data) && data.length > 0) {
        const finalState = [...optimisticState]
        if (elementIndex !== -1) {
          // Asumiendo que data[0] contiene los datos actualizados del link
          finalState[elementIndex] = { ...finalState[elementIndex], ...data[0] }
          setGlobalLinks(finalState)
          activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(finalState.toSorted((a, b) => (a.orden - b.orden))))
        }
      }
    } catch (error) {
      // Revertir al estado anterior en caso de error de red
      setGlobalLinks(previousState)
      activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(previousState.toSorted((a, b) => (a.orden - b.orden))))
      toast('Error al actualizar el link')
    }
  }
  return (
      // eslint-disable-next-line react/no-unknown-property
      <div popover="" id='edit-link-form' ref={popoverRef}>
        <form ref={formRef} onSubmit={handleSubmit} className='deskForm'>
          <h2>Edita Link</h2>
          <fieldset>
            <legend>Nombre, URL y Descripción</legend>
            <label htmlFor="editLinkName">Nombre</label>
            <input ref={nameRef} id="editlinkName" type="text" name="editlinkName" required defaultValue={name || ''} />
            <label htmlFor="editLinkURL">URL</label>
            <input ref={urlRef} id="editlinkURL" type="text" name="editlinkURL" required defaultValue={URL || ''}/>
            <label htmlFor="editLinkDescription">Descripción</label>
            <input ref={descriptionRef} id="editlinkDescription" type="text" name="editlinkDescription" defaultValue={description || ''}/>
            <div className='button_group'>
              <button id="editlinkSubmit" type="submit">Modificar</button>
              {/* eslint-disable-next-line react/no-unknown-property */}
              <button type='button' popovertarget="edit-link-form" popovertargetaction="hide">Cancelar</button>
            </div>
          </fieldset>
        </form>
      </div>
  )
}
