import { useParams } from 'react-router-dom'
import { useMemo, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { DndContext, useSensor, useSensors, PointerSensor, closestCorners, DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable'
// import { useColumns } from '../hooks/useColumns'
import Columna from './Column'
import CustomLink from './customlink'
import SideInfo from './SideInfo'
import FormsContainer from './FormsContainer'
import styles from './ListOfLinks.module.css'
import { useLinksStore } from '../store/links'
import { useColumnsStore } from '../store/columns'
import { usePreferencesStore } from '../store/preferences'
import { useDragItems } from '../hooks/useDragItems'
import ColumnsLoader from './ColumnsLoader'
// import { useNavStore } from '../store/session'
import { useFormsStore } from '../store/forms'
import CustomizeDesktopPanel from './CustomizeDesktopPanel'

export default function ListOfLinks () {
  const { desktopName } = useParams()
  // const { loading } = useColumns({ desktopName })
  const [loading, setLoading] = useState(false)
  const setLinksStore = useLinksStore(state => state.setLinksStore)
  const linksStore = useLinksStore(state => state.linksStore)
  const columnsStore = useColumnsStore(state => state.columnsStore)
  const setColumnsStore = useColumnsStore(state => state.setColumnsStore)
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const storageLinks = JSON.parse(localStorage.getItem(`${desktopName}links`))
  const storageColumns = JSON.parse(localStorage.getItem(`${desktopName}Columns`))
  const { handleDragStart, handleDragOver, handleDragEnd, activeLink, activeColumn } = useDragItems({ desktopName })
  const styleOfColumns = usePreferencesStore(state => state.styleOfColumns)
  // const setStyleOfColumns = usePreferencesStore(state => state.setStyleOfColumns)
  const numberOfColumns = usePreferencesStore(state => state.numberOfColumns)
  const numberOfLoaders = Array(Number(numberOfColumns)).fill(null)
  // const setLinks = useNavStore(state => state.setLinks)
  const setActualDesktop = useFormsStore(state => state.setActualDesktop)
  const customizePanelVisible = useFormsStore(state => state.customizePanelVisible)

  useEffect(() => {
    setActualDesktop(desktopName)
    localStorage.setItem('actualDesktop', JSON.stringify(desktopName))
    setLoading(true)
    if (storageLinks && storageLinks?.length > 0) {
      setLinksStore(storageLinks)
    } else {
      fetch(`http://localhost:3003/api/links/desktop/${desktopName}`)
        .then(res => res.json())
        .then(data => {
          setLinksStore(data.toSorted((a, b) => (a.orden - b.orden)))
          activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(data.toSorted((a, b) => (a.orden - b.orden))))
          setTimeout(() => setLoading(false), 300)
          // setLoading(false)
        })
    }
  }, [desktopName])

  useEffect(() => {
    if (storageColumns && storageColumns?.length > 0) {
      setColumnsStore(storageColumns)
    } else {
      fetch(`http://localhost:3003/api/columnas?escritorio=${desktopName}`)
        .then(res => res.json())
        .then(data => {
          setColumnsStore(data.toSorted((a, b) => (a.order - b.order)))
          activeLocalStorage ?? localStorage.setItem(`${desktopName}Columns`, JSON.stringify(data.toSorted((a, b) => (a.order - b.order))))
        })
    }
  }, [desktopName])
  // useEffect(() => {
  //   if (localStorage.getItem('styleOfColumns')) setStyleOfColumns(JSON.parse(localStorage.getItem('styleOfColumns')))
  // }, [desktopName])
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0
      }
    })
  )
  const columnsId = useMemo(() => columnsStore.map((col) => col._id), [columnsStore])
  const getLinksIds = (columna) => {
    return linksStore.filter(link => link.idpanel === columna._id).map(link => link._id)
  }

  return (
    <main className={styles.listOfLinks}>
      <SideInfo environment={'listoflinks'}/>
      {
        loading
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
              {columnsStore
                ? (
                    columnsStore.map((columna) => (
                        <Columna key={columna._id} data={{ columna }}>
                          <SortableContext strategy={verticalListSortingStrategy} items={getLinksIds(columna)}>
                            {linksStore.map((link) =>
                              link.idpanel === columna._id
                                ? (<CustomLink key={link._id} data={{ link }} idpanel={columna._id} />)
                                : null
                            ).filter(Boolean)}
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
                      {
                        linksStore.map((link) =>
                          link.idpanel === activeColumn._id
                            ? (<CustomLink key={link._id} data={{ link }} idpanel={activeColumn._id} />)
                            : null
                        )
                      }
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
