import { useNavigate, useParams } from 'react-router-dom'
import { useDesktopsStore } from '../../store/desktops'
// import { constants } from '../../services/constants'
import styles from './AddLinkForm.module.css'
import useHideForms from '../../hooks/useHideForms'
import { useRef } from 'react'
import { deleteDesktop } from '../../services/dbQueries'
import { toast } from 'react-toastify'
import { handleResponseErrors } from '../../services/functions'

export default function DeleteConfirmForm ({ visible, setVisible, itemType = 'escritorio' }) {
  const visibleClassName = visible ? styles.flex : styles.hidden
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)
  const navigate = useNavigate()
  const { desktopName } = useParams()
  const formRef = useRef()
  useHideForms({ form: formRef.current, setFormVisible: setVisible })
  const handleDeleteDesktop = async (event) => {
    event.preventDefault()
    setVisible(false)
    const body = { name: desktopName }
    const response = await deleteDesktop({ body })
    console.log(response)
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
      return
    }
    const { data } = response
    setDesktopsStore(data)
    console.log(desktopsStore[0].name)
    navigate(`/desktop/${desktopsStore[0].name}`)
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
