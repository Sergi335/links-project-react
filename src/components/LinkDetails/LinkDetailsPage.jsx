import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTitle } from '../../hooks/useTitle'
import { useGlobalStore } from '../../store/global'
import LinkDetailsHeader from '../LinkDetailsHeader'
import LinkDetailsMedia from '../LinkDetailsMedia'
import styles from './LinkDetails.module.css'

export default function LinkDetailsPage ({ linkid, context }) {
  // const actualDesktop = localStorage.getItem('actualDesktop') ? JSON.parse(localStorage.getItem('actualDesktop')) : useFormsStore(state => state.actualDesktop) // memo?
  const { desktopName, id } = useParams()
  console.log('🚀 ~ LinkDetails ~ actualDesktop:', desktopName)
  const linkId = id
  console.log('🚀 ~ LinkDetails ~ linkId:', linkId)

  const [links, setLinks] = useState([])
  const [maximizeVideo, setMaximizeVideo] = useState(false)
  const [notesState, setNotesState] = useState()

  const globalColumns = useGlobalStore(state => state.globalColumns)
  const desktopColumns = globalColumns.filter(column => column.escritorio.toLowerCase() === desktopName).toSorted((a, b) => a.orden - b.orden) // memo?
  console.log('🚀 ~ LinkDetails ~ desktopColumns:', desktopColumns)
  const globalLinks = useGlobalStore(state => state.globalLinks)

  useEffect(() => {
    if (desktopName) {
      console.log('entramos')

      let dataFinal = []
      desktopColumns.forEach((column) => {
        dataFinal = dataFinal.concat(globalLinks.filter(link => link.idpanel === column._id).toSorted((a, b) => (a.orden - b.orden)))
      })
      setLinks(dataFinal)
    }
  }, [desktopName, globalColumns])

  console.log(links)

  const data = linkId.id ? links.find(link => link._id === linkId.id) : links.find(link => link._id === linkId)
  useTitle({ title: `${data?.name}` })

  console.log('🚀 ~ LinkDetails ~ data:', data)

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
        <LinkDetailsHeader data={data} />
        <LinkDetailsMedia
          data={data}
          maximizeVideo={maximizeVideo}
          handleMaximizeVideo={handleMaximizeVideo}
          notesState={notesState}
          setNotesState={setNotesState}
          links={links}
          setLinks={setLinks}
          linkId={linkId}
          actualDesktop={desktopName}
        />
      </>
        )
      : (
        <div className={styles.loaderWrapper}>
          <span className={styles.loader}></span>
        </div>
        )}
  </main>
  )
}
