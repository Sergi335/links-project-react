import { DndContext, DragOverlay, MouseSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEffect } from 'react'
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
import styles from './ListOfLinks.module.css'
import LinkLoader from './Loaders/LinkLoader'
import DesktopNameDisplay from './ToolBar/DesktopNameDisplay'

export default function ListOfLinks () {
  const globalLoading = useGlobalStore(state => state.globalLoading)
  const { desktopName } = useParams()
  const { handleDragStart, handleDragOver, handleDragEnd, handleDragCancel, activeLink, activeColumn } = useDragItems({ desktopName })

  const numberOfColumns = usePreferencesStore(state => state.numberOfColumns)
  const numberOfLoaders = Array(Number(numberOfColumns)).fill(null)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  // console.log('🚀 ~ ListOfLinks ~ globalColumns:', globalColumns)
  const desktopParent = globalColumns?.find(column => column.slug === desktopName)?._id
  // console.log('🚀 ~ ListOfLinks ~ globalColumns:', globalColumns)
  const desktopColumns = globalColumns?.filter(column => column.parentId === desktopParent)
  // console.log('🚀 ~ ListOfLinks ~ desktopColumns:', desktopColumns)
  const styleOfColumns = usePreferencesStore(state => state.styleOfColumns)
  const columnLoaderTarget = useLinksStore(state => state.columnLoaderTarget)

  const numberOfPastedLinks = useLinksStore(state => state.numberOfPastedLinks)
  const numberOfLinkLoaders = Array(Number(numberOfPastedLinks)).fill(null)
  const linkLoader = useLinksStore(state => state.linkLoader)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const desktopLinks = globalLinks
  const setSelectedLinks = usePreferencesStore(state => state.setSelectedLinks)

  const customizePanelVisible = useFormsStore(state => state.customizePanelVisible)

  // Limpia selectedLinks al mover los seleccionados a otra columna
  useEffect(() => {
    setSelectedLinks([])
  }, [globalLinks])

  // DND
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 0
      }
    })
  )
  // Obtener ids para DND
  const columnsId = desktopColumns?.map((col) => col._id)
  const getLinksIds = (columna) => {
    return desktopLinks.filter(link => link.idpanel === columna._id).map(link => link._id)
  }

  return (
    <main className={styles.list_of_links}>
      <DesktopNameDisplay numberOfLinks={desktopLinks.length} />
      {
        globalLoading
          ? <div className={styles.lol_content_wrapper}><div id='maincontent' className={styles.lol_content} style={{ gridTemplateColumns: styleOfColumns }}>
            {
              numberOfLoaders.map((item, index) => (
                <ColumnsLoader key={index} />
              ))
            }
          </div>
          </div>
          : (
            <div id='mainContentWrapper' className={styles.lol_content_wrapper}>
              <div id='maincontent' className={styles.lol_content} style={{ gridTemplateColumns: styleOfColumns }}>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCorners}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragCancel={handleDragCancel}
                >
                  <SortableContext strategy={rectSortingStrategy} items={columnsId}>
                    {desktopColumns?.length > 0
                      ? (
                          desktopColumns.map((columna) => (
                          <Columna key={columna._id} data={{ columna }} childCount={getLinksIds(columna).length}>
                            <SortableContext strategy={verticalListSortingStrategy} items={getLinksIds(columna)}>
                              {
                                !activeColumn &&
                                desktopLinks.map((link, index) =>
                                  link.categoryId === columna._id
                                    ? (<CustomLink key={link._id} data={{ link }} idpanel={columna._id} desktopName={desktopName} />)
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
                          ))
                        )
                      : (
                        <>
                          <p>No se encontraron columnas</p>
                        </>
                        )}
                  </SortableContext>
                  {createPortal(
                    <DragOverlay>
                      {activeColumn && (
                        <Columna data={{ activeColumn }}>
                          {/* {
                          desktopLinks.map((link) =>
                            link.idpanel === activeColumn._id
                              ? (<CustomLink key={link._id} data={{ link }} idpanel={activeColumn._id} />)
                              : null
                          )
                        } */}
                        </Columna>
                      )}
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
              </div>
            </div>
            )
      }
      <CustomizeDesktopPanel customizePanelVisible={customizePanelVisible} />
      <FormsContainer />
    </main>
  )
}
