import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useHideForms from '../../hooks/useHideForms'
import { deleteColumn } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
import { useTopLevelCategoriesStore } from '../../store/useTopLevelCategoriesStore'
import styles from './AddLinkForm.module.css'

export default function DeleteConfirmForm ({ visible, setVisible, itemType = 'escritorio' }) {
  const visibleClassName = visible ? styles.flex : styles.hidden
  const topLevelCategoriesStore = useTopLevelCategoriesStore(state => state.topLevelCategoriesStore)
  const setTopLevelCategoriesStore = useTopLevelCategoriesStore(state => state.setTopLevelCategoriesStore)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const navigate = useNavigate()
  const { desktopName } = useParams()
  const formRef = useRef()
  useHideForms({ form: formRef.current, setFormVisible: setVisible })
  const index = topLevelCategoriesStore.findIndex((desktop) => desktop.slug === desktopName)
  let desktopToNavigate = topLevelCategoriesStore.length > 0 ? topLevelCategoriesStore[0].slug : ''
  if (index === 0 && topLevelCategoriesStore.length === 1) {
    desktopToNavigate = ''
  }
  if (index === 0 && topLevelCategoriesStore.length > 1) {
    desktopToNavigate = topLevelCategoriesStore[index + 1].slug
  }

  const handleDeleteDesktop = async (event) => {
    event.preventDefault()
    setVisible(false)
    const id = globalColumns.find(column => column.slug === desktopName)._id
    const response = await deleteColumn({ id, level: 0 })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
      return
    }
    const { column } = response
    //console.log('🚀 ~ handleDeleteDesktop ~ column:', column)
    const newTopLevelState = topLevelCategoriesStore.filter(desk => desk._id !== id)
    const newGlobalState = globalColumns.filter(col => col._id !== id && col.parentId !== id)
    setTopLevelCategoriesStore(newTopLevelState)
    setGlobalColumns(newGlobalState)
    navigate(`/app/${desktopToNavigate}`)
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
