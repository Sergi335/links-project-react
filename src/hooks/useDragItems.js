import { useState, useRef, useEffect } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { moveLink, getLinkById, editColumn } from '../services/dbQueries'
import { handleResponseErrors } from '../services/functions'
import { toast } from 'react-toastify'
import { useGlobalStore } from '../store/global'

export const useDragItems = ({ desktopName }) => {
  const [activeLink, setActiveLink] = useState()
  const [movedLink, setMovedLink] = useState()
  const [movedColumn, setMovedColumn] = useState()
  const [activeColumn, setActiveColumn] = useState()
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)

  function handleDragStart (event) {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.columna)
    }
    if (event.active.data.current?.type === 'link') {
      setActiveLink(event.active.data.current.link)
    }
  }
  const updateLinksStore = useRef(setGlobalLinks) // el truco del almendruco actualiza el estado sin renderizar
  function handleDragEnd (event) {
    const { active, over } = event
    if (event.active.data.current?.type === 'link') {
      if (active.id !== over.id) {
        const oldIndex = globalLinks.findIndex((t) => t._id === active.id)
        const newIndex = globalLinks.findIndex((t) => t._id === over.id)
        setGlobalLinks(arrayMove(globalLinks, oldIndex, newIndex))
        setMovedLink(activeLink)
      }
    }
    if (event.active.data.current?.type === 'Column') {
      if (active.id !== over.id) {
        const oldIndex = globalColumns.findIndex((t) => t._id === active.id)
        const newIndex = globalColumns.findIndex((t) => t._id === over.id)
        console.log(active)
        setGlobalColumns(arrayMove(globalColumns, oldIndex, newIndex))
        setMovedColumn(activeColumn)
      }
    }
    setActiveLink(null)
    setActiveColumn(null)
  }

  function handleDragOver (event) {
    const { active, over } = event
    if (active.data.current?.type === 'link') {
      if (active.id !== over.id) {
        const oldIndex = globalLinks.findIndex((t) => t._id === active.id)
        const newIndex = globalLinks.findIndex((t) => t._id === over.id)
        if (globalLinks[oldIndex].idpanel !== globalLinks[newIndex].idpanel) {
          const updatedLinksStore = [...globalLinks]
          updatedLinksStore[oldIndex].idpanel = globalLinks[newIndex].idpanel
          updatedLinksStore[oldIndex].panel = globalLinks[newIndex].panel
          updateLinksStore.current(updatedLinksStore)
        }
      }
    }
  }
  const handleSortItems = async () => {
    if (movedLink) {
      const prevData = await getLinkById({ id: movedLink._id })
      console.log('🚀 ~ file: useDragItems.js:71 ~ handleSortItems ~ prevData:', prevData)
      const ids = globalLinks.filter(link => link.idpanel === movedLink.idpanel).map(link => link._id)
      const body = {
        id: movedLink._id,
        idpanelOrigen: prevData.idpanel,
        destinyIds: ids,
        fields: {
          idpanel: movedLink.idpanel, // se ha actualizado en handledragover
          panel: movedLink.panel // no tenemos el destino
        }
      }
      const response = await moveLink(body)
      const { hasError, message } = handleResponseErrors(response)
      if (hasError) {
        toast(message)
        // return
      }
      // si no está activo el local storage, no hace falta hacer el fetch
      // const [, linksData] = await getDataForDesktops(desktopName)
      // activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(linksData.toSorted((a, b) => (a.orden - b.orden))))
    }
    if (movedColumn) {
      const ids = globalColumns.map(col => col._id)
      const response = await editColumn({ columnsIds: ids, newDesktop: desktopName })
      const { hasError, message } = handleResponseErrors(response)
      if (hasError) {
        toast(message)
        // return
      }
      // const [columnsData] = await getDataForDesktops(desktopName)
      // activeLocalStorage ?? localStorage.setItem(`${desktopName}Columns`, JSON.stringify(columnsData.toSorted((a, b) => (a.orden - b.orden))))
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
