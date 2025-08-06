import { useOverlayScrollbars } from 'overlayscrollbars-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useStyles } from '../../hooks/useStyles'
import { updateDbAfterDrag } from '../../services/dbQueries'
import { useGlobalStore } from '../../store/global'
import { buildTree, flattenDesktop, getChangedItemsForParent, updateNodeProperties } from '../../utils/dragDropUtils'
import { ArrowDown } from '../Icons/icons'
import styles from './SideBar.module.css'

const MultiLevelDragDrop = () => {
  const [items, setItems] = useState([])
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH
  const { theme } = useStyles()
  const [initialize] = useOverlayScrollbars({ options: { scrollbars: { theme: `os-theme-${theme}`, autoHide: 'true' } } })
  const listRef = useRef(null)

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

  // ✅ Modificar el useEffect para preservar el estado expanded
  useEffect(() => {
    // Guardar el estado expanded actual antes de reconstruir
    const expandedState = getExpandedState(items)

    const tree = buildTree(globalColumns)
    const treeWithProperties = updateNodeProperties(tree)

    // Restaurar el estado expanded
    const treeWithExpanded = applyExpandedState(treeWithProperties, expandedState)

    setItems(treeWithExpanded)
  }, [globalColumns])

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

      if (isNestingOperation) {
        const draggedFinalState = flatFinal.find(item => item._id === draggedItem._id)
        if (draggedFinalState) {
          await updateDbAfterDrag(draggedFinalState)

          // ✅ Actualizar store global (el useEffect preservará el estado expanded)
          console.log('🔄 Actualizando store global después de anidamiento')
          setGlobalColumns(flatFinal)
        }
      } else {
        const draggedOriginalState = flatOriginal.find(item => item._id === draggedItem._id)
        const draggedFinalState = flatFinal.find(item => item._id === draggedItem._id)

        let affectedParentId = null
        if (draggedOriginalState && draggedFinalState) {
          affectedParentId = draggedFinalState.parentId
        }

        const changedItems = getChangedItemsForParent(flatOriginal, flatFinal, affectedParentId)

        if (changedItems.length > 0) {
          const result = await updateDbAfterDrag(changedItems)
          console.log('✅ Resultado:', result)

          // ✅ Actualizar store global (el useEffect preservará el estado expanded)
          console.log('🔄 Actualizando store global después de reordenamiento')
          setGlobalColumns(flatFinal)

          console.log('✅ Store global actualizado con:', flatFinal.length, 'items')
        } else {
          console.log('ℹ️ No hay cambios de orden que enviar')
        }
      }
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
    const firstColumnLink = globalLinks.find(link => link.categoryId === item._id && link.order === 0)

    return (
      <li key={item._id} order={item.order} className={className}>
        <NavLink
            // to={`${rootPath}${basePath}/${item.slug}`}
            to={item.level === 0 ? `${rootPath}${basePath}/${item.slug}` : `${rootPath}${basePath}/${item.parentSlug}/${item.slug}/${firstColumnLink?._id}`}
            className={({ isActive }) => isActive ? styles.active : ''}
            draggable
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

        </NavLink>
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
        {items.map(item => renderItem(item))}
      </ul>
    </nav>
  )
}

export default MultiLevelDragDrop
