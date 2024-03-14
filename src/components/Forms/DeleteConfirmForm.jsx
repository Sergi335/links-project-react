import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useHideForms from '../../hooks/useHideForms'
import { deleteDesktop } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useDesktopsStore } from '../../store/desktops'
import styles from './AddLinkForm.module.css'

export default function DeleteConfirmForm ({ visible, setVisible, itemType = 'escritorio' }) {
  const visibleClassName = visible ? styles.flex : styles.hidden
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)
  const navigate = useNavigate()
  const { desktopName } = useParams()
  const formRef = useRef()
  useHideForms({ form: formRef.current, setFormVisible: setVisible })
  const index = desktopsStore.findIndex((desktop) => desktop.name === desktopName)
  let desktopToNavigate = desktopsStore.length > 0 ? desktopsStore[0].name : ''
  if (index === 0 && desktopsStore.length === 1) {
    desktopToNavigate = ''
  }
  if (index === 0 && desktopsStore.length > 1) {
    desktopToNavigate = desktopsStore[index + 1].name
  }

  const handleDeleteDesktop = async (event) => {
    event.preventDefault()
    setVisible(false)
    const body = { name: desktopName }
    const response = await deleteDesktop({ body })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
      return
    }
    const { data } = response
    setDesktopsStore(data)
    navigate(`/desktop/${desktopToNavigate}`)
  }

  return (
        <form ref={formRef} onSubmit={handleDeleteDesktop} className={`${visibleClassName} deskForm`}>
            <h2>{`Seguro que quieres borrar este ${itemType}`}</h2>
            <div className="button_group">
              <button id="confDeletedeskSubmit" type="submit">Si</button>
              <button id="noDeletedeskSubmit" type="button" onClick={() => { setVisible(false) }}>No</button>
            </div>
        </form>
  )
}
