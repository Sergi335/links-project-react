import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { editColumn, getLinkById, moveLink } from '../services/dbQueries'
import { handleResponseErrors } from '../services/functions'
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
  const updateLinksStore = useRef(setGlobalLinks) // el truco del almendruco actualiza el estado sin renderizar

  // console.log({ activeLink, activeColumn, movedLink, movedColumn, globalLinks, globalColumns, desktopName })
  const handleDragStart = useCallback((event) => {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.columna)
    }
    if (event.active.data.current?.type === 'link') {
      setActiveLink(event.active.data.current.link)
    }
  }, [])
  function handleDragEnd (event) {
    const { active, over } = event
    console.log(active.data.current?.type, over?.data.current?.type)
    if (event.active.data.current?.type === 'link' && over !== null) {
      if (active.id !== over.id) {
        const oldIndex = globalLinks.findIndex((t) => t._id === active.id)
        const newIndex = globalLinks.findIndex((t) => t._id === over.id)
        setGlobalLinks(arrayMove(globalLinks, oldIndex, newIndex))
        console.log(activeLink)
        setMovedLink(activeLink)
      }
    }
    if (event.active.data.current?.type === 'Column' && over !== null) {
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
    console.log('end')
  }
  function handleDragCancel () {
    setActiveLink(null)
    setActiveColumn(null)
    setGlobalColumns(globalColumns)
    setGlobalLinks(globalLinks)
    console.log('cancel')
  }
  function handleDragOver (event) {
    const { active, over } = event
    // console.log('🚀 ~ handleDragOver ~ over:', over)
    // console.log('🚀 ~ handleDragOver ~ active:', active)

    // --- NUEVO ---
    if (!over) {
      console.log('no over')
      return
    }
    const activeId = active.id
    const overId = over.id

    if (activeId === overId) {
      console.log('same')
      return
    }
    // -- NUEVO ---

    const isActiveLink = active.data.current?.type === 'link'
    const isOverALink = over.data.current?.type === 'link'

    if (!isActiveLink) return

    if (isActiveLink && isOverALink) {
      if (active.id !== over.id) {
        const oldIndex = globalLinks.findIndex((t) => t._id === active.id)
        const newIndex = globalLinks.findIndex((t) => t._id === over.id)
        if (globalLinks[oldIndex].idpanel !== globalLinks[newIndex].idpanel) {
          console.log('other column')
          // console.log(globalLinks[oldIndex].idpanel)
          // console.log(globalLinks[newIndex].idpanel)
          const updatedLinksStore = [...globalLinks]
          updatedLinksStore[oldIndex].idpanel = globalLinks[newIndex].idpanel
          updatedLinksStore[oldIndex].panel = globalLinks[newIndex].panel
          updateLinksStore.current(updatedLinksStore)
        }
      }
    }

    const isOverAColumn = over.data.current?.type === 'Column'
    // Im dropping a Task over a column
    if (activeLink && isOverAColumn) {
      const oldIndex = globalLinks.findIndex((t) => t._id === active.id)
      const newState = [...globalLinks]
      newState[oldIndex].idpanel = over.id // ojo no solo cambiar el idpanel, sino también el panel
      newState[oldIndex].panel = over.data.current.columna.name
      setGlobalLinks(arrayMove(newState, oldIndex, oldIndex))
      setMovedLink(activeLink)
    }
  }
  const handleSortItems = async () => {
    if (movedLink) {
      const prevData = await getLinkById({ id: movedLink._id })
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

  return { handleDragStart, handleDragOver, handleDragEnd, handleDragCancel, activeLink, activeColumn }
}
