import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useGlobalStore } from '../../store/global'
import { ArrowDown } from '../Icons/icons'
import styles from './SideBar.module.css'

/**
 * Convierte una lista plana de objetos con `parentCategory` a un árbol anidado.
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

  // Anida los elementos según su `parentCategory`.
  list.forEach(item => {
    if (item.parentCategory && map[item.parentCategory]) {
      map[item.parentCategory].children.push(map[item._id])
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
 * Recorre el árbol y actualiza las propiedades `level`, `parentCategory` y `order`.
 * @param {Array} nodes El árbol de nodos a actualizar.
 * @param {number} level El nivel inicial.
 * @param {string|null} parentId El ID del padre.
 * @returns {Array} El nuevo árbol con propiedades actualizadas.
 */
const updateNodeProperties = (nodes, level = 0, parentId = null) => {
  return nodes.map((node, index) => {
    const newNode = { ...node, level, parentCategory: parentId, order: index }
    if (node.children && node.children.length > 0) {
      newNode.children = updateNodeProperties(node.children, level + 1, node._id)
    }
    return newNode
  })
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

  const handleDrop = (e, targetItem, position) => {
    e.preventDefault()
    e.stopPropagation()

    if (!draggedItem || draggedItem._id === targetItem._id) {
      setDragOverItem(null)
      return
    }

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

    // Actualiza level, parentCategory y order en toda la estructura
    const finalItems = updateNodeProperties(tempItems)

    setItems(finalItems)
    setDraggedItem(null)
    setDragOverItem(null)
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
