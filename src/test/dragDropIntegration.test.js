import { describe, expect, it } from 'vitest'
import { buildTree, flattenDesktop, getChangedItemsForParent, updateNodeProperties } from '../utils/dragDropUtils'

describe('Drag and Drop Integration Tests with parentSlug', () => {
  describe('Complete Nesting Operation', () => {
    it('should handle complete nesting operation with parentSlug', () => {
      // Datos iniciales simulando el store
      const mockStore = [
        { _id: 'item1', slug: 'item1-slug', name: 'Item 1', parentId: null, order: 0, level: 0 },
        { _id: 'item2', slug: 'item2-slug', name: 'Item 2', parentId: null, order: 1, level: 0 },
        { _id: 'item3', slug: 'item3-slug', name: 'Item 3', parentId: null, order: 2, level: 0 }
      ]

      // 1. Construir árbol inicial
      const initialTree = buildTree(mockStore)
      expect(initialTree).toHaveLength(3)

      // 2. Simular remover item1 del árbol
      const removeItem = (items, itemId) => {
        return items.filter(item => {
          if (item._id === itemId) return false
          if (item.children) {
            item.children = removeItem(item.children, itemId)
          }
          return true
        })
      }

      // 3. Simular insertar item1 dentro de item2
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

      // Simular el drag & drop: anidar item1 dentro de item2
      let tempItems = removeItem(initialTree, 'item1')
      const draggedItem = mockStore.find(item => item._id === 'item1')
      tempItems = insertItem(tempItems, 'item2', draggedItem)

      // 4. Actualizar propiedades con parentSlug
      const finalItems = updateNodeProperties(tempItems)

      // 5. Verificar la estructura final
      expect(finalItems).toHaveLength(2) // item2 e item3 en root
      expect(finalItems[0]._id).toBe('item2')
      expect(finalItems[0].children).toHaveLength(1)
      expect(finalItems[0].children[0]._id).toBe('item1')

      // 6. Verificar que parentSlug se asignó correctamente
      const nestedItem = finalItems[0].children[0]
      expect(nestedItem.parentId).toBe('item2')
      expect(nestedItem.parentSlug).toBe('item2-slug')
      expect(nestedItem.level).toBe(1)
      expect(nestedItem.order).toBe(0)

      // 7. Verificar que los items padre mantienen parentSlug null
      expect(finalItems[0].parentSlug).toBe(null)
      expect(finalItems[1].parentSlug).toBe(null)

      // 8. Flatten y verificar cambios
      const flatOriginal = mockStore
      const flatFinal = finalItems.map(item => flattenDesktop(item)).flat()

      expect(flatFinal).toHaveLength(3)

      // 9. Detectar cambios usando getChangedItemsForParent
      const changedItems = getChangedItemsForParent(flatOriginal, flatFinal, 'item2')

      expect(changedItems).toHaveLength(1)
      expect(changedItems[0]._id).toBe('item1')
      expect(changedItems[0].parentId).toBe('item2')
      expect(changedItems[0].parentSlug).toBe('item2-slug')
      expect(changedItems[0].level).toBe(1)
      expect(changedItems[0].order).toBe(0)
    })

    it('should handle moving item to root level (unnesting)', () => {
      // Datos iniciales con item anidado
      const mockStore = [
        { _id: 'parent', slug: 'parent-slug', name: 'Parent', parentId: null, order: 0, level: 0 },
        { _id: 'child', slug: 'child-slug', name: 'Child', parentId: 'parent', order: 0, level: 1 },
        { _id: 'sibling', slug: 'sibling-slug', name: 'Sibling', parentId: null, order: 1, level: 0 }
      ]

      // Construir árbol inicial
      const initialTree = buildTree(mockStore)

      // Verificar estructura inicial
      expect(initialTree).toHaveLength(2) // parent y sibling
      expect(initialTree[0].children).toHaveLength(1) // child dentro de parent

      // Simular mover child al nivel raíz
      const removeItem = (items, itemId) => {
        return items.filter(item => {
          if (item._id === itemId) return false
          if (item.children) {
            item.children = removeItem(item.children, itemId)
          }
          return true
        })
      }

      const tempItems = removeItem(initialTree, 'child')
      const draggedItem = mockStore.find(item => item._id === 'child')

      // Insertar al principio para minimizar cambios de orden
      tempItems.unshift(draggedItem)

      // Actualizar propiedades
      const finalItems = updateNodeProperties(tempItems)

      // Verificar estructura final
      expect(finalItems).toHaveLength(3) // parent, sibling, child todos en root

      const movedChild = finalItems.find(item => item._id === 'child')
      expect(movedChild.parentId).toBe(null)
      expect(movedChild.parentSlug).toBe(null)
      expect(movedChild.level).toBe(0)
      expect(movedChild.order).toBe(0) // Primero en la lista

      // Verificar cambios detectados
      const flatOriginal = mockStore
      const flatFinal = finalItems.map(item => flattenDesktop(item)).flat()

      const changedItems = getChangedItemsForParent(flatOriginal, flatFinal, null)

      // Debería detectar al menos el item que movimos
      expect(changedItems.length).toBeGreaterThanOrEqual(1)

      // Buscar específicamente el item que movimos
      const movedChildChange = changedItems.find(item => item._id === 'child')
      expect(movedChildChange).toBeDefined()
      expect(movedChildChange.parentId).toBe(null)
      expect(movedChildChange.parentSlug).toBe(null)
      expect(movedChildChange.level).toBe(0)
    })

    it('should handle moving between different parents', () => {
      const mockStore = [
        { _id: 'parent1', slug: 'parent1-slug', name: 'Parent 1', parentId: null, order: 0, level: 0 },
        { _id: 'parent2', slug: 'parent2-slug', name: 'Parent 2', parentId: null, order: 1, level: 0 },
        { _id: 'child', slug: 'child-slug', name: 'Child', parentId: 'parent1', order: 0, level: 1 }
      ]

      const initialTree = buildTree(mockStore)

      // Simular mover child de parent1 a parent2
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

      let tempItems = removeItem(initialTree, 'child')
      const draggedItem = mockStore.find(item => item._id === 'child')
      tempItems = insertItem(tempItems, 'parent2', draggedItem)

      const finalItems = updateNodeProperties(tempItems)

      // Verificar que child ahora está bajo parent2
      const parent2 = finalItems.find(item => item._id === 'parent2')
      expect(parent2.children).toHaveLength(1)
      expect(parent2.children[0]._id).toBe('child')
      expect(parent2.children[0].parentId).toBe('parent2')
      expect(parent2.children[0].parentSlug).toBe('parent2-slug')

      // Verificar que parent1 ya no tiene hijos
      const parent1 = finalItems.find(item => item._id === 'parent1')
      expect(parent1.children).toHaveLength(0)

      // Verificar cambios detectados
      const flatOriginal = mockStore
      const flatFinal = finalItems.map(item => flattenDesktop(item)).flat()

      const changedItems = getChangedItemsForParent(flatOriginal, flatFinal, 'parent2')

      expect(changedItems).toHaveLength(1)
      expect(changedItems[0]._id).toBe('child')
      expect(changedItems[0].parentId).toBe('parent2')
      expect(changedItems[0].parentSlug).toBe('parent2-slug')
    })
  })
})
