import { useRef, useState } from 'react'
// import Masonry from 'react-layout-masonry'
import 'photoswipe/style.css'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { fetchImage, updateLink } from '../../services/dbQueries'
import { checkUrlMatch, handleResponseErrors } from '../../services/functions'
import { CodeIcon, MaximizeIcon, PasteImageIcon, TrashIcon } from '../Icons/icons'
import VideoPlayer from '../VideoPlayer'
import styles from './LinkDetails.module.css'
import LinkDetailsForm from './LinkDetailsForm'
import LinkDetailsGallery from './LinkDetailsGallery'
import LinkDetailsNav from './LinkDetailsNav'

export function ControlsContainer ({ children }) {
  return (
    <div className={styles.text_controls_container}>
      <div id="textControls" className={styles.textControls}>
        <div className={styles.flex}>
          {children}
        </div>
      </div>
    </div>
  )
}
export function LinkDetailsNotesControls ({ handleSubmit }) {
  return (
            <div className={styles.notesControls}>
                <button className={`${styles.control_button}`}><CodeIcon/></button>
                <button className={`${styles.control_button}`}><TrashIcon className='uiIcon-button'/></button>
                <button className={`${styles.control_button}`} id="sendNotes" onClick={handleSubmit}>Guardar</button>
            </div>
  )
}
export function LinkDetailsImageControls ({ handlePasteImage }) {
  return (
            <>
              <button className={styles.control_button} onClick={handlePasteImage}>
                <PasteImageIcon />
                Pegar Imagen
              </button>
            </>
  )
}
export function NotesEditor ({ notes, setNotes }) {
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
          <textarea ref={inputRef} id="linkNotes" className={styles.linkNotes} name="linkNotes" cols="15" rows="15" onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange} value={notes}></textarea>
        </form>
      </div>
  )
}
export function ToggleSwitchButton ({ setNotesVisible, notesVisible }) {
  const toggleSections = (e) => {
    const element = e.currentTarget
    element.classList.toggle(`${styles.active}`)
    setNotesVisible(!notesVisible)
  }
  const activeClass = notesVisible ? `${styles.active}` : ''
  return (
    <div className={styles.switchWrapper}>
        <button type="button" onClick={toggleSections} className={`${activeClass} ${styles.btnlg} ${styles.btntoggle}`} data-toggle="button" aria-pressed="false" autoComplete="off">
            <div className={`${styles.handle}`}></div>
        </button>
    </div>
  )
}
export default function LinkDetailsMedia ({ maximizeVideo, handleMaximizeVideo, data, links, setLinks, linkId, actualDesktop, notesState, setNotesState }) {
  // const id = linkId.id
  const { id } = useParams()
  const [notesVisible, setNotesVisible] = useState(false)
  const handlePasteImage = () => {
    const pasteLoading = toast.loading('Subiendo archivo ...')
    navigator.clipboard.read().then(clipboardItems => {
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            // es una imagen
            clipboardItem.getType(type).then(async blob => {
              // TODO a constante limitar a 10MB el tamaño de la imagen subida
              if (blob.size > 1e+7) {
                toast.update(pasteLoading, { render: 'Imagen muy grande', type: 'error', isLoading: false, autoClose: 3000 })
                return
              }
              const imageUrl = URL.createObjectURL(blob)
              const elementIndex = links.findIndex(link => link._id === data._id)
              const newState = [...links]
              const response = await fetchImage({ imageUrl, linkId: newState[elementIndex]._id })

              const { hasError, message } = handleResponseErrors(response)

              if (hasError) {
                console.log(message)
                toast.update(pasteLoading, { render: message, type: 'error', isLoading: false, autoClose: 3000 })
              } else {
                newState[elementIndex].images.push(response.link.images[response.link.images.length - 1])
                setLinks(newState)
                toast.update(pasteLoading, { render: 'Imagen Guardada!', type: 'success', isLoading: false, autoClose: 1500 })
              }
            })
          }
        }
      }
    })
  }
  const handleSubmit = async () => {
    console.log(notesState)
    console.log('🚀 ~ handleSubmit ~ id:', id)
    const response = await updateLink({ items: [{ id, notes: notesState }] })
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
          {checkUrlMatch(data.url)
            ? (
              <>
                <div className={`${maximizeVideo ? styles.videoPlayerMaximized : styles.videoPlayer}`}>
                  <VideoPlayer src={data.url} width={1068} height={600} />
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
                checkUrlMatch(data.url)
                  ? (
                    <div className={styles.sectionsWrapper}>
                      {
                        notesVisible
                          ? (
                              <NotesEditor notes={notesState} setNotes={setNotesState} linkId={linkId} links={links} setLinks={setLinks} />
                            )
                          : (
                              <LinkDetailsGallery data={data} links={links} setLinks={setLinks} />
                            )
                      }
                      <ControlsContainer>
                        {
                          notesVisible ? <LinkDetailsNotesControls handleSubmit={handleSubmit}/> : <LinkDetailsImageControls handlePasteImage={handlePasteImage}/>
                        }
                        <ToggleSwitchButton setNotesVisible={setNotesVisible} notesVisible={notesVisible}/>
                      </ControlsContainer>
                    </div>
                    )
                  : (
                    <>
                    <div className={styles.sectionsWrapper}>
                      <LinkDetailsGallery data={data} links={links} setLinks={setLinks} />
                      <ControlsContainer>
                        <LinkDetailsImageControls handlePasteImage={handlePasteImage}/>
                      </ControlsContainer>
                    </div>
                    <div className={styles.sectionsWrapper}>
                      <NotesEditor notes={notesState} setNotes={setNotesState} linkId={linkId} links={links} setLinks={setLinks}/>
                      <ControlsContainer>
                          <LinkDetailsNotesControls handleSubmit={handleSubmit}/>
                      </ControlsContainer>
                    </div>
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
              <LinkDetailsForm data={data} links={links} setLinks={setLinks}/>
            </section>
          )
        }
    </>
  )
}
