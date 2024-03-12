import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { formatDate, getUrlStatus } from '../../services/functions'
import { useFormsStore } from '../../store/forms'
import { useGlobalStore } from '../../store/global'
import { CheckIcon, CloseIcon } from '../Icons/icons'
import LinkDetailsMedia from '../LinkDetailsMedia'
import styles from './LinkDetails.module.css'

export default function LinkDetails () {
  const actualDesktop = localStorage.getItem('actualDesktop') ? JSON.parse(localStorage.getItem('actualDesktop')) : useFormsStore(state => state.actualDesktop) // memo?
  const [links, setLinks] = useState([])
  const [urlStatus, setUrlStatus] = useState()
  const [badgeClass, setBadgeClass] = useState()
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
  // Checa el estado de la url en cada cambio de link
  useEffect(() => {
    const checkUrlStatus = async (url) => {
      const status = await getUrlStatus(url)
      // console.log(status)
      if (status) {
        setUrlStatus(<CheckIcon className={styles.badgeIcon}/>)
        setBadgeClass(`${styles.badgeSuccess}`)
      } else {
        setUrlStatus(<CloseIcon className={styles.badgeIcon}/>)
        setBadgeClass(`${styles.badgeDanger}`)
      }
    }
    checkUrlStatus(data?.URL)
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
          <p><strong>Panel:</strong> <span>{data.panel}</span></p>
          <p><strong>Activo:</strong> <span className={badgeClass}>{urlStatus || 'comprobando...' }</span></p>
          <p><strong>Fecha de creación: </strong><span>{formatDate(data.createdAt)}</span></p>
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
