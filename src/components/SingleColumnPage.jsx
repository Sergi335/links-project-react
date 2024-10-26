import { DndContext, DragOverlay, MouseSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'react-router-dom'
import { useDragItems } from '../hooks/useDragItems'
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
import CustomLink from './customlink'

export default function SingleColumnPage () {
  const { columnId, desktopName } = useParams()
  const { handleDragStart, handleDragOver, handleDragEnd, handleDragCancel, activeLink, activeColumn } = useDragItems({ desktopName })
  const linkLoader = useLinksStore(state => state.linkLoader)
  const numberOfPastedLinks = useLinksStore(state => state.numberOfPastedLinks)
  const columnLoaderTarget = useLinksStore(state => state.columnLoaderTarget)
  const styleOfColumns = 'repeat(auto-fill, minmax(100%, 1fr))'
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
  const openedColumns = usePreferencesStore(state => state.openedColumns)

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
  const getLinksIds = useCallback((columna) => {
    return desktopLinks.filter(link => link.idpanel === columna._id).map(link => link._id)
  }, [desktopLinks])

  return (
    <main className={styles.listOfLinks}>
      {
        globalLoading
          ? <div className={styles.mainContentWrapper}><div id='maincontent' className={styles.mainContent} style={{ gridTemplateColumns: styleOfColumns }}>
              {
                numberOfLoaders.map((item, index) => (
                  <ColumnsLoader key={index} />
                ))
              }
            </div></div>
          : (
            <div id='mainContentWrapper' className={styles.mainContentWrapper}>
            <div id='maincontent' className={styles.mainContent} style={{ gridTemplateColumns: styleOfColumns, maxWidth: '68ch' }}>
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
                      columna._id === columnId
                        ? (
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
