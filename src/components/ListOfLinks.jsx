import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useGlobalData } from '../hooks/useGlobalData'
import { useFormsStore } from '../store/forms'
import { useLinksStore } from '../store/links'
import { usePreferencesStore } from '../store/preferences'
import Columns from './Columns'
import ColumnsLoader from './ColumnsLoader'
import CustomizeDesktopPanel from './CustomizeDesktopPanel'
import FaviconSelector from './FaviconSelector'
import FormsContainer from './FormsContainer'
import styles from './ListOfLinks.module.css'
import DesktopNameDisplay from './ToolBar/DesktopNameDisplay'

export default function ListOfLinks () {
  const { links, loading, categories } = useGlobalData()
  const { desktopName } = useParams()

  const numberOfColumns = usePreferencesStore(state => state.numberOfColumns)
  const styleOfColumns = usePreferencesStore(state => state.styleOfColumns)
  const setSelectedLinks = usePreferencesStore(state => state.setSelectedLinks)
  const numberOfColumnLoaders = Array(Number(numberOfColumns)).fill(null)

  const actualDesktop = categories?.find(column => column.slug === desktopName)?._id
  const desktopColumns = categories?.filter(column => column.parentId === actualDesktop)
  const columnsIds = desktopColumns?.map(column => column._id)

  const numberOfLinksInCategory = useMemo(() => {
    return links.filter(link => columnsIds.includes(link.categoryId)).length
  }, [links, columnsIds, desktopName])

  const columnLoaderTarget = useLinksStore(state => state.columnLoaderTarget)
  const numberOfPastedLinks = useLinksStore(state => state.numberOfPastedLinks)
  const linkLoader = useLinksStore(state => state.linkLoader)
  const numberOfLinkLoaders = Array(Number(numberOfPastedLinks)).fill(null)

  const customizePanelVisible = useFormsStore(state => state.customizePanelVisible)

  // Limpia selectedLinks al mover los seleccionados a otra columna
  useEffect(() => {
    setSelectedLinks([])
  }, [links])

  // Obtener ids para DND
  const getLinksIds = (columna) => {
    return links.filter(link => link.categoryId === columna._id).map(link => link._id)
  }

  const getFirstColumnLink = (columna) => {
    return links.find(link => link.categoryId === columna._id && link.order === 0)
  }

  return (
    <main className={styles.list_of_links}>
      <div id="mainContentWrapper" className={styles.lol_content_wrapper}>
          <DesktopNameDisplay numberOfLinks={numberOfLinksInCategory} numberOfColumns={columnsIds.length} />
        <div id='maincontent' className={styles.lol_content} style={{ gridTemplateColumns: styleOfColumns }}>
          {
            loading
              ? numberOfColumnLoaders.map((item, index) => (
                    <ColumnsLoader key={index} />
              ))

              : (
                <Columns
                  desktopColumns={desktopColumns}
                  desktopLinks={links}
                  getLinksIds={getLinksIds}
                  linkLoader={linkLoader}
                  columnLoaderTarget={columnLoaderTarget}
                  numberOfLinkLoaders={numberOfLinkLoaders}
                  context="multi"
                  styleOfColumns={styleOfColumns}
                  categories={categories}
                  getFirstColumnLink={getFirstColumnLink}
                />
                )
          }
          <CustomizeDesktopPanel customizePanelVisible={customizePanelVisible} />
          <FormsContainer />
          <FaviconSelector />
        </div>
      </div>
    </main>
  )
}
