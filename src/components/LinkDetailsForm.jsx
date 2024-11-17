import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import useHideForms from '../hooks/useHideForms'
import { constants } from '../services/constants'
import { deleteLinkImage, editLink, fetchLinkIconFile, saveLinkIcon } from '../services/dbQueries'
import { handleResponseErrors } from '../services/functions'
import styles from './Pages/LinkDetails.module.css'

export default function LinkDetailsForm ({ data, links, setLinks }) {
  // Cuando borras una imagen al pasar al siguiente link el boton de borrar imagen sigue activo a veces
  const [showIcons, setShowIcons] = useState(false)
  const [icons, setIcons] = useState()
  const [nameEditMode, setNameEditMode] = useState(false)
  const [descriptionEditMode, setDescriptionEditMode] = useState(false)
  const inputRef = useRef()
  const currentImageRef = useRef()
  const deleteButtonRef = useRef()
  const saveButtonRef = useRef()
  const editNameInputRef = useRef()
  const editDescriptionInputRef = useRef()
  const linkImgOptions = useRef()
  useHideForms({ form: linkImgOptions.current, setFormVisible: setShowIcons })

  // Checa si la imagen es una de las subidas por el usuario para deshabilitar el boton de borrar
  // Como lo vamos a hacer: se van a poner todas las por defecto en la carpeta public, ya no tiramos de las de SergioSR
  // Y asi tal cual funcionaría el código
  useEffect(() => {
    const baseurl = new URL(import.meta.env.VITE_CUSTOM_BASE_URL)
    const autoUrlHost = import.meta.env.VITE_AUTO_FAVICON_HOST
    if (currentImageRef.current?.src) {
      const url = new URL(currentImageRef.current?.src)
      if (url.host === baseurl.host || url.host === autoUrlHost) {
        deleteButtonRef.current.disabled = true
      } else {
        deleteButtonRef.current.disabled = false
      }
      saveButtonRef.current.disabled = true
    }
  }, [links, data])
  // Setea los iconos
  useEffect(() => {
    fetch(`${constants.BASE_API_URL}/storage/icons`, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
      .then(res => res.json())
      .then(data => {
        setIcons(data)
      })
  }, [])

  const handleSelectIconOnClick = async (event) => {
    const $linkIcon = document.getElementById(event.currentTarget.id)
    const $notification = document.getElementById('notification')
    // Encuentra el link actual entre todos los links
    const elementIndex = links.findIndex(link => link._id === data?._id)
    const newState = [...links]
    newState[elementIndex].imgURL = $linkIcon.src
    // setPlaceHolderImageUrl(element.src)

    // adjudicar el id con el nombre del icono para poder borrarlo, importante
    currentImageRef.current.id = $linkIcon.id

    // Está desabilitado porque el cambio se hace automaticamente al seleccionar un icono, pero cuidado no se quede asi
    saveButtonRef.current.disabled = true
    setLinks(newState)
    const response = await saveLinkIcon({ src: $linkIcon.src, linkId: data?._id })
    // Error de red
    if (!response.message && !response.ok && response.error === undefined) {
      toast('Error de red')
      return
    }
    // Error http
    if (!response.message && !response.ok && response.status !== undefined) {
      toast(`${response.status}: ${response.statusText}`)
      return
    }
    // Error personalizado
    if (!response.message && response.error) {
      toast(`Error: ${response.error}`)
    }
    $notification.textContent = 'Saved!'
    $notification.classList.add(`${styles.show}`)
    setTimeout(() => {
      $notification.classList.remove(`${styles.show}`)
    }, 1500)
  }
  const handleCreateImageUrlFromFile = async () => {
    const file = inputRef.current.files[0]
    console.log(file.size)
    if (file.size > 500000) {
      toast.error('Imagen muy grande, máximo 500KB')
      return
    }
    const imageUrl = URL.createObjectURL(file)
    currentImageRef.current.src = imageUrl
    saveButtonRef.current.disabled = false
  }
  const handleUploadImage = async () => {
    const file = inputRef.current.files[0]
    const elementIndex = links.findIndex(link => link._id === data?._id)
    const newState = [...links]
    const response = await fetchLinkIconFile({ file, linkId: data?._id })
    setIcons([...icons, { url: response.url, nombre: response.name }])
    newState[elementIndex].imgURL = response.url
    setLinks(newState)
    // adjudicar el id con el nombre del icono para poder borrarlo, importante
    currentImageRef.current.id = response.name
    // evitar que se guarde si no se ha cambiado la imagen
    console.log(response)
    // Error de red
    if (!response.message && !response.ok && response.error === undefined) {
      toast('Error de red')
      return
    }
    // Error http
    if (!response.message && !response.ok && response.status !== undefined) {
      toast(`${response.status}: ${response.statusText}`)
      return
    }
    // Error personalizado
    if (!response.message && response.error) {
      toast(`Error: ${response.error}`)
    }
    toast('Imagen guardada!', { autoClose: 1500 })
  }
  const handleSetAutoIcon = async () => {
    const $notification = document.getElementById('notification')
    const elementIndex = links.findIndex(link => link._id === data?._id)
    const newState = [...links]
    newState[elementIndex].imgURL = constants.BASE_LINK_IMG_URL(data?.URL)
    setLinks(newState)
    currentImageRef.current.src = constants.BASE_LINK_IMG_URL(data?.URL)
    const response = await saveLinkIcon({ src: constants.BASE_LINK_IMG_URL(data?.URL), linkId: data?._id })
    // Error de red
    if (!response.message && !response.ok && response.error === undefined) {
      toast('Error de red')
      return
    }
    // Error http
    if (!response.message && !response.ok && response.status !== undefined) {
      toast(`${response.status}: ${response.statusText}`)
      return
    }
    // Error personalizado
    if (!response.message && response.error) {
      toast(`Error: ${response.error}`)
    }
    $notification.textContent = 'Saved!'
    $notification.classList.add(`${styles.show}`)
    setTimeout(() => {
      $notification.classList.remove(`${styles.show}`)
    }, 1500)
  }
  const handleDeleteLinkIcon = async () => {
    const response = await deleteLinkImage(currentImageRef.current.id)
    // Error de red
    if (!response.message && !response.ok && response.error === undefined) {
      toast('Error de red')
      return
    }
    // Error http
    if (!response.message && !response.ok && response.status !== undefined) {
      toast(`${response.status}: ${response.statusText}`)
      return
    }
    // Error personalizado
    if (!response.message && response.error) {
      toast(`Error: ${response.error}`)
    }
    toast('Imagen borrada!', { autoClose: 1500 })
    const elementIndex = links.findIndex(link => link._id === data?._id)
    const newLinksState = [...links]
    newLinksState[elementIndex].imgURL = constants.BASE_LINK_IMG_URL(data?.URL)
    saveLinkIcon({ src: constants.BASE_LINK_IMG_URL(data?.URL), linkId: data?._id }) // Await y control???
    setLinks(newLinksState)
    // const iconIndex = icons.findIndex(icon => icon.url === currentImageRef.current.src)
    const newIconsState = icons.filter(icon => icon.url !== currentImageRef.current.src)
    setIcons(newIconsState)
    currentImageRef.current.src = constants.BASE_LINK_IMG_URL(data?.URL)
    // Deshabilitar boton de borrar imagen
    deleteButtonRef.current.disabled = true
  }
  const handleEditLinkName = async () => {
    // setNameEditMode(false)
    if (data?.name === editNameInputRef.current.value) return
    // comprobar si el nombre a cambiado para no llamar a la api si no es necesario
    const elementIndex = links.findIndex(link => link._id === data?._id)
    const newState = [...links]
    newState[elementIndex].name = editNameInputRef.current.value
    setLinks(newState)
    const response = await editLink({ id: data?._id, name: editNameInputRef.current.value })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
    }
  }
  const handleEditLinkDescription = async () => {
    // setDescriptionEditMode(false)
    if (data?.description === editDescriptionInputRef.current.value) return
    // comprobar si el nombre a cambiado para no llamar a la api si no es necesario
    const elementIndex = links.findIndex(link => link._id === data?._id)
    const newState = [...links]
    newState[elementIndex].description = editDescriptionInputRef.current.value
    setLinks(newState)
    const response = await editLink({ id: data?._id, description: editDescriptionInputRef.current.value })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
    }
  }
  const handleShowIcons = () => {
    const element = linkImgOptions.current
    element.classList.toggle(`${styles.showIcons}`)
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
              <p><strong>Icono:</strong> <img ref={currentImageRef} onClick={() => handleShowIcons()} className={styles.iconImage} src={data?.imgURL} alt="" /><span id='notification' className={styles.notification}></span></p>
            </div>
          </div>
          <div ref={linkImgOptions} className={showIcons ? `${styles.showIcons} ${styles.imgOptions}` : `${styles.imgOptions}` }>
            <div className={styles.imgOptionsWrapper}>
              {
                constants.DEFAULT_LINK_ICONS.map(icon => (<img key={icon.option} id={icon.option} className='default' onClick={handleSelectIconOnClick} src={icon.url} alt={icon.option} />))
              }
              {
                icons?.map(icon => (<img key={icon.nombre} id={icon.nombre} className={icon.clase} onClick={handleSelectIconOnClick} src={icon.url} alt="" />))
              }
            </div>
            <div className={styles.imgOptionsControls}>
              <button className={`${styles.upLinkImage} ${styles.control_button}`}>
                <label htmlFor="upLinkImg">
                <svg className="uiIcon-button" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"></path></svg>
                Subir Favicon
                  </label>
                <input ref={inputRef} id="upLinkImg" type="file" accept="image/*" onChange={handleCreateImageUrlFromFile}/>
              </button>
              <button className={`${styles.control_button}`} ref={saveButtonRef} id="saveLinkImage" onClick={handleUploadImage}>Guardar</button>
              <button className={`${styles.control_button}`} id="option8" onClick={handleSetAutoIcon}>Auto</button>
              <button className={`${styles.control_button}`} ref={deleteButtonRef} id="deleteLinkImage" onClick={handleDeleteLinkIcon}>Borrar</button>
            </div>
          </div>
        </div>
      </>
  )
}
