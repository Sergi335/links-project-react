import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useHideForms from '../../hooks/useHideForms'
import { createColumn } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useFormsStore } from '../../store/forms'
import { useGlobalStore } from '../../store/global'
import { useTopLevelCategoriesStore } from '../../store/useTopLevelCategoriesStore'
import styles from './AddLinkForm.module.css'

export default function AddDesktopForm () {
  const navigate = useNavigate()
  const topLevelCategoriesStore = useTopLevelCategoriesStore(state => state.topLevelCategoriesStore)
  const setTopLevelCategoriesStore = useTopLevelCategoriesStore(state => state.setTopLevelCategoriesStore)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const setAddDeskFormVisible = useFormsStore(state => state.setAddDeskFormVisible)
  const addDeskFormVisible = useFormsStore(state => state.addDeskFormVisible)
  const inputRef = useRef()
  const formRef = useRef()
  const visibleClassName = addDeskFormVisible ? styles.flex : styles.hidden
  useHideForms({ form: formRef.current, setFormVisible: setAddDeskFormVisible })

  const handleAddDesktopSubmit = async (event) => {
    event.preventDefault()
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
    // console.log('🚀 ~ handleAddDesktopSubmit ~ newCategory:', newCategory)
    setAddDeskFormVisible(false)
    toast.success('Escritorio Añadido!', { autoClose: 1500 })
    const newState = [...topLevelCategoriesStore, newCategory]
    const newGlobalState = [...globalColumns, newCategory]
    setTopLevelCategoriesStore(newState)
    setGlobalColumns(newGlobalState)
    navigate(`/app/${data[0].slug}`)
  }
  return (
        <form ref={formRef} className={`${visibleClassName} deskForm`} onSubmit={handleAddDesktopSubmit}>
          <h3>Añade Escritorio</h3>
          <input ref={inputRef} id='deskName' type='text' name='deskName' maxLength='250' required />
          <div className="button_group">
            <button type='submit'>Enviar</button>
            <button type='button' onClick={() => setAddDeskFormVisible(false)}>Cancelar</button>
          </div>
        </form>
  )
}
