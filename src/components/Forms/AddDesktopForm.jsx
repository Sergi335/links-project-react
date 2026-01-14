import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createColumn } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
import { useTopLevelCategoriesStore } from '../../store/useTopLevelCategoriesStore'
// import styles from './AddLinkForm.module.css'

export default function AddDesktopForm () {
  const navigate = useNavigate()
  const topLevelCategoriesStore = useTopLevelCategoriesStore(state => state.topLevelCategoriesStore)
  const setTopLevelCategoriesStore = useTopLevelCategoriesStore(state => state.setTopLevelCategoriesStore)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const inputRef = useRef()
  const formRef = useRef()
  const popoverRef = useRef()

  const handleAddDesktopSubmit = async (event) => {
    event.preventDefault()
    popoverRef.current?.hidePopover()
    const name = inputRef.current.value.trim()
    const order = topLevelCategoriesStore.length + 1

    const response = await createColumn({ name, order, level: 0 })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast.error(message)
      return
    }
    const { data } = response
    const [newCategory] = data
    toast.success('Escritorio Añadido!', { autoClose: 1500 })
    const newState = [...topLevelCategoriesStore, newCategory]
    const newGlobalState = [...globalColumns, newCategory]
    setTopLevelCategoriesStore(newState)
    setGlobalColumns(newGlobalState)
    navigate(`/app/${data[0].slug}`)
  }
  return (
        // eslint-disable-next-line react/no-unknown-property
        <div ref={popoverRef} popover="" id='add-desktop-form'>
          <form ref={formRef} onSubmit={handleAddDesktopSubmit} className='deskForm'>
            <h3>Añade Escritorio</h3>
            <input
              ref={inputRef}
              id='deskName'
              type='text'
              name='deskName'
              maxLength='250'
              placeholder='Introduce un nombre ...'
            required />
            <div className="button_group">
              <button type='submit'>Enviar</button>
              {/* eslint-disable-next-line react/no-unknown-property */}
              <button type='button' popovertarget="add-desktop-form" popovertargetaction="hide">Cancelar</button>
            </div>
          </form>
        </div>
  )
}
