import { useNavigate, useParams } from 'react-router-dom'
import { useDesktopsStore } from '../store/desktops'
import { constants } from '../services/constants'
import styles from './AddLinkForm.module.css'

export default function DeleteConfirmForm ({ visible, setVisible, itemType = 'escritorio' }) {
  const visibleClassName = visible ? styles.flex : styles.hidden
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)
  const navigate = useNavigate()
  const { desktopName } = useParams()

  const handleDeleteDesktop = () => {
    setVisible(false)
    const body = { name: desktopName }
    fetch(`${constants.BASE_API_URL}/escritorios`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        setDesktopsStore(data)
        navigate(`/desktop/${desktopsStore[0].name}`)
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
        <div className={`${visibleClassName} deskForm`}>
            <h2>{`Seguro que quieres borrar este ${itemType}`}</h2>
            <button id="confDeletedeskSubmit" type="submit" onClick={handleDeleteDesktop}>Si</button>
            <button id="noDeletedeskSubmit" type="submit" onClick={() => { setVisible(false) }}>No</button>
        </div>
  )
}
