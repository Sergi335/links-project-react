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
import Columna from './column'
import ColumnsLoader from './ColumnsLoader'
import CustomizeDesktopPanel from './CustomizeDesktopPanel'
import CustomLink from './customlink'
import linkStyles from './customlink.module.css'
import FormsContainer from './FormsContainer'
import LinkDetailsColumn from './LinkDetails/LinkDetailsColumn'
import styles from './ListOfLinks.module.css'
import LinkLoader from './Loaders/LinkLoader'

export default function SingleColumnPage () {
  const { slug, desktopName, id } = useParams()
  // console.log('🚀 ~ SingleColumnPage ~ id:', id)
  const [navigationLinks, setNavigationLinks] = useState([])
  const [firstColumnLink, setFirstColumnLink] = useState(null)
  const { handleDragStart, handleDragOver, handleDragEnd, handleDragCancel, activeLink } = useDragItems({ desktopName })
  const linkLoader = useLinksStore(state => state.linkLoader)
  const numberOfPastedLinks = useLinksStore(state => state.numberOfPastedLinks)
  const columnLoaderTarget = useLinksStore(state => state.columnLoaderTarget)
  const styleOfColumns = '415px 1fr'
  const numberOfColumns = usePreferencesStore(state => state.numberOfColumns)
  const customizePanelVisible = useFormsStore(state => state.customizePanelVisible)
  const numberOfLoaders = Array(Number(numberOfColumns)).fill(null)
  const numberOfLinkLoaders = Array(Number(numberOfPastedLinks)).fill(null)
  const globalLoading = useGlobalStore(state => state.globalLoading)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const desktopLinks = globalLinks?.filter(link => link.escritorio.toLowerCase() === desktopName)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const desktopColumns = globalColumns?.filter(column => column.escritorio.toLowerCase() === desktopName)
  const setSelectedLinks = usePreferencesStore(state => state.setSelectedLinks)
  // const rootPath = import.meta.env.VITE_ROOT_PATH
  // const basePath = import.meta.env.VITE_BASE_PATH
  // window.history.pushState(null, null, `${rootPath}${basePath}/${desktopName}/${slug}/${firstColumnLink._id}`)
  // const firstColumnLink = desktopLinks.map(link => (link.idpanel === desktopColumns[0]._id) ? link : null).filter(link => link !== null)[0]
  // console.log('🚀 ~ SingleColumnPage ~ firstColumnLink:', firstColumnLink)

  // Limpia selectedLinks al mover los seleccionados a otra columna
  useEffect(() => {
    setSelectedLinks([])
  }, [globalLinks])
  useEffect(() => {
    // const actualColumn = desktopColumns.find(column => column.slug === slug)
    // setFirstColumnLink(desktopLinks.map(link => (link.idpanel === actualColumn._id) ? link : null).filter(link => link !== null)[0])
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
        dataFinal = dataFinal.concat(globalLinks.filter(link => link.idpanel === column._id).toSorted((a, b) => (a.orden - b.orden)))
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
          ? <div className={styles.lol_content_wrapper}><div id='maincontent' className={styles.sp_lol_content} style={{ gridTemplateColumns: styleOfColumns }}>
              {
                numberOfLoaders.map((item, index) => (
                  <ColumnsLoader key={index} />
                ))
              }
            </div></div>
          : (
            <div id='spMainContentWrapper' className={styles.lol_content_wrapper}>
            <div id='maincontent' className={styles.sp_lol_content} style={{ gridTemplateColumns: styleOfColumns }}>
            <DndContext // quitar
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
                          <Columna key={columna._id} data={{ columna }} childCount={getLinksIds(columna).length} context='singlecol'>
                          <SortableContext strategy={verticalListSortingStrategy} items={getLinksIds(columna)}>
                            {
                              // calcular el childcount a partir de desktoplinks y pasarselo como prop a la col
                              desktopLinks.map((link) =>
                                link.idpanel === columna._id
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
                        </Columna>
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
            {/* <LinkDetails linkid={desktopLinks[0]._id}/> */}
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
