import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFormsStore } from '../store/forms'
import { useGlobalStore } from '../store/global'
import { useLinksStore } from '../store/links'
import { usePreferencesStore } from '../store/preferences'
import Columns from './Columns'
import ColumnsLoader from './ColumnsLoader'
import CustomizeDesktopPanel from './CustomizeDesktopPanel'
import FaviconSelector from './FaviconSelector'
import FormsContainer from './FormsContainer'
import LinkDetailsColumn from './LinkDetails/LinkDetailsColumn'
import styles from './SingleColumnPage.module.css'
export default function SingleColumnPage () {
  // DesktopName es el parentSlug
  const { slug, desktopName, id } = useParams()
  const [navigationLinks, setNavigationLinks] = useState([])
  const [firstColumnLink, setFirstColumnLink] = useState(null)
  console.log('🚀 ~ SingleColumnPage ~ firstColumnLink:', firstColumnLink)
  // console.log('🚀 ~ SingleColumnPage ~ firstColumnLink:', firstColumnLink)
  const linkLoader = useLinksStore(state => state.linkLoader)
  const numberOfPastedLinks = useLinksStore(state => state.numberOfPastedLinks)
  const columnLoaderTarget = useLinksStore(state => state.columnLoaderTarget)
  // const styleOfColumns = '415px 1fr'
  // const numberOfColumns = usePreferencesStore(state => state.numberOfColumns)
  const customizePanelVisible = useFormsStore(state => state.customizePanelVisible)
  const numberOfLoaders = Array(1).fill(null)
  const numberOfLinkLoaders = Array(Number(numberOfPastedLinks)).fill(null)
  const globalLoading = useGlobalStore(state => state.globalLoading)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const desktopLinks = globalLinks
  const globalColumns = useGlobalStore(state => state.globalColumns)
  // const desktopParent = globalColumns?.find(column => column.slug === desktopName)?._id
  // //console.log('🚀 ~ SingleColumnPage ~ desktopParent:', desktopParent)
  const desktopColumns = globalColumns?.find(column => column.slug === slug)
  // console.log('🚀 ~ SingleColumnPage ~ desktopColumns:', desktopColumns)
  // console.log('🚀 ~ SingleColumnPage ~ desktopColumns:', desktopColumns)
  const setSelectedLinks = usePreferencesStore(state => state.setSelectedLinks)
  const tabsVisible = useGlobalStore(state => state.tabsVisible)

  // Limpia selectedLinks al mover los seleccionados a otra columna
  useEffect(() => {
    setSelectedLinks([])
  }, [globalLinks])
  useEffect(() => {
    setFirstColumnLink(desktopLinks.find(link => link._id === id))
  }, [id, globalColumns, globalLinks])

  // DND
  // const sensors = useSensors(
  //   useSensor(MouseSensor, {
  //     activationConstraint: {
  //       distance: 0
  //     }
  //   })
  // )

  useEffect(() => {
    if (desktopName !== '' && desktopName !== undefined) {
      const navlinks = globalLinks.filter(link => link.categoryId === desktopColumns._id).toSorted((a, b) => (a.orden - b.orden))
      setNavigationLinks(navlinks)
    }
  }, [desktopName, globalColumns, slug, globalLinks])

  const getLinksIds = useCallback((columna) => {
    return desktopLinks.filter(link => link.idpanel === columna._id).map(link => link._id)
  }, [desktopLinks])

  return (
    <main className={styles.single_column_page}>
      <div style={{ gridTemplateColumns: !tabsVisible ? '25% 0px 1fr' : '' }} className={styles.single_column_grid}>
        {
          globalLoading
            ? numberOfLoaders.map((item, index) => (
                    <ColumnsLoader key={index} />
            ))
            : (
              <Columns
                desktopColumns={[desktopColumns]}
                desktopLinks={desktopLinks}
                columnLoaderTarget={columnLoaderTarget}
                linkLoader={linkLoader}
                numberOfLinkLoaders={numberOfLinkLoaders}
                getLinksIds={getLinksIds}
                context="single"
                slug={slug}
              />
              )
            }
        <LinkDetailsColumn data={firstColumnLink} links={navigationLinks} actualDesktop={desktopName} slug={slug} />
      </div>
      <CustomizeDesktopPanel customizePanelVisible={customizePanelVisible}/>
      <FormsContainer />
      <FaviconSelector />
    </main>
  )
}

// export default function SingleColumnPage ({ columnName }) {
//   return (
//     <h1>Hola</h1>
//   )
// }
