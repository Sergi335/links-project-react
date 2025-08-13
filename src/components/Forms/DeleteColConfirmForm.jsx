import { useRef } from 'react'
import { toast } from 'react-toastify'
import useHideForms from '../../hooks/useHideForms'
import { deleteColumn } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
import styles from './AddLinkForm.module.css'

export default function DeleteColConfirmForm ({ visible, setVisible, itemType = 'columna', params }) {
  const visibleClassName = visible ? styles.flex : styles.hidden
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const formRef = useRef()
  useHideForms({ form: formRef.current, setFormVisible: setVisible })

  const handleDeleteCol = async (event) => {
    event.preventDefault()
    setVisible(false)
    const newList = [...globalColumns].filter(col => col._id !== params._id)
    setGlobalColumns(newList)
    // TODO filter links for performance
    const response = await deleteColumn({ id: params._id })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast.error(message)
    }
  }

  return (
        <form ref={formRef} onSubmit={handleDeleteCol} className={`${visibleClassName} deskForm`}>
            <h2>{`Seguro que quieres borrar este ${itemType}`}</h2>
            <div className="button_group">
              <button id="confDeletedeskSubmit" type="submit">Si</button>
              <button id="noDeletedeskSubmit" type="button" onClick={() => { setVisible(false) }}>No</button>
            </div>
        </form>
  )
}
