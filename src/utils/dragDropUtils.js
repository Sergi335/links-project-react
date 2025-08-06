/**
 * Convierte una lista plana de objetos con `parentId` a un árbol anidado.
 * @param {Array} list La lista plana de elementos.
 * @returns {Array} La lista de nodos raíz con sus hijos anidados.
 */
export const buildTree = (list) => {
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
  console.log('📊 Árbol construido:', JSON.stringify(roots, null, 2))

  return roots
}

/**
 * Recorre el árbol y actualiza las propiedades `level`, `parentId`, `parentSlug` y `order`.
 * Solo reordena elementos dentro del mismo padre.
 * @param {Array} nodes El árbol de nodos a actualizar.
 * @param {number} level El nivel inicial.
 * @param {string|null} parentId El ID del padre.
 * @param {string|null} parentSlug El slug del padre.
 * @returns {Array} El nuevo árbol con propiedades actualizadas.
 */
export const updateNodeProperties = (nodes, level = 0, parentId = null, parentSlug = null) => {
  return nodes.map((node, index) => {
    const newNode = {
      ...node,
      level,
      parentId,
      parentSlug,
      order: index // El order siempre refleja la posición actual en este nivel
    }

    if (node.children && node.children.length > 0) {
      newNode.children = updateNodeProperties(
        node.children,
        level + 1,
        node._id,
        node.slug // Pasar el slug del nodo actual como parentSlug para los hijos
      )
    }
    return newNode
  })
}

/**
 * Aplana un desktop con sus hijos en un array plano
 */
export const flattenDesktop = (desktop) => {
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
export const getChangedItemsForParent = (originalItems, newItems, affectedParentId = null) => {
  const changedItems = []

  // Filtrar solo los items que pertenecen al padre específico
  const relevantNewItems = newItems.filter(item => item.parentId === affectedParentId)
  const relevantOriginalItems = originalItems.filter(item => item.parentId === affectedParentId)

  console.log(`🔍 Analizando padre: ${affectedParentId || 'ROOT'}`)
  console.log('📊 Items originales relevantes:', relevantOriginalItems.map(i => ({
    id: i._id,
    name: i.name,
    order: i.order,
    parentId: i.parentId,
    level: i.level
  })))
  console.log('📊 Items nuevos relevantes:', relevantNewItems.map(i => ({
    id: i._id,
    name: i.name,
    order: i.order,
    parentId: i.parentId,
    level: i.level
  })))

  relevantNewItems.forEach(newItem => {
    const oldItem = originalItems.find(item => item._id === newItem._id)

    if (!oldItem ||
        oldItem.order !== newItem.order ||
        oldItem.parentId !== newItem.parentId ||
        oldItem.level !== newItem.level ||
        oldItem.parentSlug !== newItem.parentSlug) {
      console.log(`🔄 Cambio detectado en ${newItem.name}:`, {
        id: newItem._id,
        oldOrder: oldItem?.order,
        newOrder: newItem.order,
        oldParent: oldItem?.parentId,
        newParent: newItem.parentId,
        oldLevel: oldItem?.level,
        newLevel: newItem.level,
        oldParentSlug: oldItem?.parentSlug,
        newParentSlug: newItem.parentSlug
      })

      changedItems.push({
        _id: newItem._id,
        order: newItem.order,
        parentId: newItem.parentId,
        parentSlug: newItem.parentSlug,
        level: newItem.level
      })
    }
  })

  console.log(`✅ Total cambios encontrados para padre ${affectedParentId || 'ROOT'}: ${changedItems.length}`)
  return changedItems
}
