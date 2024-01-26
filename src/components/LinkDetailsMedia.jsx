import { checkUrlMatch, formatDate, getUrlStatus, handleResponseErrors } from '../services/functions'
import { useEffect, useRef, useState, Suspense } from 'react'
import { saveLinkIcon, fetchLinkIconFile, deleteLinkImage, editLink, fetchImage } from '../services/dbQueries'
import LinkDetailsNav from './LinkDetailsNav'
import Masonry from 'react-layout-masonry'
import styles from '../components/Pages/LinkDetails.module.css'
import { CloseIcon, CodeIcon, TrashIcon, MaximizeIcon, CheckIcon, PasteImageIcon } from '../components/Icons/icons'
import { toast } from 'react-toastify'
import DeleteImageConfirmForm from '../components/Forms/DeleteImageConfirmForm'
import { constants } from '../services/constants'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import ImageLoader from './ImageLoader'

export function ImageModal ({ image, setVisible }) {
  return (
      <div className={styles.modal} id="myModal">
        <span className={styles.close} onClick={() => setVisible(false)}>×</span>
        <img className={styles.modalContent} src={image.src} onClick={() => setVisible(false)}/>
        <div id="caption"></div>
      </div>
  )
}
export function ResponsiveColumnsMasonry ({ images, links, setLinks, linkId, className }) {
  const [visible, setVisible] = useState(false)
  const [deleteConfFormVisible, setDeleteConfFormVisible] = useState(false)
  const [url, setUrl] = useState()
  const [activeImage, setActiveImage] = useState()
  const imageRef = useRef()

  const handleShowImageModal = (event) => {
    setVisible(true)
    setActiveImage(imageRef.current = event.target) // tiene sentido?
  }
  const handleDeleteImage = (event) => {
    console.log(event.currentTarget.id)
    const element = document.getElementById(event.currentTarget.id).parentNode.childNodes[0]
    // LLamar a confirmación mostrar estado glob
    setDeleteConfFormVisible(true)
    // establecer el id global para acceder desde formscontainer
    setUrl(element.src)
    // actualizar estado
  }

  return (
    <>
      <OverlayScrollbarsComponent style={{ flexGrow: '1', marginBottom: '8px' }} defer>
        <Suspense fallback={<div>Loading...</div>}>
        <Masonry
          columns={ 4 }
          gap={5}
          style={{ flexGrow: '1' }}
          className={className}
        >
          {images.map((item) => {
            // return <picture key={item}><img ref={imageRef} onClick={handleShowImageModal} style={{ width: '100%' }} src={item} alt="" onLoad={handleImageLoad} /><span id={item.match(/(\d+-\d+)/)[1]} onClick={handleDeleteImage}><CloseIcon/></span></picture>
            return <picture key={item}><ImageLoader src={item} ref={imageRef} handleShowImageModal={handleShowImageModal} alt={'my picture'}/><span id={item.match(/(\d+-\d+)/)[1]} onClick={handleDeleteImage}><CloseIcon/></span></picture>
          })}
        </Masonry>
        <DeleteImageConfirmForm visible={deleteConfFormVisible} setVisible={setDeleteConfFormVisible} itemType='imagen' imageUrl={url}links={links} setLinks={setLinks} linkId={linkId} />
        </Suspense>
      </OverlayScrollbarsComponent>
      {visible && <ImageModal image={activeImage} setVisible={setVisible}/>}
    </>
  )
}
export function LinkDetailsNotesControls ({ handleSubmit, children }) {
  return (
        <div className={styles.text_controls_container}>
          <div id="textControls" className={styles.textControls}>
            <div className={styles.flex}>
                <button className={`${styles.control_button}`}><CodeIcon/></button>
                <button className={`${styles.control_button}`}><TrashIcon className='uiIcon-button'/></button>
                <button className={`${styles.control_button}`} id="sendNotes" onClick={handleSubmit}>Guardar</button>
            </div>
            {children}
          </div>
        </div>
  )
}
export function LinkDetailsImageControls ({ children }) {
  return (
        <div className={styles.text_controls_container}>
          <div id="textControls" className={styles.textControls}>
            {children}
            {/* <button className={`${styles.control_button}`}><CodeIcon/></button>
            <button className={`${styles.control_button}`}><TrashIcon className='uiIcon-button'/></button>
            <button className={`${styles.control_button}`} id="sendNotes" onClick={handleSubmit}>Guardar</button> */}
          </div>
        </div>
  )
}
export function NotesEditor ({ notes, setNotes, linkId, links, setLinks, children }) {
  const inputRef = useRef()
  const hasWritten = notes === 'Escribe aquí...'

  const handleFocus = () => {
    if (hasWritten) {
      setNotes('')
    }
  }
  const handleBlur = () => {
    if (notes === '') {
      setNotes('Escribe aquí...')
    } else {
      setNotes(inputRef.current.innerHTML)
    }
  }
  const handleChange = () => {
    setNotes(inputRef.current.value)
  }
  return (
      <div id="notesContainer" className={styles.notesContainer}>
        <form>
          {/* <label htmlFor="linkNotes" style={{ textAlign: 'left' }}>Notas:</label> */}
          <textarea ref={inputRef} id="linkNotes" className={styles.linkNotes} name="linkNotes" cols="15" rows="15" onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange} defaultValue={notes} value={notes}></textarea>
        </form>
        {children}
      </div>
  )
}
export function LinksInfo ({ data, links, setLinks }) {
  // Cuando borras una imagen al pasar al siguiente link el boton de borrar imagen sigue activo a veces
  const [showIcons, setShowIcons] = useState(false)
  const [icons, setIcons] = useState()
  const [nameEditMode, setNameEditMode] = useState(false)
  const [descriptionEditMode, setDescriptionEditMode] = useState(false)
  const [urlStatus, setUrlStatus] = useState()
  const [badgeClass, setBadgeClass] = useState()
  const inputRef = useRef()
  const currentImageRef = useRef()
  const deleteButtonRef = useRef()
  const saveButtonRef = useRef()
  const editNameInputRef = useRef()
  const editDescriptionInputRef = useRef()

  if (currentImageRef.current?.src) {
    const url = new URL(currentImageRef.current?.src)
    // TODO magic string a constantes
    if (url.host === 'localhost:5173' || url.host === 't1.gstatic.com') {
      deleteButtonRef.current.disabled = true
    } else {
      deleteButtonRef.current.disabled = false
    }
    saveButtonRef.current.disabled = true
  }

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

  useEffect(() => {
    const checkUrlStatus = async (url) => {
      const status = await getUrlStatus(url)
      console.log(status)
      if (status) {
        setUrlStatus(<CheckIcon className={styles.badgeIcon}/>)
        setBadgeClass(`${styles.badgeSuccess}`)
      } else {
        setUrlStatus(<CloseIcon className={styles.badgeIcon}/>)
        setBadgeClass(`${styles.badgeDanger}`)
      }
    }
    checkUrlStatus(data.URL)
  }, [data])

  const handleChangeIcon = async (event) => {
    const element = document.getElementById(event.currentTarget.id)
    const elementIndex = links.findIndex(link => link._id === data._id)
    const newState = [...links]
    newState[elementIndex].imgURL = element.src
    // setPlaceHolderImageUrl(element.src)
    currentImageRef.current.id = event.currentTarget.id
    saveButtonRef.current.disabled = true
    setLinks(newState)
    const response = await saveLinkIcon({ src: element.src, linkId: data._id })
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
  }
  const handleChangeInputUpload = async () => {
    const file = inputRef.current.files[0]
    const imageUrl = URL.createObjectURL(file)
    currentImageRef.current.src = imageUrl
    saveButtonRef.current.disabled = false
  }
  const handleUploadImage = async () => {
    const file = inputRef.current.files[0]
    const elementIndex = links.findIndex(link => link._id === data._id)
    const newState = [...links]
    const response = await fetchLinkIconFile({ file, linkId: data._id })
    setIcons([...icons, { url: response.url, nombre: 'nuevo' }])
    newState[elementIndex].imgURL = response.url
    setLinks(newState)
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
    const elementIndex = links.findIndex(link => link._id === data._id)
    const newState = [...links]
    newState[elementIndex].imgURL = constants.BASE_LINK_IMG_URL(data.URL)
    setLinks(newState)
    currentImageRef.current.src = constants.BASE_LINK_IMG_URL(data.URL)
    const response = await saveLinkIcon({ src: constants.BASE_LINK_IMG_URL(data.URL), linkId: data._id })
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
  }
  const handleDeleteLinkIcon = async () => {
    const response = await deleteLinkImage(currentImageRef.current.src)
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
    const elementIndex = links.findIndex(link => link._id === data._id)
    const newLinksState = [...links]
    newLinksState[elementIndex].imgURL = constants.BASE_LINK_IMG_URL(data.URL) // da igual porque ya esta en la base de datos habría que llamar tambien a
    saveLinkIcon({ src: constants.BASE_LINK_IMG_URL(data.URL), linkId: data._id })
    setLinks(newLinksState)
    // const iconIndex = icons.findIndex(icon => icon.url === currentImageRef.current.src)
    const newIconsState = icons.filter(icon => icon.url !== currentImageRef.current.src)
    setIcons(newIconsState)
    currentImageRef.current.src = constants.BASE_LINK_IMG_URL(data.URL)
  }
  const handleEditLinkName = async () => {
    setNameEditMode(false)
    if (data.name === editNameInputRef.current.value) return
    // comprobar si el nombre a cambiado para no llamar a la api si no es necesario
    const elementIndex = links.findIndex(link => link._id === data._id)
    const newState = [...links]
    newState[elementIndex].name = editNameInputRef.current.value
    setLinks(newState)
    const response = await editLink({ id: data._id, name: editNameInputRef.current.value })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
    }
  }
  const handleEditLinkDescription = async () => {
    setDescriptionEditMode(false)
    if (data.description === editDescriptionInputRef.current.value) return
    // comprobar si el nombre a cambiado para no llamar a la api si no es necesario
    const elementIndex = links.findIndex(link => link._id === data._id)
    const newState = [...links]
    newState[elementIndex].description = editDescriptionInputRef.current.value
    setLinks(newState)
    const response = await editLink({ id: data._id, description: editDescriptionInputRef.current.value })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
    }
  }
  // Borrar imagen solo si es una de las subidas por el usuario si no deshabilitar boton
  return (
      <>
        <div className={styles.infoContainer}>
          <div className={styles.editBlock}>
            <p onClick={() => setNameEditMode(!nameEditMode)}><strong>Nombre:&nbsp;</strong>
              {nameEditMode
                ? <input ref={editNameInputRef} className={styles.editNameInput} type='text' defaultValue={data.name} autoFocus onBlur={handleEditLinkName}/>
                : <span>{data.name}</span>}
            </p>
          </div>
            <p><strong>Panel:</strong> <span>{data.panel}</span></p>
          <div className={styles.editBlock}>
            <p onClick={() => setDescriptionEditMode(!descriptionEditMode)}><strong>Descripción:&nbsp;</strong>
              {descriptionEditMode
                ? <input ref={editDescriptionInputRef} type='text' defaultValue={data.description} className={styles.editNameInput} autoFocus onBlur={handleEditLinkDescription}/>
                : <span>{data.description}</span>}
            </p>
          </div>
          <p><strong>Activo:</strong> <span className={badgeClass}>{urlStatus || 'Cargando...' }</span></p>
          <p><strong>Fecha de creación: </strong><span>{formatDate(data.createdAt)}</span></p>
          <p><strong>Icono:</strong> <img ref={currentImageRef} onClick={() => setShowIcons(!showIcons)} className={styles.iconImage} src={data.imgURL} alt="" /></p>
          <div className={showIcons ? `${styles.slideInLeft} ${styles.imgOptions}` : `${styles.imgOptions}` }>
            <div className={styles.imgOptionsWrapper}>
              <img onClick={handleChangeIcon} id="option1" src="/img/opcion1.svg"/>
              <img onClick={handleChangeIcon} id="option2" src="/img/opcion2.png"/>
              <img onClick={handleChangeIcon} id="option3" src="/img/opcion3.png"/>
              <img onClick={handleChangeIcon} id="option4" src="/img/opcion4.svg"/>
              <img onClick={handleChangeIcon} id="option5" src="/img/opcion5.svg"/>
              <img onClick={handleChangeIcon} id="option6" src="/img/opcion6.svg"/>
              <img onClick={handleChangeIcon} id="option7" src="/img/opcion7.png"/>
              {
                icons?.map(icon => (<img key={icon.nombre} id={icon.nombre} onClick={handleChangeIcon} src={icon.url} alt="" />))
              }
            </div>
          </div>
          <div className={styles.imgOptionsControls}>
            <button className={`${styles.upLinkImage} ${styles.control_button}`}>
              <label htmlFor="upLinkImg">
              <svg className="uiIcon-button" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"></path></svg>
                </label>
              <input ref={inputRef} id="upLinkImg" type="file" accept="image/*" onChange={handleChangeInputUpload}/>
            </button>
            <button className={`${styles.control_button}`} ref={saveButtonRef} id="saveLinkImage" onClick={handleUploadImage}>Guardar</button>
            <button className={`${styles.control_button}`} id="option8" onClick={handleSetAutoIcon}>Auto</button>
            <button className={`${styles.control_button}`} ref={deleteButtonRef} id="deleteLinkImage" onClick={handleDeleteLinkIcon}>Borrar</button>
          </div>
        </div>
      </>
  )
}
export function ToggleSwitchButton ({ setNotesVisible, notesVisible }) {
  const toggleSections = (e) => {
    // const element = e.currentTarget
    // element.classList.toggle(`${styles.active}`)
    setNotesVisible(!notesVisible)
  }
  const activeClass = notesVisible ? `${styles.active}` : ''
  return (
    <div className={`${styles.colsm5}`}>
        <button type="button" onClick={toggleSections} className={`${activeClass} ${styles.btnlg} ${styles.btntoggle}`} data-toggle="button" aria-pressed="false" autoComplete="off">
            <div className={`${styles.handle}`}></div>
        </button>
    </div>
  )
}
export default function LinkDetailsMedia ({ maximizeVideo, handleMaximizeVideo, data, links, setLinks, linkId, actualDesktop, notesState, setNotesState }) {
  const id = linkId.id
  const [notesVisible, setNotesVisible] = useState(false)
  const handlePasteImage = () => {
    navigator.clipboard.read().then(clipboardItems => {
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            // es una imagen
            clipboardItem.getType(type).then(async blob => {
              const imageUrl = URL.createObjectURL(blob)
              const elementIndex = links.findIndex(link => link._id === data._id)
              const newState = [...links]
              const response = await fetchImage({ imageUrl, linkId: newState[elementIndex]._id })

              newState[elementIndex].images.push(response.images[response.images.length - 1])
              setLinks(newState)
              // Error de red
              if (!response._id && !response.ok && response.error === undefined) {
                toast('Error de red')
                return
              }
              // Error http
              if (!response._id && !response.ok && response.status !== undefined) {
                toast(`${response.status}: ${response.statusText}`)
                return
              }
              // Error personalizado
              if (response._id && response.error) {
                toast(`Error: ${response.error}`)
              }
              toast('Imagen guardada!', { autoClose: 1500 })
            })
          }
        }
      }
    })
  }
  const handleSubmit = async () => {
    console.log(notesState)
    const response = await editLink({ id, notes: notesState })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
      return
    }
    toast('Notas guardadas')
    const linkIndex = links.findIndex(link => link._id === id)
    const newState = [...links]
    newState[linkIndex].notes = notesState
    setLinks(newState)
  }
  return (
    <>
        <section className={`${maximizeVideo ? styles.mainSectionMaximized : styles.mainSection}`}>
          {checkUrlMatch(data.URL)
            ? (
              <>
                <div className={`${maximizeVideo ? styles.videoPlayerMaximized : styles.videoPlayer}`}>
                  <iframe src={checkUrlMatch(data.URL)} width={1068} height={600}></iframe>
                  <div className={styles.text_controls_container}>
                    <div id="textControls" className={styles.textControls}>
                        <button className={styles.control_button} onClick={handleMaximizeVideo}>
                            <MaximizeIcon className={'uiIcon-button'}/>
                        </button>
                    </div>
                  </div>
                </div>
              </>
              )
            : null}
          {
            !maximizeVideo && (
            <>
            {
                checkUrlMatch(data.URL)
                  ? (
                    <>
                    {
                        notesVisible
                          ? (
                              <NotesEditor notes={notesState} setNotes={setNotesState} linkId={linkId} links={links} setLinks={setLinks}>
                                <LinkDetailsNotesControls handleSubmit={handleSubmit}>
                                    <ToggleSwitchButton setNotesVisible={setNotesVisible} notesVisible={notesVisible}/>
                                </LinkDetailsNotesControls>
                              </NotesEditor>
                            )
                          : (
                            <>
                              <div className={styles.imageGalleryContainer} style={{ backgroundImage: data.images.length ? '' : 'var(--placeholderImg)' }}>
                                {data.images.length
                                  ? (

                                        <ResponsiveColumnsMasonry className={styles.imageGallery} images={data.images} links={links} setLinks={setLinks} linkId={data._id} />

                                    )
                                  : null}
                                    <LinkDetailsImageControls>
                                        <button className={styles.control_button} onClick={handlePasteImage}>
                                          <PasteImageIcon />
                                          Pegar Imagen
                                        </button>
                                        <ToggleSwitchButton setNotesVisible={setNotesVisible} notesVisible={notesVisible}/>
                                    </LinkDetailsImageControls>
                              </div>
                              </>
                            )
                    }
                    </>
                    )
                  : (
                    <>
                    <div className={styles.imageGalleryContainer} style={{ backgroundImage: data.images.length ? '' : 'var(--placeholderImg)' }}>
                    {data.images.length
                      ? (
                        <ResponsiveColumnsMasonry className={styles.imageGallery} images={data.images} links={links} setLinks={setLinks} linkId={data._id} />
                        )
                      : null}
                      <LinkDetailsImageControls>
                        {/* <div className={`${styles.colsm5}`}>
                            <button type="button" onClick={toggleSections} className={`${styles.btn} ${styles.btnlg} ${styles.btntoggle}`} data-toggle="button" aria-pressed="false" autoComplete="off">
                                <div className={`${styles.handle}`}></div>
                            </button>
                        </div> */}
                        <button className={styles.control_button} onClick={handlePasteImage}>
                            <PasteImageIcon />
                            Pegar Imagen
                        </button>
                      </LinkDetailsImageControls>
                    </div>
                    <NotesEditor notes={notesState} setNotes={setNotesState} linkId={linkId} links={links} setLinks={setLinks}>
                        <LinkDetailsNotesControls handleSubmit={handleSubmit}>
                            {/* <div className={`${styles.colsm5}`}>
                                <button type="button" onClick={toggleSections} className={`${styles.btn} ${styles.btnlg} ${styles.btntoggle}`} data-toggle="button" aria-pressed="false" autoComplete="off">
                                    <div className={`${styles.handle}`}></div>
                                </button>
                            </div> */}
                        </LinkDetailsNotesControls>
                    </NotesEditor>
                    </>
                    )
            }
            </>
            )
          }
        </section>
        <LinkDetailsNav links={links} actualDesktop={actualDesktop} linkId={linkId}/>
        {
          !maximizeVideo && (
            <section className={styles.footerSection}>
              <LinksInfo data={data} links={links} setLinks={setLinks}/>
            </section>
          )
        }
    </>
  )
}