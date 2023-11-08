import { useParams } from 'react-router-dom'
import { useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { DndContext, useSensor, useSensors, PointerSensor, closestCorners, DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable'
import { useColumns } from '../hooks/useColumns'
import Columna from './Column'
import CustomLink from './customlink'
import SideInfo from './SideInfo'
import FormsContainer from './FormsContainer'
// import AppLayout from './Pages/AppLayout'
import { useLinksStore } from '../store/links'
import { useColumnsStore } from '../store/columns'
import { usePreferencesStore } from '../store/preferences'
import { useDragItems } from '../hooks/useDragItems'

export default function ListOfLinks () {
  const { desktopName } = useParams()
  const { loading } = useColumns({ desktopName })
  const setLinksStore = useLinksStore(state => state.setLinksStore)
  const linksStore = useLinksStore(state => state.linksStore)
  const columnsStore = useColumnsStore(state => state.columnsStore)
  const setColumnsStore = useColumnsStore(state => state.setColumnsStore)
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const storageLinks = JSON.parse(localStorage.getItem(`${desktopName}links`))
  const storageColumns = JSON.parse(localStorage.getItem(`${desktopName}Columns`))
  const { handleDragStart, handleDragOver, handleDragEnd, activeLink, activeColumn } = useDragItems({ desktopName })

  useEffect(() => {
    if (storageLinks && storageLinks?.length > 0) {
      setLinksStore(storageLinks)
    } else {
      fetch(`http://localhost:3003/api/links/desktop/${desktopName}`)
        .then(res => res.json())
        .then(data => {
          setLinksStore(data.toSorted((a, b) => (a.orden - b.orden)))
          activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(data.toSorted((a, b) => (a.orden - b.orden))))
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
    <main>
      <SideInfo />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext strategy={rectSortingStrategy} items={columnsId}>
        {loading
          ? (
          <p>Cargando ...</p>
            )
          : columnsStore
            ? (
                columnsStore.map((columna) => (
                  <Columna key={columna._id} data={{ columna }}>
                    <SortableContext strategy={verticalListSortingStrategy} items={getLinksIds(columna)}>
                      {linksStore.map((link) =>
                        link.idpanel === columna._id
                          ? (<CustomLink key={link._id} data={{ link }} idpanel={columna._id} />)
                          : null
                      )}
                    </SortableContext>
                  </Columna>
                ))
              )
            : (
                <div>Cargando Columnas...</div>
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
      <FormsContainer />
    </main>
  )
}
