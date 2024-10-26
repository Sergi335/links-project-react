import { useParams } from 'react-router-dom'
import { useTitle } from '../../hooks/useTitle'
import { kebabToTitleCase } from '../../services/functions'
import NameLoader from '../NameLoader'
import styles from './Header.module.css'

export default function DesktopNameDisplay () {
  const { desktopName } = useParams()
  //   const location = useLocation()
  console.log(desktopName)
  const desktopDisplayName = kebabToTitleCase(desktopName)
  useTitle({ title: desktopDisplayName })
  console.log('🚀 ~ DesktopNameDisplay ~ desktopDisplayName:', desktopDisplayName)

  return (
            <>
                {
                    desktopDisplayName
                      ? (<p className={styles.deskTitle} id="deskTitle" style={{ color: 'var(--text-color-primary)' }}>{desktopDisplayName}</p>)
                      : (<NameLoader className={styles.deskTitle}/>)

                }
            </>
  )
}
