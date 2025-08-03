import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { updateDbAfterDrag } from '../../services/dbQueries'
import { useGlobalStore } from '../../store/global'
import { ArrowDown } from '../Icons/icons'
import styles from './SideBar.module.css'

/**
 * Convierte una lista plana de objetos con `parentId` a un árbol anidado.
 * @param {Array} list La lista plana de elementos.
 * @returns {Array} La lista de nodos raíz con sus hijos anidados.
 */
const buildTree = (list) => {
  const map = {}
  const roots = []

  // Añade una propiedad `children` y `expanded` a cada elemento.
  list.forEach(item => {
    map[item._id] = { ...item, children: [], expanded: false }
  })

  // Anida los elementos según su `parentId`.
  list.forEach(item => {
    if (item.parentId && map[item.parentId]) {
      map[item.parentId].children.push(map[item._id])
    } else {
      roots.push(map[item._id])
    }
  })

  // Ordena los hijos en cada nivel según la propiedad `order`.
  const sortChildren = (node) => {
    node.children.sort((a, b) => a.order - b.order)
    node.children.forEach(sortChildren)
  }

  roots.forEach(sortChildren)
  roots.sort((a, b) => a.order - b.order)

  return roots
}

/**
 * Recorre el árbol y actualiza las propiedades `level`, `parentId` y `order`.
 * Solo reordena elementos dentro del mismo padre.
 * @param {Array} nodes El árbol de nodos a actualizar.
 * @param {number} level El nivel inicial.
 * @param {string|null} parentId El ID del padre.
 * @returns {Array} El nuevo árbol con propiedades actualizadas.
 */
const updateNodeProperties = (nodes, level = 0, parentId = null) => {
  return nodes.map((node, index) => {
    const newNode = {
      ...node,
      level,
      parentId,
      order: index // El order siempre refleja la posición actual en este nivel
    }

    if (node.children && node.children.length > 0) {
      newNode.children = updateNodeProperties(node.children, level + 1, node._id)
    }
    return newNode
  })
}

/**
 * Aplana un desktop con sus hijos en un array plano
 */
const flattenDesktop = (desktop) => {
  const result = [desktop]
  if (desktop.children) {
    desktop.children.forEach(child => {
      result.push(...flattenDesktop(child))
    })
  }
  return result
}

/**
 * Función helper para obtener solo los cambios que afectan a un padre específico
 * @param {Array} originalItems Estado original (flat)
 * @param {Array} newItems Estado después del drag (flat)
 * @param {string|null} affectedParentId ID del padre afectado
 * @returns {Array} Lista de items que cambiaron
 */
const getChangedItemsForParent = (originalItems, newItems, affectedParentId = null) => {
  const changedItems = []

  // Filtrar solo los items que pertenecen al padre específico
  const relevantNewItems = newItems.filter(item => item.parentId === affectedParentId)
  const relevantOriginalItems = originalItems.filter(item => item.parentId === affectedParentId)

  console.log(`🔍 Analizando padre: ${affectedParentId || 'ROOT'}`)
  console.log('📊 Items originales:', relevantOriginalItems.map(i => ({ id: i._id, name: i.name, order: i.order })))
  console.log('📊 Items nuevos:', relevantNewItems.map(i => ({ id: i._id, name: i.name, order: i.order })))

  relevantNewItems.forEach(newItem => {
    const oldItem = originalItems.find(item => item._id === newItem._id)

    if (!oldItem ||
        oldItem.order !== newItem.order ||
        oldItem.parentId !== newItem.parentId ||
        oldItem.level !== newItem.level) {
      console.log(`🔄 Cambio detectado en ${newItem.name}:`, {
        id: newItem._id,
        oldOrder: oldItem?.order,
        newOrder: newItem.order,
        oldParent: oldItem?.parentId,
        newParent: newItem.parentId
      })

      changedItems.push({
        _id: newItem._id,
        order: newItem.order,
        parentId: newItem.parentId,
        level: newItem.level
      })
    }
  })

  console.log(`✅ Total cambios encontrados: ${changedItems.length}`)
  return changedItems
}

const MultiLevelDragDrop = () => {
  const [items, setItems] = useState([])
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH

  // Al montar, convierte la data plana a un árbol
  useEffect(() => {
    setItems(buildTree(globalColumns))
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
    if (item.expanded) {
      item.expanded = false
    }
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

  const handleDrop = async (e, targetItem, position) => {
    e.preventDefault()
    e.stopPropagation()

    if (!draggedItem || draggedItem._id === targetItem._id) {
      setDragOverItem(null)
      return
    }

    // Guardamos el estado original para rollback
    const originalItems = [...items]

    try {
      const sourceData = findItemAndParent(items, draggedItem._id)
      if (!sourceData) return

      let tempItems = removeItem(items, draggedItem._id)

      if (position === 'inside') {
        tempItems = insertItem(tempItems, targetItem._id, sourceData.item)
      } else {
        const targetData = findItemAndParent(tempItems, targetItem._id)
        if (targetData) {
          const insertIndex = position === 'after' ? targetData.index + 1 : targetData.index
          const parentId = targetData.parent ? targetData.parent._id : null
          tempItems = insertAtIndex(tempItems, parentId, insertIndex, sourceData.item)
        }
      }

      // Actualiza level, parentId y order en toda la estructura
      const finalItems = updateNodeProperties(tempItems)

      // Obtener solo los cambios relevantes
      const flatOriginal = originalItems.map(item => flattenDesktop(item)).flat()
      const flatFinal = finalItems.map(item => flattenDesktop(item)).flat()

      // Determinar el padre objetivo
      const targetParentId = position === 'inside'
        ? targetItem._id
        : (findItemAndParent(originalItems, targetItem._id)?.parent?._id || null)

      const changedItems = getChangedItemsForParent(flatOriginal, flatFinal, targetParentId)

      // Si hay elementos movidos entre diferentes padres, incluir ambos grupos
      const originalParentId = sourceData.parent ? sourceData.parent._id : null
      if (originalParentId !== targetParentId) {
        const originalParentChanges = getChangedItemsForParent(flatOriginal, flatFinal, originalParentId)
        changedItems.push(...originalParentChanges)
      }

      // Actualizar el estado local
      setItems(finalItems)
      setDraggedItem(null)
      setDragOverItem(null)

      // Enviar solo los cambios a la base de datos
      if (changedItems.length > 0) {
        const result = await updateDbAfterDrag(changedItems)
        console.log('Database update result:', result)
      }
    } catch (error) {
      console.error('Error durante el drop:', error)
      // Rollback en caso de error
      setItems([...originalItems])
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

    return (
      <li key={item._id}
        className={`
            ${isDragOver && dragOverItem.position === 'before' ? styles.drag_to_top : ''}
            ${isDragOver && dragOverItem.position === 'after' ? styles.drag_to_bottom : ''}
            ${isDragOver && dragOverItem.position === 'inside' ? styles.drag_over : ''}
          `}
        >
        <NavLink
            to={`${rootPath}${basePath}/${item.slug}`}
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
            <button
                onClick={() => toggleExpand(item._id)}
                className="p-0.5 hover:bg-gray-200 rounded"
            >
                <ArrowDown
                    className={item.expanded ? `${styles.plus_icon_opened} ${styles.plus_icon}` : styles.plus_icon}
                />
            </button>

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
    <nav className={styles.nav}>
      <ul className={styles.nav_first_level_ul}>
        {items.map(item => renderItem(item))}
      </ul>
    </nav>
  )
}

export default MultiLevelDragDrop
