import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getLinkById, updateCategory, updateLink } from '../services/dbQueries'
import { handleResponseErrors } from '../services/functions'
import { useGlobalStore } from '../store/global'

export const useDragItems = ({ desktopId }) => {
  const [activeLink, setActiveLink] = useState()
  const [movedLink, setMovedLink] = useState()
  const [movedColumn, setMovedColumn] = useState()
  const [activeColumn, setActiveColumn] = useState()
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)

  // 🚀 Estado interno para mantener sincronización durante el drag
  const [currentLinksState, setCurrentLinksState] = useState(globalLinks)

  // 🚀 Sincronizar estado interno con global cuando cambie
  useEffect(() => {
    setCurrentLinksState(globalLinks)
  }, [globalLinks])

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

    if (event.active.data.current?.type === 'link' && over !== null) {
      if (active.id !== over.id) {
        const oldIndex = currentLinksState.findIndex((t) => t._id === active.id)
        const newIndex = currentLinksState.findIndex((t) => t._id === over.id)

        // 🚀 Usar el estado interno actualizado para el reordenamiento
        const reorderedLinks = arrayMove(currentLinksState, oldIndex, newIndex)

        // 🚀 Actualizar tanto el estado global como el interno
        setGlobalLinks(reorderedLinks)
        setCurrentLinksState(reorderedLinks)

        // 🚀 Usar el link del array recién reordenado
        const updatedLink = reorderedLinks.find(link => link._id === active.id)
        setMovedLink(updatedLink)
      }
    }

    // Para columnas, mantener igual
    if (event.active.data.current?.type === 'Column' && over !== null) {
      if (active.id !== over.id) {
        const oldIndex = globalColumns.findIndex((t) => t._id === active.id)
        const newIndex = globalColumns.findIndex((t) => t._id === over.id)
        setGlobalColumns(arrayMove(globalColumns, oldIndex, newIndex))
        setMovedColumn(activeColumn)
      }
    }

    setActiveLink(null)
    setActiveColumn(null)
  }

  function handleDragCancel () {
    setActiveLink(null)
    setActiveColumn(null)
    // 🚀 Restaurar estado interno al estado global
    setCurrentLinksState(globalLinks)
    setGlobalColumns(globalColumns)
    setGlobalLinks(globalLinks)
    console.log('cancel')
  }

  function handleDragOver (event) {
    const { active, over } = event

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

    const isActiveLink = active.data.current?.type === 'link'
    const isOverALink = over.data.current?.type === 'link'

    if (!isActiveLink) return

    if (isActiveLink && isOverALink) {
      if (active.id !== over.id) {
        const oldIndex = currentLinksState.findIndex((t) => t._id === active.id)
        const newIndex = currentLinksState.findIndex((t) => t._id === over.id)

        if (currentLinksState[oldIndex].categoryId !== currentLinksState[newIndex].categoryId) {
          console.log('other column')

          // 🚀 Actualizar el estado interno directamente
          const updatedLinksStore = [...currentLinksState]
          updatedLinksStore[oldIndex].categoryId = currentLinksState[newIndex].categoryId

          // 🚀 Actualizar ambos estados
          setCurrentLinksState(updatedLinksStore)
          setGlobalLinks(updatedLinksStore)
        }
      }
    }

    const isOverAColumn = over.data.current?.type === 'Column'

    if (activeLink && isOverAColumn) {
      const oldIndex = currentLinksState.findIndex((t) => t._id === active.id)
      const newState = [...currentLinksState]
      newState[oldIndex].categoryId = over.id

      // 🚀 No necesitas arrayMove aquí, solo cambiar categoría
      const updatedState = newState

      // 🚀 Actualizar ambos estados
      setCurrentLinksState(updatedState)
      setGlobalLinks(updatedState)
    }
  }

  const handleSortItems = async () => {
    if (movedLink) {
      try {
        // 🚩 Obtén prevData ANTES de calcular los arrays
        const { data: prevData } = await getLinkById({ id: movedLink._id })

        // 🚀 Usar el estado interno que está sincronizado
        const currentLinks = currentLinksState

        // 🚀 Filtrar y obtener IDs de destino (donde está ahora el link)
        const destinationLinks = currentLinks.filter(link => link.categoryId === movedLink.categoryId)
        const ids = destinationLinks.map((link, index) => ({
          id: link._id,
          order: index,
          name: link.name,
          categoryId: link.categoryId
        }))

        console.log('🚀 ~ handleSortItems ~ ids (destino):', ids)
        console.log('🚀 ~ movedLink.categoryId:', movedLink.categoryId)

        // 🚀 Filtrar y obtener IDs de origen (donde estaba antes el link)
        const originLinks = currentLinks.filter(link => link.categoryId === prevData.categoryId)
        const prevIds = originLinks.map((link, index) => ({
          id: link._id,
          order: index,
          name: link.name,
          categoryId: link.categoryId
        }))

        console.log('🚀 ~ handleSortItems ~ prevIds (origen):', prevIds)
        console.log('🚀 ~ prevData.categoryId:', prevData.categoryId)

        // 🚀 Debug adicional
        console.log('🚀 ~ Son iguales las categorías?:', movedLink.categoryId === prevData.categoryId)
        console.log('🚀 ~ Número de links en destino:', destinationLinks.length)
        console.log('🚀 ~ Número de links en origen:', originLinks.length)

        const items = [...ids, ...prevIds]
        console.log('🚀 ~ handleSortItems ~ items:', items)
        const response = await updateLink({ items })

        const { hasError, message } = handleResponseErrors(response)
        if (hasError) {
          toast(message)
        }
      } catch (error) {
        console.error('Error en handleSortItems:', error)
        toast('Error al actualizar el link')
      }
    }

    if (movedColumn) {
      try {
        const items = globalColumns.filter(col => col.parentId === desktopId).map((col, index) => ({
          id: col._id,
          order: index,
          name: col.name,
          parentId: desktopId
        }))
        const response = await updateCategory({ items })
        const { hasError, message } = handleResponseErrors(response)
        if (hasError) {
          toast(message)
        }
      } catch (error) {
        console.error('Error en handleSortItems para columnas:', error)
        toast('Error al actualizar las columnas')
      }
    }
  }

  // 🚀 Efectos separados para mejor control
  useEffect(() => {
    if (movedLink) {
      handleSortItems().finally(() => {
        setMovedLink(null)
      })
    }
  }, [movedLink])

  useEffect(() => {
    if (movedColumn) {
      handleSortItems().finally(() => {
        setMovedColumn(null)
      })
    }
  }, [movedColumn])

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    activeLink,
    activeColumn
  }
}
