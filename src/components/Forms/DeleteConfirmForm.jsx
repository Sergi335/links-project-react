import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useHideForms from '../../hooks/useHideForms'
import { deleteDesktop } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useTopLevelCategoriesStore } from '../../store/useTopLevelCategoriesStore'
import styles from './AddLinkForm.module.css'

export default function DeleteConfirmForm ({ visible, setVisible, itemType = 'escritorio' }) {
  const visibleClassName = visible ? styles.flex : styles.hidden
  const topLevelCategoriesStore = useTopLevelCategoriesStore(state => state.topLevelCategoriesStore)
  const setTopLevelCategoriesStore = useTopLevelCategoriesStore(state => state.setTopLevelCategoriesStore)
  const navigate = useNavigate()
  const { desktopName } = useParams()
  const formRef = useRef()
  useHideForms({ form: formRef.current, setFormVisible: setVisible })
  const index = topLevelCategoriesStore.findIndex((desktop) => desktop.name === desktopName)
  let desktopToNavigate = topLevelCategoriesStore.length > 0 ? topLevelCategoriesStore[0].name : ''
  if (index === 0 && topLevelCategoriesStore.length === 1) {
    desktopToNavigate = ''
  }
  if (index === 0 && topLevelCategoriesStore.length > 1) {
    desktopToNavigate = topLevelCategoriesStore[index + 1].name
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
    setTopLevelCategoriesStore(data)
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
