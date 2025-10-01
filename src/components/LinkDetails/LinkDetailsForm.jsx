import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
// import useHideForms from '../../hooks/useHideForms'
import { updateLink } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
// import FaviconSelector from '../FaviconSelector'
import styles from './LinkDetails.module.css'

export default function LinkDetailsForm ({ data, links, setLinks }) {
  const [showIcons, setShowIcons] = useState(false)
  const [nameEditMode, setNameEditMode] = useState(false)
  const [descriptionEditMode, setDescriptionEditMode] = useState(false)
  const currentImageRef = useRef()
  const editNameInputRef = useRef()
  const editDescriptionInputRef = useRef()
  // const linkImgOptions = useRef()
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  // useHideForms({ form: linkImgOptions.current, setFormVisible: setShowIcons })

  const handleEditLinkName = async () => {
    setNameEditMode(false)
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
  const handleShowIcons = () => {
    // const element = linkImgOptions.current
    // element.classList.toggle(`${styles.showIcons}`)
    setShowIcons(!showIcons)
  }
  return (
      <>
        <div className={styles.infoContainer}>
          <div className={styles.editFieldsColumn}>
            <div className={styles.editBlock}>
              <p onClick={() => setNameEditMode(!nameEditMode)}><strong>Nombre:</strong></p>
              {nameEditMode
                ? <input ref={editNameInputRef} className={styles.editNameInput} type='text' defaultValue={data?.name} autoFocus onBlur={handleEditLinkName}/>
                : <span>{data?.name}</span>}
            </div>
            <div className={styles.editBlock}>
              <p onClick={() => setDescriptionEditMode(!descriptionEditMode)}><strong>Descripción:</strong></p>
              {descriptionEditMode
                ? <textarea ref={editDescriptionInputRef} className={styles.descriptionTextArea} cols={4} rows={4} type='text' defaultValue={data?.description} autoFocus onBlur={handleEditLinkDescription}/>
                : <span>{data?.description}</span>}
            </div>
            <div className={styles.editBlock}>
              <p><strong>Icono:</strong> <img ref={currentImageRef} onClick={() => handleShowIcons()} className={styles.iconImage} src={data?.imgUrl} alt="" /><span id='notification' className={styles.notification}></span></p>
            </div>
          </div>
          {/* <FaviconSelector links={links} setLinks={setLinks} data={data} showIcons={showIcons} ref={currentImageRef} /> */}
        </div>
      </>
  )
}
