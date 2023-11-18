import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDesktopsStore } from '../store/desktops'
import { useFormsStore } from '../store/forms'
import { toast } from 'react-toastify'
import { createDesktop } from '../services/dbQueries'
import { formatPath } from '../services/functions'

export default function AddDesktopForm () {
  const navigate = useNavigate()
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)
  const setAddDeskFormVisible = useFormsStore(state => state.setAddDeskFormVisible)
  const inputRef = useRef()

  const handleAddDesktopSubmit = async (event) => {
    event.preventDefault()
    const displayName = inputRef.current.value.trim()
    const name = formatPath(displayName)
    const orden = desktopsStore.length + 1

    const response = await createDesktop({ name, displayName, orden })
    // Error de red
    if (!Array.isArray(response) && !response.ok && response.error === undefined) {
      toast('Error de red')
      return
    }
    // Error http
    if (!Array.isArray(response) && !response.ok && response.status !== undefined) {
      toast(`${response.status}: ${response.statusText}`)
      return
    }
    // Error personalizado
    if (!Array.isArray(response) && response.error) {
      toast(`Error: ${response.error}`)
      return
    }
    setAddDeskFormVisible(false)
    toast('Escritorio Añadido!', { autoClose: 1500 })
    setDesktopsStore(response)
    navigate(`/desktop/${name}`)
  }
  return (
        <form className='deskForm' onSubmit={handleAddDesktopSubmit}>
          <h3>Añade Escritorio</h3>
          <input ref={inputRef} id='deskName' type='text' name='deskName' maxLength='35' required />
          <button>Enviar</button>
        </form>
  )
}
