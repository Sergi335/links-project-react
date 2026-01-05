import { useLocation, useParams } from 'react-router-dom'
import { useGlobalData } from '../../hooks/useGlobalData'
import { useTitle } from '../../hooks/useTitle'
import { kebabToTitleCase } from '../../services/functions'
import NameLoader from '../NameLoader'
import styles from './Toolbar.module.css'

export default function DesktopNameDisplay ({ numberOfLinks, numberOfColumns, categoryName }) {
  const { desktopName, slug } = useParams()
  const { categories } = useGlobalData()
  const location = useLocation()

  let desktopDisplayName
  if (location.pathname === '/readinglist') {
    desktopDisplayName = 'Reading List'
  } else if (categoryName) {
    // Si se pasa categoryName directamente, usarlo
    desktopDisplayName = categoryName
  } else if (slug) {
    // Si hay slug, buscar la categoría con ese slug
    const category = categories?.find(cat => cat.slug === slug)
    desktopDisplayName = category ? category.name : kebabToTitleCase(slug)
  } else if (desktopName) {
    const category = categories?.find(cat => cat.slug === desktopName)
    desktopDisplayName = category ? category.name : kebabToTitleCase(desktopName)
  } else if (location.pathname === '/profile') {
    desktopDisplayName = 'Profile'
  }
  useTitle({ title: desktopDisplayName })

  return (
            <>
                {
                    desktopDisplayName
                      ? (<div className={styles.desktop_name_container}>
                          <h1 className={styles.deskTitle} id="deskTitle">{desktopDisplayName}</h1>
                          <p>{`${numberOfLinks} links`}</p>
                          <p>{numberOfColumns} columnas</p></div>)
                      : (<NameLoader className={styles.deskTitle}/>)

                }
            </>
  )
}
