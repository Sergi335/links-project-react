import { DndContext, DragOverlay, MouseSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'react-router-dom'
import { useDragItems } from '../hooks/useDragItems'
import useResizeWindow from '../hooks/useResizeWindow'
import { useFormsStore } from '../store/forms'
import { useGlobalStore } from '../store/global'
import { useLinksStore } from '../store/links'
import { usePreferencesStore } from '../store/preferences'
import Columna from './Column'
import ColumnsLoader from './ColumnsLoader'
import CustomizeDesktopPanel from './CustomizeDesktopPanel'
import FormsContainer from './FormsContainer'
import styles from './ListOfLinks.module.css'
import LinkLoader from './Loaders/LinkLoader'
import SideInfo from './SideInfo'
import CustomLink from './customlink'

export default function ListOfLinks () {
  const { desktopName } = useParams()
  const { handleDragStart, handleDragOver, handleDragEnd, handleDragCancel, activeLink, activeColumn } = useDragItems({ desktopName })
  const windowSize = useResizeWindow()
  const linkLoader = useLinksStore(state => state.linkLoader)
  const numberOfPastedLinks = useLinksStore(state => state.numberOfPastedLinks)
  const columnLoaderTarget = useLinksStore(state => state.columnLoaderTarget)
  const styleOfColumns = usePreferencesStore(state => state.styleOfColumns)
  const numberOfColumns = usePreferencesStore(state => state.numberOfColumns)
  const customizePanelVisible = useFormsStore(state => state.customizePanelVisible)
  const numberOfLoaders = Array(Number(numberOfColumns)).fill(null)
  const numberOfLinkLoaders = Array(Number(numberOfPastedLinks)).fill(null)
  const globalLoading = useGlobalStore(state => state.globalLoading)
  const setColumnHeights = usePreferencesStore(state => state.setColumnHeights)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const desktopLinks = globalLinks?.filter(link => link.escritorio.toLowerCase() === desktopName)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const desktopColumns = globalColumns?.filter(column => column.escritorio.toLowerCase() === desktopName)
  const setSelectedLinks = usePreferencesStore(state => state.setSelectedLinks)
  const openedColumns = usePreferencesStore(state => state.openedColumns)
  const isDesktop = windowSize.width > 1536

  // Limpia selectedLinks al mover los seleccionados a otra columna
  useEffect(() => {
    setSelectedLinks([])
  }, [globalLinks])
  // Almacenar en variable global las alturas de las columnas
  useEffect(() => {
    if (desktopColumns) {
      const heights = desktopColumns.map((column) => {
        const links = desktopLinks.filter(link => link.idpanel === column._id)
        // TODO mucho magic number
        return links.length >= 6 ? (10 + 2 + 38) * links.length + (3 * links.length) : 900
      })
      setColumnHeights(heights)
    }
  }, [desktopName, desktopColumns, desktopLinks])
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
  const getLinksIds = useCallback((columna) => {
    return desktopLinks.filter(link => link.idpanel === columna._id).map(link => link._id)
  }, [desktopLinks])

  return (
    <main className={styles.listOfLinks}>
      {isDesktop && <SideInfo environment={'listoflinks'}/>}
      {
        globalLoading
          ? <div id='maincontent' className={styles.mainContent} style={{ gridTemplateColumns: styleOfColumns }}>
              {
                numberOfLoaders.map((item, index) => (
                  <ColumnsLoader key={index} />
                ))
              }
            </div>
          : (
            <div id='maincontent' className={styles.mainContent} style={{ gridTemplateColumns: styleOfColumns }}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragCancel={handleDragCancel}
            >
              <SortableContext strategy={rectSortingStrategy} items={columnsId}>
              {desktopColumns
                ? (
                    desktopColumns.map((columna) => (
                        <Columna key={columna._id} data={{ columna }} childCount={getLinksIds(columna).length}>
                          <SortableContext strategy={verticalListSortingStrategy} items={getLinksIds(columna)}>
                            {
                              !activeColumn && !openedColumns.includes(columna._id) &&// Es esto pero hay problemas si se quita, deberia poder activarse lo de abajo
                                desktopLinks.map((link) =>
                                  link.idpanel === columna._id
                                    ? (<CustomLink key={link._id} data={{ link }} idpanel={columna._id} desktopName={desktopName} />)
                                    : null
                                ).filter(link => link !== null)
                            }
                            {
                              // calcular el childcount a partir de desktoplinks y pasarselo como prop a la col
                              !activeColumn && openedColumns && openedColumns.includes(columna._id) && desktopLinks.map((link) =>
                                link.idpanel === columna._id
                                  ? (<CustomLink key={link._id} data={{ link }} idpanel={columna._id} className={'flex'} desktopName={desktopName}/>)
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
                      <ColumnsLoader />
                      <ColumnsLoader />
                      <ColumnsLoader />
                      <ColumnsLoader />
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
                    />
                  )}
                </DragOverlay>,
                document.body
              )}
            </DndContext>
            </div>
            )
      }
      <CustomizeDesktopPanel customizePanelVisible={customizePanelVisible}/>
      <FormsContainer />
    </main>
  )
}
