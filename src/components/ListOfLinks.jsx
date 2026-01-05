import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useCategoryColumns } from '../hooks/useCategoryColumns'
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
  const { desktopName, slug } = useParams()

  const numberOfColumns = usePreferencesStore(state => state.numberOfColumns)
  const styleOfColumns = usePreferencesStore(state => state.styleOfColumns)
  const setSelectedLinks = usePreferencesStore(state => state.setSelectedLinks)
  const numberOfColumnLoaders = Array(Number(numberOfColumns)).fill(null)

  // Determinar qué categoría es el "padre" actual
  const actualDesktop = useMemo(() => {
    if (slug) {
      // Si hay slug, buscar la categoría con ese slug (es una subcategoría nivel 1)
      return categories?.find(column => column.slug === slug)?._id
    }
    // Si no hay slug, usar desktopName (categoría nivel 0)
    return categories?.find(column => column.slug === desktopName)?._id
  }, [categories, desktopName, slug])

  // Obtener el nombre para mostrar
  const displayCategory = useMemo(() => {
    if (slug) {
      return categories?.find(column => column.slug === slug)
    }
    return categories?.find(column => column.slug === desktopName)
  }, [categories, desktopName, slug])

  // Usar el hook para obtener columnas (incluyendo virtuales)
  const { columns: desktopColumns, totalLinks, getLinksForColumn } = useCategoryColumns(
    actualDesktop,
    categories,
    links
  )

  const columnsIds = desktopColumns?.map(column => column._id)

  const columnLoaderTarget = useLinksStore(state => state.columnLoaderTarget)
  const numberOfPastedLinks = useLinksStore(state => state.numberOfPastedLinks)
  const linkLoader = useLinksStore(state => state.linkLoader)
  const numberOfLinkLoaders = Array(Number(numberOfPastedLinks)).fill(null)

  const customizePanelVisible = useFormsStore(state => state.customizePanelVisible)

  // Limpia selectedLinks al mover los seleccionados a otra columna
  useEffect(() => {
    setSelectedLinks([])
  }, [links])

  // Obtener ids para DND - modificado para manejar columnas virtuales
  const getLinksIds = (columna) => {
    const columnLinks = getLinksForColumn(columna)
    return columnLinks.map(link => link._id)
  }

  const getFirstColumnLink = (columna) => {
    const columnLinks = getLinksForColumn(columna)
    return columnLinks.find(link => link.order === 0) || columnLinks[0]
  }

  return (
    <main className={styles.list_of_links}>
      <div id="mainContentWrapper" className={styles.lol_content_wrapper}>
          <DesktopNameDisplay numberOfLinks={totalLinks} numberOfColumns={columnsIds?.length || 0} categoryName={displayCategory?.name} />
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
                  getLinksForColumn={getLinksForColumn}
                  parentCategoryId={actualDesktop}
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
