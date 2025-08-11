import { DndContext, DragOverlay, MouseSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, useParams } from 'react-router-dom'
import { useDragItems } from '../hooks/useDragItems'
import { useGlobalData } from '../hooks/useGlobalData'
import { useFormsStore } from '../store/forms'
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
  const { links, loading, categories } = useGlobalData()
  const { desktopName } = useParams()
  const desktopId = categories?.find(category => category.slug === desktopName)?._id
  const { handleDragStart, handleDragOver, handleDragEnd, handleDragCancel, activeLink, activeColumn } = useDragItems({ desktopId }) // pasar el id, en vez de desktopName es desktopSlug, que si que es único
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH

  const numberOfColumns = usePreferencesStore(state => state.numberOfColumns)
  const styleOfColumns = usePreferencesStore(state => state.styleOfColumns)
  const setSelectedLinks = usePreferencesStore(state => state.setSelectedLinks)
  const numberOfColumnLoaders = Array(Number(numberOfColumns)).fill(null)

  const actualDesktop = categories?.find(column => column.slug === desktopName)?._id
  const desktopColumns = categories?.filter(column => column.parentId === actualDesktop)

  const columnLoaderTarget = useLinksStore(state => state.columnLoaderTarget)
  const numberOfPastedLinks = useLinksStore(state => state.numberOfPastedLinks)
  const linkLoader = useLinksStore(state => state.linkLoader)
  const numberOfLinkLoaders = Array(Number(numberOfPastedLinks)).fill(null)

  const customizePanelVisible = useFormsStore(state => state.customizePanelVisible)

  // Limpia selectedLinks al mover los seleccionados a otra columna
  useEffect(() => {
    setSelectedLinks([])
  }, [links])

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
    return links.filter(link => link.categoryId === columna._id).map(link => link._id)
  }

  const getFirstColumnLink = (columna) => {
    return links.find(link => link.categoryId === columna._id && link.order === 0)
  }

  return (
    <main className={styles.list_of_links}>
      <DesktopNameDisplay numberOfLinks={links.length} />
      {
        loading
          ? <div className={styles.lol_content_wrapper}><div id='maincontent' className={styles.lol_content} style={{ gridTemplateColumns: styleOfColumns }}>
            {
              numberOfColumnLoaders.map((item, index) => (
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
                                links.map((link, index) =>
                                  link.categoryId === columna._id
                                    ? (<CustomLink key={link._id} data={{ link }} idpanel={columna._id} desktopName={desktopName} />)
                                    : null
                                ).filter(link => link !== null)
                              }
                              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                              {
                                categories.map((col) => {
                                  if (col.parentId === columna._id) {
                                    return (
                                      <Link key={col._id} className={styles.subcategories} to={`${rootPath}${basePath}/${columna.slug}/${col.slug}/${getFirstColumnLink(col)?._id}`}>{col.name}</Link>
                                    )
                                  }
                                  return null
                                })
                              }
                              </div>
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
