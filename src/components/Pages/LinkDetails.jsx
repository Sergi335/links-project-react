import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFormsStore } from '../../store/forms'
// import { fetchImage } from '../../services/dbQueries'
import styles from './LinkDetails.module.css'
// import { PasteImageIcon } from '../Icons/icons'
// import { toast } from 'react-toastify'
import { useGlobalStore } from '../../store/global'
import LinkDetailsMedia from '../LinkDetailsMedia'

export default function LinkDetails () {
  const actualDesktop = localStorage.getItem('actualDesktop') ? JSON.parse(localStorage.getItem('actualDesktop')) : useFormsStore(state => state.actualDesktop) // memo?
  const [links, setLinks] = useState([])
  const [maximizeVideo, setMaximizeVideo] = useState(false)
  const [notesState, setNotesState] = useState()
  const linkId = useParams()
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const desktopColumns = globalColumns.filter(column => column.escritorio.toLowerCase() === actualDesktop).toSorted((a, b) => a.orden - b.orden) // memo?

  useEffect(() => {
    let dataFinal = []
    desktopColumns.forEach((column) => {
      dataFinal = dataFinal.concat(globalLinks.filter(link => link.idpanel === column._id).toSorted((a, b) => (a.orden - b.orden)))
    })
    setLinks(dataFinal)
  }, [globalColumns])

  const data = links.find(link => link._id === linkId.id)
  // console.log('🚀 ~ LinkDetails ~ data:', data)

  useEffect(() => {
    if (data?.notes) {
      setNotesState(data.notes)
    } else {
      setNotesState('Escribe aquí...')
    }
  }, [data])

  const handleMaximizeVideo = () => {
    const root = document.getElementsByClassName('root')
    root[0].classList.toggle(`${styles.fullscreen}`)
    setMaximizeVideo(!maximizeVideo)
  }
  return (
    <main className={`${styles.linkDetails} ${maximizeVideo ? styles.videoMaximized : ''}`}>
    {links && data
      ? (
      <>
        <header className={styles.header}>
          <h3>Detalles del Link</h3>
          <a href={data.URL} target='_blank' rel="noreferrer">{data.name}</a>
          {/* {
            !maximizeVideo && (
              <>
                <p>Pegar Imagen:</p>
                <button onClick={handlePasteImage}>
                  <PasteImageIcon />
                </button>
              </>
            )
          } */}
        </header>

        <LinkDetailsMedia data={data} maximizeVideo={maximizeVideo} handleMaximizeVideo={handleMaximizeVideo} notesState={notesState} setNotesState={setNotesState} links={links} setLinks={setLinks} linkId={linkId} actualDesktop={actualDesktop} />
      </>
        )
      : (
          <div>Cargando ...</div>
        )}
  </main>
  )
}
