import { useRef } from 'react'
import { toast } from 'react-toastify'
import { deleteColumn } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
// import styles from './AddLinkForm.module.css'

export default function DeleteColConfirmForm ({ itemType = 'columna', params }) {
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const formRef = useRef()
  const popoverRef = useRef(null)

  const handleDeleteCol = async (event) => {
    event.preventDefault()
    popoverRef.current?.hidePopover()
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
        // eslint-disable-next-line react/no-unknown-property
        <div popover="" id='delete-col-confirm-form' ref={popoverRef}>
          <form ref={formRef} onSubmit={handleDeleteCol}>
            <h2>{`Seguro que quieres borrar este ${itemType}`}</h2>
            <div className="button_group">
              <button id="confDeletedeskSubmit" type="submit">Si</button>
              {/* eslint-disable-next-line react/no-unknown-property */}
              <button id="noDeletedeskSubmit" type="button" popovertarget='delete-col-confirm-form' popovertargetaction='hide'>No</button>
            </div>
          </form>
        </div>
  )
}
