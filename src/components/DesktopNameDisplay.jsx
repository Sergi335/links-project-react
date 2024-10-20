import { useParams } from 'react-router-dom'
import { kebabToTitleCase } from '../services/functions'
import styles from './Header.module.css'
import NameLoader from './NameLoader'

export default function DesktopNameDisplay () {
  const { desktopName } = useParams()
  //   const location = useLocation()
  console.log(desktopName)
  const desktopDisplayName = kebabToTitleCase(desktopName)
  console.log('🚀 ~ DesktopNameDisplay ~ desktopDisplayName:', desktopDisplayName)

  return (
            <>
                {
                    desktopDisplayName
                      ? (<p className={styles.deskTitle} id="deskTitle" style={{ color: 'var(--firstTextColor)' }}>{desktopDisplayName}</p>)
                      : (<NameLoader className={styles.deskTitle}/>)

                }
            </>
  )
}
