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
        const activeLink = event.active.data.current.link

        // Solo reordenar links de la misma categoría
        const categoryId = activeLink?.categoryId
        if (!categoryId) return

        // Filtrar solo los links de la misma categoría
        const categoryLinks = currentLinksState
          .filter(l => l.categoryId === categoryId)
          .sort((a, b) => a.order - b.order)
        const otherLinks = currentLinksState.filter(l => l.categoryId !== categoryId)

        const oldIndex = categoryLinks.findIndex((t) => t._id === active.id)
        const newIndex = categoryLinks.findIndex((t) => t._id === over.id)

        if (oldIndex === -1 || newIndex === -1) return

        // Reordenar dentro de la categoría
        const reorderedCategoryLinks = arrayMove(categoryLinks, oldIndex, newIndex)

        // 🚀 Actualizar el campo order de cada link reordenado
        const updatedCategoryLinks = reorderedCategoryLinks.map((link, index) => ({
          ...link,
          order: index
        }))

        // Combinar con los otros links
        const finalLinks = [...otherLinks, ...updatedCategoryLinks]

        // 🚀 Actualizar tanto el estado global como el interno
        setGlobalLinks(finalLinks)
        setCurrentLinksState(finalLinks)

        // 🚀 Usar el link del array recién reordenado
        const updatedLink = updatedCategoryLinks.find(link => link._id === active.id)
        setMovedLink(updatedLink)
      }
    }

    // Para columnas - reordenar solo las que tienen el mismo parentId
    if (event.active.data.current?.type === 'Column' && over !== null) {
      if (active.id !== over.id) {
        const activeColumn = event.active.data.current.columna
        const overColumn = over.data.current?.columna

        // Solo reordenar si ambas columnas tienen el mismo parentId
        if (activeColumn && overColumn && activeColumn.parentId === overColumn.parentId) {
          // Obtener solo las columnas con el mismo parentId, ordenadas por order
          const siblingColumns = globalColumns
            .filter(col => col.parentId === activeColumn.parentId)
            .sort((a, b) => a.order - b.order)
          const otherColumns = globalColumns.filter(col => col.parentId !== activeColumn.parentId)

          const oldIndex = siblingColumns.findIndex((t) => t._id === active.id)
          const newIndex = siblingColumns.findIndex((t) => t._id === over.id)

          if (oldIndex !== -1 && newIndex !== -1) {
            const reorderedSiblings = arrayMove(siblingColumns, oldIndex, newIndex)

            // 🚀 Actualizar el campo order de cada columna reordenada
            const updatedSiblings = reorderedSiblings.map((col, index) => ({
              ...col,
              order: index
            }))

            // Recombinar con las otras columnas
            setGlobalColumns([...otherColumns, ...updatedSiblings])
            setMovedColumn(activeColumn)
          }
        }
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
    // console.log('cancel')
  }

  function handleDragOver (event) {
    const { active, over } = event

    if (!over) {
      // console.log('no over')
      return
    }

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) {
      // console.log('same')
      return
    }

    const isActiveLink = active.data.current?.type === 'link'
    const isOverALink = over.data.current?.type === 'link'

    if (!isActiveLink) return

    if (isActiveLink && isOverALink) {
      if (active.id !== over.id) {
        const oldIndex = currentLinksState.findIndex((t) => t._id === active.id)
        const newIndex = currentLinksState.findIndex((t) => t._id === over.id)

        if (oldIndex === -1 || newIndex === -1) return

        if (currentLinksState[oldIndex].categoryId !== currentLinksState[newIndex].categoryId) {
          // console.log('other column')

          // 🚀 Actualizar el estado interno de forma inmutable
          const updatedLinksStore = currentLinksState.map((link, index) => {
            if (index === oldIndex) {
              return { ...link, categoryId: currentLinksState[newIndex].categoryId }
            }
            return link
          })

          // 🚀 Actualizar ambos estados
          setCurrentLinksState(updatedLinksStore)
          setGlobalLinks(updatedLinksStore)
        }
      }
    }

    const isOverAColumn = over.data.current?.type === 'Column'

    if (activeLink && isOverAColumn) {
      const oldIndex = currentLinksState.findIndex((t) => t._id === active.id)
      const overColumn = over.data.current?.columna

      // 🚀 Si es una columna virtual, usar el originalCategoryId
      const targetCategoryId = overColumn?.isVirtual
        ? overColumn.originalCategoryId
        : over.id

      const newState = [...currentLinksState]
      newState[oldIndex] = {
        ...newState[oldIndex],
        categoryId: targetCategoryId
      }

      // 🚀 Actualizar ambos estados
      setCurrentLinksState(newState)
      setGlobalLinks(newState)
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

        // console.log('🚀 ~ handleSortItems ~ ids (destino):', ids)
        // console.log('🚀 ~ movedLink.categoryId:', movedLink.categoryId)

        // 🚀 Filtrar y obtener IDs de origen (donde estaba antes el link)
        const originLinks = currentLinks.filter(link => link.categoryId === prevData.categoryId)
        const prevIds = originLinks.map((link, index) => ({
          id: link._id,
          order: index,
          name: link.name,
          categoryId: link.categoryId
        }))

        // console.log('🚀 ~ handleSortItems ~ prevIds (origen):', prevIds)
        // console.log('🚀 ~ prevData.categoryId:', prevData.categoryId)

        // 🚀 Debug adicional
        // console.log('🚀 ~ Son iguales las categorías?:', movedLink.categoryId === prevData.categoryId)
        // console.log('🚀 ~ Número de links en destino:', destinationLinks.length)
        // console.log('🚀 ~ Número de links en origen:', originLinks.length)

        const items = [...ids, ...prevIds]
        // console.log('🚀 ~ handleSortItems ~ items:', items)
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
