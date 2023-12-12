import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDesktopsStore } from '../../store/desktops'
import { useFormsStore } from '../../store/forms'
import { toast } from 'react-toastify'
import { createDesktop } from '../../services/dbQueries'
import { formatPath, handleResponseErrors } from '../../services/functions'
import useHideForms from '../../hooks/useHideForms'
import styles from './AddLinkForm.module.css'

export default function AddDesktopForm () {
  const navigate = useNavigate()
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)
  const setAddDeskFormVisible = useFormsStore(state => state.setAddDeskFormVisible)
  const addDeskFormVisible = useFormsStore(state => state.addDeskFormVisible)
  const inputRef = useRef()
  const formRef = useRef()
  const visibleClassName = addDeskFormVisible ? styles.flex : styles.hidden
  useHideForms({ form: formRef.current, setFormVisible: setAddDeskFormVisible })

  const handleAddDesktopSubmit = async (event) => {
    event.preventDefault()
    const displayName = inputRef.current.value.trim()
    const name = formatPath(displayName)
    const orden = desktopsStore.length + 1

    const response = await createDesktop({ name, displayName, orden })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
      return
    }
    const { data } = response
    setAddDeskFormVisible(false)
    toast('Escritorio Añadido!', { autoClose: 1500 })
    setDesktopsStore(data)
    navigate(`/desktop/${name}`)
  }
  return (
        <form ref={formRef} className={`${visibleClassName} deskForm`} onSubmit={handleAddDesktopSubmit}>
          <h3>Añade Escritorio</h3>
          <input ref={inputRef} id='deskName' type='text' name='deskName' maxLength='35' required />
          <div className="button_group">
            <button type='submit'>Enviar</button>
            <button type='button' onClick={() => setAddDeskFormVisible(false)}>Cancelar</button>
          </div>
        </form>
  )
}
