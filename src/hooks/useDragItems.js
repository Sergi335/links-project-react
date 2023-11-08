import { useState, useRef, useEffect } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { moveColumns, moveLinks, getDataForDesktops } from '../services/dbQueries'
import { useLinksStore } from '../store/links'
import { useColumnsStore } from '../store/columns'
import { usePreferencesStore } from '../store/preferences'

export const useDragItems = ({ desktopName }) => {
  const [activeLink, setActiveLink] = useState()
  const [movedLink, setMovedLink] = useState()
  const [movedColumn, setMovedColumn] = useState()
  const [activeColumn, setActiveColumn] = useState()
  const setLinksStore = useLinksStore(state => state.setLinksStore)
  const linksStore = useLinksStore(state => state.linksStore)
  const columnsStore = useColumnsStore(state => state.columnsStore)
  const setColumnsStore = useColumnsStore(state => state.setColumnsStore)
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)

  function handleDragStart (event) {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.columna)
    }
    if (event.active.data.current?.type === 'link') {
      setActiveLink(event.active.data.current.link)
    }
  }
  function handleDragEnd (event) {
    const { active, over } = event
    if (event.active.data.current?.type === 'link') {
      if (active.id !== over.id) {
        const oldIndex = linksStore.findIndex((t) => t._id === active.id)
        const newIndex = linksStore.findIndex((t) => t._id === over.id)

        setLinksStore(arrayMove(linksStore, oldIndex, newIndex))
        setMovedLink(activeLink)
      }
    }
    if (event.active.data.current?.type === 'Column') {
      if (active.id !== over.id) {
        const oldIndex = columnsStore.findIndex((t) => t._id === active.id)
        const newIndex = columnsStore.findIndex((t) => t._id === over.id)
        console.log(active)
        setColumnsStore(arrayMove(columnsStore, oldIndex, newIndex))
        setMovedColumn(activeColumn)
      }
    }
    setActiveLink(null)
    setActiveColumn(null)
  }
  const updateLinksStore = useRef(setLinksStore) // el truco del almendruco actualiza el estado sin renderizar

  function handleDragOver (event) {
    const { active, over } = event
    if (active.data.current?.type === 'link') {
      if (active.id !== over.id) {
        const oldIndex = linksStore.findIndex((t) => t._id === active.id)
        const newIndex = linksStore.findIndex((t) => t._id === over.id)
        if (linksStore[oldIndex].idpanel !== linksStore[newIndex].idpanel) {
          const updatedLinksStore = [...linksStore]
          updatedLinksStore[oldIndex].idpanel = linksStore[newIndex].idpanel
          updateLinksStore.current(updatedLinksStore)
        }
      }
    }
  }
  const handleSortItems = async () => {
    if (movedLink) {
      const ids = linksStore.filter(link => link.idpanel === movedLink.idpanel).map(link => link._id)
      await moveLinks(movedLink._id, ids, desktopName, movedLink.idpanel)
      const [, linksData] = await getDataForDesktops(desktopName)
      activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(linksData.toSorted((a, b) => (a.orden - b.orden))))
    }
    if (movedColumn) {
      const ids = columnsStore.map(col => col._id)
      await moveColumns(ids, desktopName)
      const [columnsData] = await getDataForDesktops(desktopName)
      activeLocalStorage ?? localStorage.setItem(`${desktopName}Columns`, JSON.stringify(columnsData.toSorted((a, b) => (a.orden - b.orden))))
    }
  }
  useEffect(() => {
    if (movedLink) {
      setMovedLink(null)
      handleSortItems()
    }
    if (movedColumn) {
      setMovedColumn(null)
      handleSortItems()
    }
  }, [movedLink, movedColumn])

  return { handleDragStart, handleDragOver, handleDragEnd, activeLink, activeColumn }
}
