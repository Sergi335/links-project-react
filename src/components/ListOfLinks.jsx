import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { DndContext, useSensor, useSensors, PointerSensor, closestCorners, DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable'
import Columna from './Column'
import CustomLink from './customlink'
import SideInfo from './SideInfo'
import FormsContainer from './FormsContainer'
import styles from './ListOfLinks.module.css'
import { useLinksStore } from '../store/links'
import { usePreferencesStore } from '../store/preferences'
import { useDragItems } from '../hooks/useDragItems'
import ColumnsLoader from './ColumnsLoader'
import { useFormsStore } from '../store/forms'
import CustomizeDesktopPanel from './CustomizeDesktopPanel'
import LinkLoader from './Loaders/LinkLoader'
import { useGlobalStore } from '../store/global'
import useResizeWindow from '../hooks/useResizeWindow'

export default function ListOfLinks () {
  const { desktopName } = useParams()
  const { handleDragStart, handleDragOver, handleDragEnd, activeLink, activeColumn } = useDragItems({ desktopName })
  const windowSize = useResizeWindow()
  const linkLoader = useLinksStore(state => state.linkLoader)
  const numberOfPastedLinks = useLinksStore(state => state.numberOfPastedLinks)
  const setNumberOfPastedLinks = useLinksStore(state => state.setNumberOfPastedLinks) // cuando setear a 1?
  const columnLoaderTarget = useLinksStore(state => state.columnLoaderTarget)
  const styleOfColumns = usePreferencesStore(state => state.styleOfColumns)
  const numberOfColumns = usePreferencesStore(state => state.numberOfColumns)
  const customizePanelVisible = useFormsStore(state => state.customizePanelVisible)
  const numberOfLoaders = Array(Number(numberOfColumns)).fill(null)
  const numberOfLinkLoaders = Array(Number(numberOfPastedLinks)).fill(null)
  const globalLoading = useGlobalStore(state => state.globalLoading)

  const globalLinks = useGlobalStore(state => state.globalLinks)
  const desktopLinks = globalLinks?.filter(link => link.escritorio.toLowerCase() === desktopName)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const desktopColumns = globalColumns?.filter(column => column.escritorio.toLowerCase() === desktopName)
  // console.log('🚀 ~ file: ListOfLinks.jsx:39 ~ ListOfLinks ~ desktopColumns:', desktopColumns)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0
      }
    })
  )
  const columnsId = desktopColumns?.map((col) => col._id)
  const getLinksIds = (columna) => {
    return desktopLinks.filter(link => link.idpanel === columna._id).map(link => link._id)
  }
  useEffect(() => {
    if (numberOfPastedLinks > 1) {
      setNumberOfPastedLinks(1)
    }
  }, [desktopLinks])
  const isDesktop = windowSize.width > 1536
  return (
    <main className={styles.listOfLinks}>
      {/* <div style={{ display: 'flex', gap: '25px', marginTop: '50px' }}>
        <h3 style={{ position: 'absolute', left: '427px', top: '115px' }}>Favoritos</h3>
        <div className='newSection' style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
          <div>New Section</div>
        </div>

          <h3 style={{ position: 'absolute', left: '952px', top: '115px' }}>Artículos</h3>
          <div className='newSection' style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
            <div>New Section</div>
          </div>
      </div> */}
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
            >
              <SortableContext strategy={rectSortingStrategy} items={columnsId}>
              {desktopColumns
                ? (
                    desktopColumns.map((columna) => (
                        <Columna key={columna._id} data={{ columna }}>
                          <SortableContext strategy={verticalListSortingStrategy} items={getLinksIds(columna)}>
                            {
                              !activeColumn &&
                                desktopLinks.map((link) =>
                                  link.idpanel === columna._id
                                    ? (<CustomLink key={link._id} data={{ link }} idpanel={columna._id} />)
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
                        linksStore.map((link) =>
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
