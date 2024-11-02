import { useLocation, useParams } from 'react-router-dom'
import { useTitle } from '../../hooks/useTitle'
import { kebabToTitleCase } from '../../services/functions'
import NameLoader from '../NameLoader'
import styles from './Header.module.css'

export default function DesktopNameDisplay () {
  const { desktopName } = useParams()
  const location = useLocation()
  // console.log(desktopName)
  let desktopDisplayName
  if (location.pathname === '/readinglist') {
    desktopDisplayName = 'Reading List'
  } else if (desktopName) {
    desktopDisplayName = kebabToTitleCase(desktopName)
  } else if (location.pathname === '/profile') {
    desktopDisplayName = 'Profile'
  }
  useTitle({ title: desktopDisplayName })
  // console.log('🚀 ~ DesktopNameDisplay ~ desktopDisplayName:', desktopDisplayName)

  return (
            <>
                {
                    desktopDisplayName
                      ? (<p className={styles.deskTitle} id="deskTitle">{desktopDisplayName}</p>)
                      : (<NameLoader className={styles.deskTitle}/>)

                }
            </>
  )
}
