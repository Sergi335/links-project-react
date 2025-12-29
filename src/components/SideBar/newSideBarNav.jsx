import { useOverlayScrollbars } from 'overlayscrollbars-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useStyles } from '../../hooks/useStyles'
import { updateDbAfterDrag } from '../../services/dbQueries'
import { useGlobalStore } from '../../store/global'
import { buildTree, flattenDesktop, updateNodeProperties } from '../../utils/dragDropUtils'
import { ArrowDown } from '../Icons/icons'
import styles from './SideBar.module.css'

function NavLinkIgnoraId ({ to, children, viewTransition, draggable, onDragStart, onDragOver, onDragLeave, onDrop, isActivePath }) {
  const location = useLocation()

  const currentSegments = location.pathname.split('/').filter(Boolean)
  const targetSegments = to.split('/').filter(Boolean)

  let isActive = false

  if (targetSegments.length > 0) {
    // Si el último segmento del target parece un ID (ej: 24 caracteres hex)
    const looksLikeId = /^[a-f0-9]{8,}$/i.test(targetSegments.at(-1))

    if (looksLikeId) {
      // Comparar todo excepto el último segmento
      isActive =
        currentSegments.slice(0, -1).join('/') ===
        targetSegments.slice(0, -1).join('/')
    } else {
      // Comparar la ruta completa
      isActive = currentSegments.join('/') === targetSegments.join('/')
    }
  }

  // Aplicamos la clase active si es la ruta directa O si es parte de la rama activa
  const activeClass = (isActive || isActivePath) ? `${styles.active}` : ''

  return (
    <NavLink to={to} className={activeClass} viewTransition={viewTransition} draggable={draggable} onDragStart={onDragStart} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      {children}
    </NavLink>
  )
}

const MultiLevelDragDrop = () => {
  const [items, setItems] = useState([])
  const [activePathIds, setActivePathIds] = useState([])
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const sidebarCollapseSignal = useGlobalStore(state => state.sidebarCollapseSignal)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH
  const { theme } = useStyles()
  const [initialize] = useOverlayScrollbars({ options: { scrollbars: { theme: `os-theme-${theme}`, autoHide: 'true' } } })
  const listRef = useRef(null)
  // const { desktopName, slug } = useParams()

  // 🔧 Función para extraer el estado expanded del árbol actual
  const getExpandedState = (items) => {
    const expandedMap = new Map()

    const extractExpanded = (currentItems) => {
      currentItems.forEach(item => {
        if (item.expanded) {
          expandedMap.set(item._id, true)
        }
        if (item.children) {
          extractExpanded(item.children)
        }
      })
    }

    extractExpanded(items)
    return expandedMap
  }
  // Cuando subimos una categoría que no tiene subcategorías, de nivel 1 a 0, no encuentra columnas
  // que mostrar y no se muestran los links

  // 🔧 Función para aplicar el estado expanded a un árbol
  const applyExpandedState = (items, expandedMap) => {
    return items.map(item => ({
      ...item,
      expanded: expandedMap.has(item._id),
      children: item.children ? applyExpandedState(item.children, expandedMap) : item.children
    }))
  }

  useEffect(() => {
    initialize({ target: listRef.current })
  }, [initialize])

  // 🔧 Función para encontrar los IDs de los ancestros según el path actual
  const getAncestorIds = (columns, pathname) => {
    const segments = pathname.split('/').filter(Boolean)
    // El slug de la categoría suele ser el segundo o tercer segmento dependiendo de la ruta
    // /app/escritorio/categoria o /app/escritorio/categoria/linkId
    // Buscamos si algún segmento coincide con un slug de columna
    const activeColumn = columns.find(col => segments.includes(col.slug))
    if (!activeColumn) return []

    const ancestors = []
    let current = activeColumn
    while (current && current.parentId) {
      ancestors.push(current.parentId)
      current = columns.find(col => col._id === current.parentId)
      if (current) ancestors.push(current._id) // Añadimos también el actual si es que tiene hijos para expandirlo
    }
    // Añadimos el ID de la columna activa por si tiene subcategorías que deba mostrar (opcional)
    ancestors.push(activeColumn._id)

    return [...new Set(ancestors)]
  }

  const { pathname } = useLocation()
  const lastCollapseSignal = useRef(sidebarCollapseSignal)

  // ✅ Modificar el useEffect para preservar el estado expanded Y abrir el path actual
  useEffect(() => {
    // 1. Guardar el estado expanded actual (interacción del usuario)
    // Pero si la señal de colapso ha cambiado, ignoramos el estado previo
    const isCollapseTriggered = lastCollapseSignal.current !== sidebarCollapseSignal
    const expandedState = isCollapseTriggered ? new Map() : getExpandedState(items)

    if (isCollapseTriggered) {
      lastCollapseSignal.current = sidebarCollapseSignal
    }

    // 2. Obtener IDs que deben estar abiertos por la URL
    const pathIds = getAncestorIds(globalColumns, pathname)
    setActivePathIds(pathIds)

    // 3. Mezclar ambos
    pathIds.forEach(id => expandedState.set(id, true))

    const tree = buildTree(globalColumns)
    const treeWithProperties = updateNodeProperties(tree)

    // 4. Restaurar el estado expanded mezclado
    const treeWithExpanded = applyExpandedState(treeWithProperties, expandedState)

    setItems(treeWithExpanded)
  }, [globalColumns, pathname, sidebarCollapseSignal])

  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverItem, setDragOverItem] = useState(null)

  const findItemAndParent = (items, itemId, parent = null) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i]._id === itemId) {
        return { item: items[i], parent, index: i }
      }
      if (items[i].children) {
        const result = findItemAndParent(items[i].children, itemId, items[i])
        if (result) return result
      }
    }
    return null
  }

  const removeItem = (items, itemId) => {
    return items.filter(item => {
      if (item._id === itemId) return false
      if (item.children) {
        item.children = removeItem(item.children, itemId)
      }
      return true
    })
  }

  const insertItem = (items, targetId, itemToInsert) => {
    return items.map(item => {
      if (item._id === targetId) {
        return {
          ...item,
          children: [...(item.children || []), itemToInsert],
          expanded: true
        }
      }
      if (item.children) {
        return {
          ...item,
          children: insertItem(item.children, targetId, itemToInsert)
        }
      }
      return item
    })
  }

  const insertAtIndex = (items, parentId, index, itemToInsert) => {
    if (!parentId) {
      const newItems = [...items]
      newItems.splice(index, 0, itemToInsert)
      return newItems
    }

    return items.map(item => {
      if (item._id === parentId) {
        const newChildren = [...(item.children || [])]
        newChildren.splice(index, 0, itemToInsert)
        return { ...item, children: newChildren }
      }
      if (item.children) {
        return {
          ...item,
          children: insertAtIndex(item.children, parentId, index, itemToInsert)
        }
      }
      return item
    })
  }

  const handleDragStart = (e, item) => {
    if (item.expanded) item.expanded = false
    setDraggedItem(item)
    e.dataTransfer.setData('text/plain', item._id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, targetItem, position) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverItem({ id: targetItem._id, position })
  }

  const handleDragLeave = () => {
    setDragOverItem(null)
  }

  // ✅ El handleDrop modificado para preservar el estado expanded
  const handleDrop = async (e, targetItem, position) => {
    e.preventDefault()
    e.stopPropagation()

    if (!draggedItem || draggedItem._id === targetItem._id) {
      setDragOverItem(null)
      return
    }

    // Guardamos el estado original para rollback Y el estado expanded
    const originalItems = [...items]
    // const currentExpandedState = getExpandedState(items)

    try {
      const sourceData = findItemAndParent(items, draggedItem._id)
      if (!sourceData) return

      console.log('📍 Datos fuente:', {
        item: { id: sourceData.item._id, name: sourceData.item.name },
        parent: sourceData.parent ? { id: sourceData.parent._id, name: sourceData.parent.name } : null,
        index: sourceData.index
      })

      let tempItems = removeItem(items, draggedItem._id)
      const isNestingOperation = position === 'inside'

      if (isNestingOperation) {
        tempItems = insertItem(tempItems, targetItem._id, sourceData.item)
      } else {
        const targetData = findItemAndParent(tempItems, targetItem._id)
        if (targetData) {
          const insertIndex = position === 'after' ? targetData.index + 1 : targetData.index
          const parentId = targetData.parent ? targetData.parent._id : null

          console.log('📍 Inserción en:', {
            insertIndex,
            parentId: parentId || 'ROOT',
            position
          })

          tempItems = insertAtIndex(tempItems, parentId, insertIndex, sourceData.item)
        }
      }

      // Actualiza level, parentId y order en toda la estructura
      const finalItems = updateNodeProperties(tempItems)

      // Actualizar el estado local
      setItems(finalItems)
      setDraggedItem(null)
      setDragOverItem(null)

      // 🔄 Enviar cambios al backend según el tipo de operación
      const flatOriginal = originalItems.map(item => flattenDesktop(item)).flat()
      const flatFinal = finalItems.map(item => flattenDesktop(item)).flat()

      // 🔍 DEBUG: Añadir estos logs
      console.log('🔍 ANÁLISIS DE OPERACIÓN:')
      console.log('draggedItem:', {
        id: draggedItem._id,
        name: draggedItem.name,
        level: draggedItem.level,
        parentId: draggedItem.parentId
      })
      console.log('targetItem:', targetItem
        ? {
            id: targetItem._id,
            name: targetItem.name,
            level: targetItem.level,
            parentId: targetItem.parentId
          }
        : 'null')
      console.log('position:', position)
      console.log('isNestingOperation:', isNestingOperation)

      // Buscar estados original y final
      const draggedOriginalState = flatOriginal.find(item => item._id === draggedItem._id)
      const draggedFinalState = flatFinal.find(item => item._id === draggedItem._id)

      console.log('🔍 COMPARACIÓN DE ESTADOS:')
      console.log('Original:', draggedOriginalState
        ? {
            level: draggedOriginalState.level,
            order: draggedOriginalState.order,
            parentId: draggedOriginalState.parentId
          }
        : 'not found')
      console.log('Final:', draggedFinalState
        ? {
            level: draggedFinalState.level,
            order: draggedFinalState.order,
            parentId: draggedFinalState.parentId
          }
        : 'not found')

      if (isNestingOperation) {
        console.log('🔄 EJECUTANDO FLUJO DE ANIDAMIENTO')
        if (draggedFinalState) {
          await updateDbAfterDrag(draggedFinalState)
        }
      } else {
        console.log('🔄 EJECUTANDO FLUJO DE REORDENAMIENTO')

        const draggedOriginalState = flatOriginal.find(item => item._id === draggedItem._id)
        const draggedFinalState = flatFinal.find(item => item._id === draggedItem._id)

        if (draggedFinalState) {
          // 🚀 NUEVA LÓGICA: Incluir hermanos Y descendientes
          const affectedParentIds = new Set()
          const affectedDescendantIds = new Set()

          if (draggedOriginalState) {
            // Añadir niveles de hermanos (origen y destino)
            affectedParentIds.add(draggedOriginalState.parentId)
            affectedParentIds.add(draggedFinalState.parentId)

            // 🚀 NUEVO: Añadir todos los descendientes de la categoría movida
            const getDescendants = (itemId, flatList) => {
              const descendants = []
              const addDescendants = (parentId) => {
                const children = flatList.filter(item => item.parentId === parentId)
                children.forEach(child => {
                  descendants.push(child._id)
                  affectedDescendantIds.add(child._id)
                  addDescendants(child._id) // Recursivo para nietos, bisnietos, etc.
                })
              }
              addDescendants(itemId)
              return descendants
            }

            // Obtener descendientes del estado original y final
            getDescendants(draggedItem._id, flatOriginal)
            getDescendants(draggedItem._id, flatFinal)
          } else {
            affectedParentIds.add(draggedFinalState.parentId)
          }

          console.log('🔍 Niveles hermanos afectados:', Array.from(affectedParentIds))
          console.log('🔍 Descendientes afectados:', Array.from(affectedDescendantIds))

          // 🚀 CAMBIO: Recopilar hermanos + descendientes + el item movido
          let allItemsToUpdate = []

          // 1. Hermanos de niveles afectados
          for (const parentId of affectedParentIds) {
            const allSiblingsInFinal = flatFinal.filter(item => item.parentId === parentId)
            allItemsToUpdate = [...allItemsToUpdate, ...allSiblingsInFinal]
          }

          // 2. Todos los descendientes (que cambiaron de nivel)
          for (const descendantId of affectedDescendantIds) {
            const descendantInFinal = flatFinal.find(item => item._id === descendantId)
            if (descendantInFinal) {
              allItemsToUpdate.push(descendantInFinal)
            }
          }

          // 3. La categoría movida (si no está ya incluida)
          if (!allItemsToUpdate.find(item => item._id === draggedFinalState._id)) {
            allItemsToUpdate.push(draggedFinalState)
          }

          // 🚀 Eliminar duplicados por ID
          const uniqueItemsToUpdate = allItemsToUpdate.filter((item, index, self) =>
            index === self.findIndex(t => t._id === item._id)
          )

          console.log('🔍 TODOS los items a actualizar (hermanos + descendientes):', uniqueItemsToUpdate.map(item => ({
            id: item._id,
            name: item.name,
            newOrder: item.order,
            newLevel: item.level,
            newParentId: item.parentId
          })))

          // 🚀 Verificar que realmente hay cambios comparando con estado original
          const itemsWithRealChanges = uniqueItemsToUpdate.filter(finalItem => {
            const originalItem = flatOriginal.find(orig => orig._id === finalItem._id)

            if (!originalItem) {
              console.log(`📍 ${finalItem.name} es nuevo/movido`)
              return true
            }

            const hasChanges = (
              originalItem.order !== finalItem.order ||
              originalItem.level !== finalItem.level ||
              originalItem.parentId !== finalItem.parentId ||
              originalItem.parentSlug !== finalItem.parentSlug // 🚀 AÑADIR parentSlug
            )

            if (hasChanges) {
              console.log(`📍 ${finalItem.name} cambió:`, {
                order: `${originalItem.order} → ${finalItem.order}`,
                level: `${originalItem.level} → ${finalItem.level}`,
                parentId: `${originalItem.parentId} → ${finalItem.parentId}`,
                parentSlug: `${originalItem.parentSlug} → ${finalItem.parentSlug}` // 🚀 LOG parentSlug
              })
            }

            return hasChanges
          })

          console.log('🔍 Items con cambios REALES:', itemsWithRealChanges.length)

          // 🚀 LOG DETALLADO: Verificar valores null para nivel 0
          itemsWithRealChanges.forEach(item => {
            if (item.level === 0) {
              console.log(`🔍 Item nivel 0 - ${item.name}:`, {
                parentId: item.parentId,
                parentSlug: item.parentSlug,
                level: item.level
              })

              // 🚨 VERIFICACIÓN CRÍTICA
              if (item.parentId !== null || item.parentSlug !== null) {
                console.error(`❌ ERROR: Item ${item.name} nivel 0 no tiene parentId/parentSlug null!`)
              }
            }
          })

          if (itemsWithRealChanges.length > 0) {
            console.log('✅ Enviando actualización al backend')
            const result = await updateDbAfterDrag(itemsWithRealChanges)
            console.log('✅ Resultado:', result)
          } else {
            console.log('ℹ️ No hay cambios reales para enviar')
          }
        }
      }

      // ✅ Actualizar store global
      console.log('🔄 Actualizando store global')
      setGlobalColumns(flatFinal)
    } catch (error) {
      console.error('Error durante el drop:', error)
      // ❌ NO actualizar store global en caso de error
      setItems([...originalItems]) // Solo rollback local
      setDraggedItem(null)
      setDragOverItem(null)
    }
  }

  const toggleExpand = (itemId) => {
    const toggleInItems = (currentItems) => {
      return currentItems.map(item => {
        if (item._id === itemId) {
          return { ...item, expanded: !item.expanded }
        }
        if (item.children) {
          return { ...item, children: toggleInItems(item.children) }
        }
        return item
      })
    }
    setItems(toggleInItems(items))
  }

  const renderItem = (item) => {
    const isDragOver = dragOverItem?.id === item._id
    const className = `${isDragOver && dragOverItem.position === 'before' ? styles.drag_to_top : ''} ${isDragOver && dragOverItem.position === 'after' ? styles.drag_to_bottom : ''} ${isDragOver && dragOverItem.position === 'inside' ? styles.drag_over : ''}`
    const firstColumnLink = globalLinks.filter(link => link.categoryId === item._id).toSorted((a, b) => a.order - b.order)[0]

    return (
      <li key={item._id} data-order={item.order} className={className} data-id={item._id} data-level={item.level}>
        <NavLinkIgnoraId
            // to={`${rootPath}${basePath}/${item.slug}`}
            to={item.level === 0 ? `${rootPath}${basePath}/${item.slug}` : `${rootPath}${basePath}/${item.parentSlug}/${item.slug}/${firstColumnLink?._id}`}
            // className={({ isActive }) => isActive ? styles.active : ''}
            viewTransition
            draggable
            isActivePath={activePathIds.includes(item._id)}
            onDragStart={(e) => handleDragStart(e, item)}
            onDragOver={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const y = e.clientY - rect.top
              const height = rect.height

              if (y > height * 0.25 && y < height * 0.75) {
                handleDragOver(e, item, 'inside')
              } else if (y < height * 0.5) {
                handleDragOver(e, item, 'before')
              } else {
                handleDragOver(e, item, 'after')
              }
            }}
          onDragLeave={handleDragLeave}
          onDrop={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const y = e.clientY - rect.top
            const height = rect.height

            if (y > height * 0.25 && y < height * 0.75) {
              handleDrop(e, item, 'inside')
            } else if (y < height * 0.5) {
              handleDrop(e, item, 'before')
            } else {
              handleDrop(e, item, 'after')
            }
          }
            }>
            {/* <GripVertical className={styles.grab_icon} /> */}
            {/* <Folder className="w-5 h-5 text-blue-600" /> */}
            {item.name}
              {
                item.children && item.children.length > 0 && (
                  <button
                      onClick={(e) => {
                        e.preventDefault() // ✅ Evita que el click se propague al NavLink padre
                        toggleExpand(item._id)
                      }}
                      className="p-0.5 hover:bg-gray-200 rounded"
                  >
                  <ArrowDown className={item.expanded ? `${styles.plus_icon_opened} ${styles.plus_icon}` : styles.plus_icon} />
            </button>
                )
              }

        </NavLinkIgnoraId>
        {item.expanded && item.children && (
          <ul>
            {item.children.map(child => renderItem(child))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <nav className={styles.nav} ref={listRef}>
      <ul className={styles.nav_first_level_ul}>
        {items.filter(item => !item.hidden).map(item => renderItem(item)).toSorted((a, b) => a.order - b.order)}
      </ul>
    </nav>
  )
}

export default MultiLevelDragDrop
