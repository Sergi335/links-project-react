import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
// import useHideForms from '../../hooks/useHideForms'
import { updateLink } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
import { EditDeskIcon } from '../Icons/icons'
import styles from './LinkDetails.module.css'

export default function LinkDetailsForm ({ data, links, setLinks }) {
  const [nameEditMode, setNameEditMode] = useState(false)
  const [descriptionEditMode, setDescriptionEditMode] = useState(false)
  const [localFaviconVisible, setLocalFaviconVisible] = useState(false)
  const currentImageRef = useRef()
  const editNameInputRef = useRef()
  const editDescriptionInputRef = useRef()
  // const linkImgOptions = useRef()
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const faviconChangerVisible = useGlobalStore(state => state.faviconChangerVisible)
  const setFaviconChangerVisible = useGlobalStore(state => state.setFaviconChangerVisible)
  const setFaviconChangerVisiblePoints = useGlobalStore(state => state.setFaviconChangerVisiblePoints)
  const setLinkToChangeFavicon = useGlobalStore(state => state.setLinkToChangeFavicon)
  // useHideForms({ form: linkImgOptions.current, setFormVisible: setShowIcons })

  const handleEditLinkName = async () => {
    // setNameEditMode(false)
    // console.log('🚀 ~ handleEditLinkName ~ data:', data)
    if (data?.name === editNameInputRef.current.value) return
    // comprobar si el nombre a cambiado para no llamar a la api si no es necesario
    const elementIndex = globalLinks.findIndex(link => link._id === data?._id)
    const newState = [...globalLinks]
    newState[elementIndex].name = editNameInputRef.current.value.trim()
    setGlobalLinks(newState)
    const response = await updateLink({ items: [{ id: data?._id, name: editNameInputRef.current.value.trim() }] })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
    }
  }
  const handleEditLinkDescription = async () => {
    setDescriptionEditMode(false)
    if (data?.description === editDescriptionInputRef.current.value) return
    // comprobar si el nombre a cambiado para no llamar a la api si no es necesario
    const elementIndex = globalLinks.findIndex(link => link._id === data?._id)
    const newState = [...globalLinks]
    newState[elementIndex].description = editDescriptionInputRef.current.value
    setGlobalLinks(newState)
    const response = await updateLink({ items: [{ id: data?._id, description: editDescriptionInputRef.current.value }] })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
    }
  }
  const handleChangeEditName = (event) => {
    setNameEditMode(!nameEditMode)
  }
  const handleChangeEditDescription = (event) => {
    setDescriptionEditMode(!descriptionEditMode)
  }

  const handleChangeType = async (e) => {
    const newType = e.target.value
    if (data?.type === newType) return

    // Optimistic update
    const elementIndex = globalLinks.findIndex(link => link._id === data?._id)
    const newState = [...globalLinks]
    newState[elementIndex].type = newType
    setGlobalLinks(newState)

    const response = await updateLink({ items: [{ id: data?._id, type: newType }] })
    const { hasError, message } = handleResponseErrors(response)

    if (hasError) {
      toast(message)
    } else {
      toast.success('Tipo actualizado correctamente')
    }
  }

  const handleShowFaviconChanger = (e) => {
    e.stopPropagation()
    setFaviconChangerVisiblePoints({ x: e.pageX, y: e.pageY })
    console.log({ x: e.pageX, y: e.pageY })
    // Aquí se abriría el selector de favicon
    setLocalFaviconVisible(!localFaviconVisible)
    setLinkToChangeFavicon(data)
  }
  // Sincronizar estado local con global, ya que se actualiza al clicar fuera y provocaba inconsistencias
  useEffect(() => {
    setFaviconChangerVisible(localFaviconVisible)
  }, [localFaviconVisible])
  useEffect(() => {
    setLocalFaviconVisible(faviconChangerVisible)
  }, [faviconChangerVisible])
  return (
      <>
        <div className={styles.infoContainer}>
          <div className={styles.editFieldsColumn}>
            <div className={styles.editBlock}>
              <p><strong>Nombre:</strong></p>
              {
                nameEditMode
                  ? <input ref={editNameInputRef} className={styles.editNameInput} type='text' defaultValue={data?.name} autoFocus onBlur={handleEditLinkName}/>
                  : <span>{data?.name}</span>
              }
              {
                nameEditMode
                  ? (
                  <div style={{ display: 'inline-flex', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
                    <button style={{ flexGrow: 1 }} className='button_small' onClick={handleEditLinkName}>Guardar</button>
                    <button style={{ flexGrow: 1 }} className='button_small' onClick={() => setNameEditMode(false)}>Cancelar</button>
                  </div>
                    )
                  : (<button className={styles.editButton} onClick={handleChangeEditName}><EditDeskIcon className='uiIcon_small'/></button>)

              }
            </div>
            <div className={styles.editBlock}>
              <p onClick={() => setDescriptionEditMode(!descriptionEditMode)}><strong>Descripción:</strong></p>
              {
                descriptionEditMode
                  ? <textarea ref={editDescriptionInputRef} className={styles.descriptionTextArea} cols={4} rows={4} type='text' defaultValue={data?.description} autoFocus onBlur={handleEditLinkDescription}/>
                  : <span>{data?.description}</span>
              }
              {
                descriptionEditMode
                  ? (
                  <div style={{ display: 'inline-flex', gap: '8px', marginTop: '3px', flexWrap: 'wrap' }}>
                    <button style={{ flexGrow: 1 }} className='button_small' onClick={handleEditLinkDescription}>Guardar</button>
                    <button style={{ flexGrow: 1 }} className='button_small' onClick={() => setDescriptionEditMode(false)}>Cancelar</button>
                  </div>
                    )
                  : (<button className={styles.editButton} onClick={handleChangeEditDescription}><EditDeskIcon className='uiIcon_small'/></button>)
              }
            </div>
            <div className={styles.editBlock}>
              <p><strong>Icono:</strong></p>
              <div>
                <img ref={currentImageRef} onClick={handleShowFaviconChanger} className={styles.iconImage} src={data?.imgUrl} alt="" /><span id='notification' className={styles.notification}></span>
              </div>
            </div>
            <div className={styles.editBlock}>
              <p><strong>Tipo:</strong></p>
              <select
                className={styles.typeSelect}
                value={data?.type || 'general'}
                onChange={handleChangeType}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--firstBorderColor)',
                  backgroundColor: 'var(--secondColor)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  width: 'fit-content'
                }}
              >
                <option value="general">General</option>
                <option value="video">Video</option>
                <option value="note">Nota</option>
                <option value="article">Artículo</option>
              </select>
            </div>
          </div>
        </div>
      </>
  )
}
