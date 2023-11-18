import { useParams } from 'react-router-dom'
import { checkUrlMatch, formatDate, getUrlStatus } from '../../services/functions'
import { useFormsStore } from '../../store/forms'
import { useEffect, useRef, useState } from 'react'
import { getDataForDesktops, fetchImage, sendNotes, saveLinkIcon, fetchLinkIconFile, deleteLinkImage } from '../../services/dbQueries'
import SideInfo from '../SideInfo'
import LinkDetailsNav from '../LinkDetailsNav'
import Masonry from 'react-layout-masonry'
import styles from './LinkDetails.module.css'
import { PasteImageIcon, CloseIcon, CodeIcon, TrashIcon } from '../Icons/icons'
import { toast } from 'react-toastify'
import DeleteImageConfirmForm from '../DeleteImageConfirmForm'
import { constants } from '../../services/constants'

export function LinksInfo ({ data, links, setLinks }) {
  const [showIcons, setShowIcons] = useState(false)
  const [icons, setIcons] = useState()
  const [placeHolderImageUrl, setPlaceHolderImageUrl] = useState()
  const [nameEditMode, setNameEditMode] = useState(false)
  const [descriptionEditMode, setDescriptionEditMode] = useState(false)
  const [urlStatus, setUrlStatus] = useState()
  const inputRef = useRef()
  const currentImageRef = useRef()
  const deleteButtonRef = useRef()
  const saveButtonRef = useRef()

  useEffect(() => {
    // la imagen de muestra del link
    if (placeHolderImageUrl) {
      const url = new URL(placeHolderImageUrl)
      // TODO magic string a constantes
      if (url.host === 'localhost:5173' || url.host === 't1.gstatic.com') {
        deleteButtonRef.current.disabled = true
      } else {
        deleteButtonRef.current.disabled = false
      }
    }
  }, [placeHolderImageUrl])

  useEffect(() => {
    fetch('http://localhost:3003/api/linksIcons')
      .then(res => res.json())
      .then(data => {
        const { icons } = data
        if (icons.length > 0) {
          setIcons(icons)
        }
      })
  }, [])
  useEffect(() => {
    const checkUrlStatus = async (url) => {
      const status = await getUrlStatus(url)
      setUrlStatus(status)
    }
    checkUrlStatus(data.URL)
  }, [data])
  const handleChangeIcon = async (event) => {
    const element = document.getElementById(event.currentTarget.id)
    const elementIndex = links.findIndex(link => link._id === data._id)
    const newState = [...links]
    newState[elementIndex].imgURL = element.src
    setPlaceHolderImageUrl(element.src)
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
    console.log('cambia')
    console.log(inputRef.current.files[0])
    const file = inputRef.current.files[0]
    const imageUrl = URL.createObjectURL(file)
    currentImageRef.current.src = imageUrl
    saveButtonRef.current.disabled = false
  }
  const handleUploadImage = async () => {
    const file = inputRef.current.files[0]
    const imageUrl = URL.createObjectURL(file)
    const elementIndex = links.findIndex(link => link._id === data._id)
    const newState = [...links]
    newState[elementIndex].imgURL = imageUrl
    setLinks(newState)
    const response = await fetchLinkIconFile({ file, linkId: data._id })
    setIcons([...icons, { url: response.url, nombre: 'nuevo' }])
    console.log([...icons, { url: response.url, nombre: 'nuevo' }])
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
  // Borrar imagen solo si es una de las subidas por el usuario si no deshabilitar boton
  return (
    <>
      <div className={styles.infoContainer}>
        <p onClick={() => setNameEditMode(!nameEditMode)}>Nombre: {nameEditMode ? <input type='text' defaultValue={data.name}></input> : <span>{data.name}</span>}</p>
        <p>Panel: <span>{data.panel}</span></p>
        <p onClick={() => setDescriptionEditMode(!descriptionEditMode)}>Descripción: {descriptionEditMode ? <input type='text' defaultValue={data.description}></input> : <span>{data.description}</span>}</p>
        <p>Activo: <span>{urlStatus || 'Cargando...' }</span></p>
        <p>Fecha de creación: <span>{formatDate(data.createdAt)}</span></p>
        <p>Icono: <img ref={currentImageRef} onClick={() => setShowIcons(!showIcons)} className={styles.iconImage} src={data.imgURL} alt="" /></p>
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
          <button className={styles.upLinkImage}>
            <label htmlFor="upLinkImg">
            <svg className="uiIcon-button" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"></path></svg>
              </label>
            <input ref={inputRef} id="upLinkImg" type="file" accept="image/*" onChange={handleChangeInputUpload}/>
          </button>
          <button ref={saveButtonRef} id="saveLinkImage" onClick={handleUploadImage} disabled>Guardar</button>
          <button id="option8" onClick={handleSetAutoIcon}>Auto</button>
          <button ref={deleteButtonRef} id="deleteLinkImage" onClick={handleDeleteLinkIcon}>Borrar</button>
        </div>
      </div>
    </>
  )
}
export function NotesEditor ({ notes, setNotes, linkId, links, setLinks }) {
  const id = linkId.id
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
  const handleSubmit = async () => {
    const response = await sendNotes({ id, notes })
    if (response._id) {
      toast('Notas guardadas')
      const linkIndex = links.findIndex(link => link._id === id)
      const newState = [...links]
      newState[linkIndex].notes = notes
      setLinks(newState)
    } else {
      toast('Error al guardar las notas')
    }
  }
  return (
    <div id="notesContainer" className={styles.notesContainer}>
      <form>
        <label htmlFor="">Notas:</label>
        <textarea ref={inputRef} id="linkNotes" className={styles.linkNotes} name="" cols="130" rows="15" onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange} defaultValue={notes} value={notes}></textarea>
      </form>
      <div id="textControls" className={styles.textControls}>
        <button><CodeIcon/></button>
        <button><TrashIcon/></button>
        <button id="sendNotes" onClick={handleSubmit}>Guardar</button>
      </div>
    </div>
  )
}
export function ImageModal ({ image, setVisible }) {
  return (
    <div className={styles.modal} id="myModal">
      <span className={styles.close} onClick={() => setVisible(false)}>×</span>
      <img className={styles.modalContent} src={image.src} onClick={() => setVisible(false)}/>
      <div id="caption"></div>
    </div>
  )
}
export function ResponsiveColumnsMasonry ({ images, links, setLinks, linkId }) {
  const [visible, setVisible] = useState(false)
  const [deleteConfFormVisible, setDeleteConfFormVisible] = useState(false)
  const [url, setUrl] = useState()
  const [activeImage, setActiveImage] = useState()
  const imageRef = useRef()
  // const setDeleteImageFormVisible = useFormsStore(state => state.setDeleteImageFormVisible)

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
      <Masonry
        columns={ 4 }
        gap={16}
      >
        {images.map((item) => {
          return <picture key={item}><img ref={imageRef} onClick={handleShowImageModal} style={{ width: '100%' }} src={item} alt="" /><span id={item.match(/(\d+-\d+)/)[1]} onClick={handleDeleteImage}><CloseIcon/></span></picture>
        })}
      </Masonry>
      {visible && <ImageModal image={activeImage} setVisible={setVisible}/>}
      {deleteConfFormVisible && <DeleteImageConfirmForm visible={deleteConfFormVisible} setVisible={setDeleteConfFormVisible} itemType='imagen' imageUrl={url}links={links} setLinks={setLinks} linkId={linkId} />}
    </>
  )
};

export default function LinkDetails () {
  const actualDesktop = useFormsStore(state => state.actualDesktop)
  const [links, setLinks] = useState([])
  const [galleryWithFullClass, setGalleryWithFullClass] = useState()
  const [notesState, setNotesState] = useState()
  const linkId = useParams()

  useEffect(() => {
    getData()
  }, [actualDesktop])

  const getData = async () => {
    const [columnsData, linksData] = await getDataForDesktops(actualDesktop)
    if (columnsData && linksData) {
      const orderedLinks = columnsData.map(col => (
        linksData.filter(link => (link.idpanel === col._id ? link : null))
      )).flat().filter(el => el !== null)
      console.log(orderedLinks)
      setLinks(orderedLinks)
    }
  }

  const data = links.find(link => link._id === linkId.id)
  useEffect(() => {
    if (data?.URL) {
      const isVideo = checkUrlMatch(data.URL)
      if (!isVideo) {
        setGalleryWithFullClass(styles.wfull)
      }
    }
    if (data?.notes) {
      setNotesState(data.notes)
    } else {
      setNotesState('Escribe aquí...')
    }
  }, [data])

  const handlePasteImage = () => {
    navigator.clipboard.read().then((clipboardItems) => {
      for (const clipboardItem of clipboardItems) {
        console.log(clipboardItems)
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            // es una imagen
            clipboardItem.getType(type).then(async (blob) => {
              console.log('Imagen:', blob)
              const imageUrl = URL.createObjectURL(blob)
              const elementIndex = links.findIndex(link => link._id === data._id)
              console.log(elementIndex)
              const newState = [...links]
              const response = await fetchImage({ imageUrl, linkId: newState[elementIndex]._id })
              console.log(response.images[response.images.length - 1])
              newState[elementIndex].images.push(response.images[response.images.length - 1])
              console.log(newState[elementIndex])
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
  return (
    <main className={styles.linkDetails}>
    {links && data
      ? (
      <>
        <SideInfo environment={'linkdetails'} />
        <header className={styles.header}>
          <h3>Detalles del Link</h3>
          <a href={data.URL} target='_blank' rel="noreferrer">{data.name}</a>
          <p>Pegar Imagen:</p>
          <button onClick={handlePasteImage}>
            <PasteImageIcon />
          </button>
        </header>
        {/* <p>{data.description}</p>
        <p>{data.escritorio}</p>
        <p>{data.panel}</p> */}
        <section className={styles.mainSection}>
          {checkUrlMatch(data.URL)
            ? (
          <div className={styles.videoPlayer}>
          <iframe src={checkUrlMatch(data.URL)} width={1068} height={600}></iframe>
          </div>
              )
            : null}
          {data.images.length
            ? (
          <div className={`${styles.imageGallery} ${galleryWithFullClass}`}>
              <ResponsiveColumnsMasonry images={data.images} links={links} setLinks={setLinks} linkId={data._id} />
          </div>
              )
            : null}
        </section>
          <LinkDetailsNav links={links} actualDesktop={actualDesktop} linkId={linkId}/>
        <section className={styles.footerSection}>
          <NotesEditor notes={notesState} setNotes={setNotesState} linkId={linkId} links={links} setLinks={setLinks}/>
          <LinksInfo data={data} links={links} setLinks={setLinks}/>
        </section>
      </>
        )
      : (
          <div>Cargando ...</div>
        )}
  </main>
  )
}
