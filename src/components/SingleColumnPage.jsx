import { DndContext, DragOverlay, MouseSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'react-router-dom'
import { useDragItems } from '../hooks/useDragItems'
import { useFormsStore } from '../store/forms'
import { useGlobalStore } from '../store/global'
import { useLinksStore } from '../store/links'
import { usePreferencesStore } from '../store/preferences'
import ColumnsLoader from './ColumnsLoader'
import CustomizeDesktopPanel from './CustomizeDesktopPanel'
import CustomLink from './customlink'
import linkStyles from './customlink.module.css'
import FormsContainer from './FormsContainer'
import LinkDetailsColumn from './LinkDetails/LinkDetailsColumn'
import styles from './ListOfLinks.module.css'
import LinkLoader from './Loaders/LinkLoader'
import SingleColumn from './SingleColumn'

export default function SingleColumnPage () {
  // DesktopName es el parentSlug
  const { slug, desktopName, id } = useParams()
  const [navigationLinks, setNavigationLinks] = useState([])
  const [firstColumnLink, setFirstColumnLink] = useState(null)
  const { handleDragStart, handleDragOver, handleDragEnd, handleDragCancel, activeLink } = useDragItems({ desktopName })
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
  // console.log('🚀 ~ SingleColumnPage ~ desktopParent:', desktopParent)
  const desktopColumns = globalColumns?.filter(column => column.slug === slug)
  console.log('🚀 ~ SingleColumnPage ~ desktopColumns:', desktopColumns)
  const setSelectedLinks = usePreferencesStore(state => state.setSelectedLinks)

  // Limpia selectedLinks al mover los seleccionados a otra columna
  useEffect(() => {
    setSelectedLinks([])
  }, [globalLinks])
  useEffect(() => {
    setFirstColumnLink(desktopLinks.find(link => link._id === id))
  }, [id, globalColumns])

  // DND
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 0
      }
    })
  )
  useEffect(() => {
    if (desktopName) {
      let dataFinal = []
      desktopColumns.forEach((column) => {
        dataFinal = dataFinal.concat(globalLinks.filter(link => link.categoryId === column._id).toSorted((a, b) => (a.orden - b.orden)))
      })
      setNavigationLinks(dataFinal)
    }
  }, [desktopName, globalColumns])
  const getLinksIds = useCallback((columna) => {
    return desktopLinks.filter(link => link.idpanel === columna._id).map(link => link._id)
  }, [desktopLinks])

  return (
    <main className={styles.list_of_links}>
      {
        globalLoading
          ? <div className={styles.lol_content_wrapper}><div id='maincontent' className={styles.sp_lol_content}>
              {
                numberOfLoaders.map((item, index) => (
                  <ColumnsLoader key={index} />
                ))
              }
            </div></div>
          : (
            <div id='spMainContentWrapper' className={styles.lol_content_wrapper}>
            <div id='maincontent' className={styles.sp_lol_content}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragCancel={handleDragCancel}
            >
              {desktopColumns
                ? (
                    desktopColumns.map((columna) => (
                      columna.slug === slug
                        ? (
                          <SingleColumn key={columna._id} data={{ columna }} childCount={getLinksIds(columna).length} context='singlecol'>
                          <SortableContext strategy={verticalListSortingStrategy} items={getLinksIds(columna)}>
                            {
                              desktopLinks.map((link) =>
                                link.categoryId === columna._id
                                  ? (<CustomLink key={link._id} data={{ link }} idpanel={columna._id} className={'flex'} desktopName={desktopName} context='singlecol'/>)
                                  : null
                              ).filter(link => link !== null)
                            }
                            {
                              linkLoader && columna._id === columnLoaderTarget?.id && (numberOfLinkLoaders.map((item, index) => (
                                <LinkLoader key={index} />
                              )))
                            }
                          </SortableContext>
                        </SingleColumn>
                          )
                        : null
                    ))
                  )
                : (
                    <>
                      <ColumnsLoader />
                    </>
                  )}
              {createPortal(
                <DragOverlay>
                  {activeLink && (
                    <CustomLink
                      data={{ activeLink }}
                      className={linkStyles.floatLink}
                    />
                  )}
                </DragOverlay>,
                document.body
              )}
            </DndContext>
            <LinkDetailsColumn data={firstColumnLink} links={navigationLinks} actualDesktop={desktopName} slug={slug} />
            </div>
            </div>
            )
      }
      <CustomizeDesktopPanel customizePanelVisible={customizePanelVisible}/>
      <FormsContainer />
    </main>
  )
}

// export default function SingleColumnPage ({ columnName }) {
//   return (
//     <h1>Hola</h1>
//   )
// }
