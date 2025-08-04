import { describe, expect, it } from 'vitest'

// Importamos las funciones que vamos a testear
import { buildTree, flattenDesktop, getChangedItemsForParent, updateNodeProperties } from '../utils/dragDropUtils'

describe('Drag and Drop Utilities', () => {
  describe('buildTree', () => {
    it('should convert flat list to tree structure', () => {
      const flatList = [
        { _id: '1', name: 'Root 1', parentId: null, order: 0, level: 0 },
        { _id: '2', name: 'Root 2', parentId: null, order: 1, level: 0 },
        { _id: '3', name: 'Child 1', parentId: '1', order: 0, level: 1 },
        { _id: '4', name: 'Child 2', parentId: '1', order: 1, level: 1 }
      ]

      const tree = buildTree(flatList)

      expect(tree).toHaveLength(2)
      expect(tree[0]._id).toBe('1')
      expect(tree[0].children).toHaveLength(2)
      expect(tree[0].children[0]._id).toBe('3')
      expect(tree[0].children[1]._id).toBe('4')
      expect(tree[1]._id).toBe('2')
      expect(tree[1].children).toHaveLength(0)
    })

    it('should handle empty list', () => {
      const tree = buildTree([])
      expect(tree).toHaveLength(0)
    })

    it('should sort children by order property', () => {
      const flatList = [
        { _id: '1', name: 'Root', parentId: null, order: 0, level: 0 },
        { _id: '2', name: 'Child 2', parentId: '1', order: 2, level: 1 },
        { _id: '3', name: 'Child 1', parentId: '1', order: 1, level: 1 },
        { _id: '4', name: 'Child 0', parentId: '1', order: 0, level: 1 }
      ]

      const tree = buildTree(flatList)

      expect(tree[0].children[0]._id).toBe('4') // order 0
      expect(tree[0].children[1]._id).toBe('3') // order 1
      expect(tree[0].children[2]._id).toBe('2') // order 2
    })
  })

  describe('updateNodeProperties', () => {
    it('should update level, parentId and order properties', () => {
      const tree = [
        {
          _id: '1',
          name: 'Root',
          children: [
            { _id: '2', name: 'Child 1', children: [] },
            { _id: '3', name: 'Child 2', children: [] }
          ]
        }
      ]

      const updated = updateNodeProperties(tree)

      expect(updated[0].level).toBe(0)
      expect(updated[0].parentId).toBe(null)
      expect(updated[0].order).toBe(0)
      expect(updated[0].children[0].level).toBe(1)
      expect(updated[0].children[0].parentId).toBe('1')
      expect(updated[0].children[0].order).toBe(0)
      expect(updated[0].children[1].order).toBe(1)
    })

    it('should handle nested children correctly', () => {
      const tree = [
        {
          _id: '1',
          name: 'Root',
          children: [
            {
              _id: '2',
              name: 'Child',
              children: [
                { _id: '3', name: 'Grandchild', children: [] }
              ]
            }
          ]
        }
      ]

      const updated = updateNodeProperties(tree)

      expect(updated[0].children[0].children[0].level).toBe(2)
      expect(updated[0].children[0].children[0].parentId).toBe('2')
    })
  })

  describe('flattenDesktop', () => {
    it('should flatten tree to array', () => {
      const tree = {
        _id: '1',
        name: 'Root',
        children: [
          { _id: '2', name: 'Child 1', children: [] },
          { _id: '3', name: 'Child 2', children: [] }
        ]
      }

      const flattened = flattenDesktop(tree)

      expect(flattened).toHaveLength(3)
      expect(flattened[0]._id).toBe('1')
      expect(flattened[1]._id).toBe('2')
      expect(flattened[2]._id).toBe('3')
    })

    it('should handle deeply nested structures', () => {
      const tree = {
        _id: '1',
        name: 'Root',
        children: [
          {
            _id: '2',
            name: 'Child',
            children: [
              { _id: '3', name: 'Grandchild', children: [] }
            ]
          }
        ]
      }

      const flattened = flattenDesktop(tree)

      expect(flattened).toHaveLength(3)
      expect(flattened.map(item => item._id)).toEqual(['1', '2', '3'])
    })
  })

  describe('getChangedItemsForParent', () => {
    it('should detect changes in order for specific parent', () => {
      const originalItems = [
        { _id: '1', parentId: null, order: 0, level: 0 },
        { _id: '2', parentId: null, order: 1, level: 0 },
        { _id: '3', parentId: '1', order: 0, level: 1 },
        { _id: '4', parentId: '1', order: 1, level: 1 }
      ]

      const newItems = [
        { _id: '1', parentId: null, order: 0, level: 0 },
        { _id: '2', parentId: null, order: 1, level: 0 },
        { _id: '3', parentId: '1', order: 1, level: 1 }, // Cambió order de 0 a 1
        { _id: '4', parentId: '1', order: 0, level: 1 } // Cambió order de 1 a 0
      ]

      const changes = getChangedItemsForParent(originalItems, newItems, '1')

      expect(changes).toHaveLength(2)
      expect(changes.find(c => c._id === '3').order).toBe(1)
      expect(changes.find(c => c._id === '4').order).toBe(0)
    })

    it('should detect parent changes', () => {
      const originalItems = [
        { _id: '1', parentId: null, order: 0, level: 0 },
        { _id: '2', parentId: null, order: 1, level: 0 },
        { _id: '3', parentId: '1', order: 0, level: 1 }
      ]

      const newItems = [
        { _id: '1', parentId: null, order: 0, level: 0 },
        { _id: '2', parentId: null, order: 1, level: 0 },
        { _id: '3', parentId: '2', order: 0, level: 1 } // Cambió de parent '1' a '2'
      ]

      const changes = getChangedItemsForParent(originalItems, newItems, '2')

      expect(changes).toHaveLength(1)
      expect(changes[0]._id).toBe('3')
      expect(changes[0].parentId).toBe('2')
    })

    it('should only return changes for the specified parent', () => {
      const originalItems = [
        { _id: '1', parentId: null, order: 0, level: 0 },
        { _id: '2', parentId: null, order: 1, level: 0 },
        { _id: '3', parentId: '1', order: 0, level: 1 },
        { _id: '4', parentId: '2', order: 0, level: 1 }
      ]

      const newItems = [
        { _id: '1', parentId: null, order: 1, level: 0 }, // Cambió
        { _id: '2', parentId: null, order: 0, level: 0 }, // Cambió
        { _id: '3', parentId: '1', order: 1, level: 1 }, // Cambió
        { _id: '4', parentId: '2', order: 1, level: 1 } // Cambió
      ]

      // Solo pedimos cambios para parent '1'
      const changes = getChangedItemsForParent(originalItems, newItems, '1')

      expect(changes).toHaveLength(1) // Solo el item '3' pertenece al parent '1'
      expect(changes[0]._id).toBe('3')
    })

    it('should return empty array when no changes detected', () => {
      const originalItems = [
        { _id: '1', parentId: null, order: 0, level: 0 },
        { _id: '2', parentId: '1', order: 0, level: 1 }
      ]

      const newItems = [
        { _id: '1', parentId: null, order: 0, level: 0 },
        { _id: '2', parentId: '1', order: 0, level: 1 }
      ]

      const changes = getChangedItemsForParent(originalItems, newItems, '1')

      expect(changes).toHaveLength(0)
    })
  })

  describe('updateNodeProperties with parentSlug', () => {
    it('should set parentSlug correctly for nested items', () => {
      const tree = [
        {
          _id: 'parent1',
          slug: 'parent-slug',
          children: [
            { _id: 'child1', slug: 'child1-slug', children: [] },
            { _id: 'child2', slug: 'child2-slug', children: [] }
          ]
        }
      ]

      const result = updateNodeProperties(tree)

      expect(result[0].parentSlug).toBe(null) // Nivel 0
      expect(result[0].children[0].parentSlug).toBe('parent-slug')
      expect(result[0].children[1].parentSlug).toBe('parent-slug')
    })

    it('should handle multi-level nesting correctly', () => {
      const tree = [
        {
          _id: 'root',
          slug: 'root-slug',
          children: [
            {
              _id: 'level1',
              slug: 'level1-slug',
              children: [
                { _id: 'level2', slug: 'level2-slug', children: [] }
              ]
            }
          ]
        }
      ]

      const result = updateNodeProperties(tree)

      expect(result[0].parentSlug).toBe(null)
      expect(result[0].children[0].parentSlug).toBe('root-slug')
      expect(result[0].children[0].children[0].parentSlug).toBe('level1-slug')
    })

    it('should set parentSlug to null for root level items', () => {
      const tree = [
        { _id: 'root1', slug: 'root1-slug', children: [] },
        { _id: 'root2', slug: 'root2-slug', children: [] }
      ]

      const result = updateNodeProperties(tree)

      expect(result[0].parentSlug).toBe(null)
      expect(result[1].parentSlug).toBe(null)
    })
  })

  describe('getChangedItemsForParent with parentSlug', () => {
    it('should detect parentSlug changes', () => {
      const original = [
        { _id: 'item1', parentId: null, parentSlug: null, order: 0, level: 0, name: 'Item 1' }
      ]

      const modified = [
        { _id: 'item1', parentId: 'parent1', parentSlug: 'parent-slug', order: 0, level: 1, name: 'Item 1' }
      ]

      const changes = getChangedItemsForParent(original, modified, 'parent1')

      expect(changes).toHaveLength(1)
      expect(changes[0].parentSlug).toBe('parent-slug')
      expect(changes[0].parentId).toBe('parent1')
    })

    it('should detect when moved to root level', () => {
      const original = [
        { _id: 'item1', parentId: 'parent1', parentSlug: 'parent-slug', order: 0, level: 1, name: 'Item 1' }
      ]

      const modified = [
        { _id: 'item1', parentId: null, parentSlug: null, order: 0, level: 0, name: 'Item 1' }
      ]

      const changes = getChangedItemsForParent(original, modified, null)

      expect(changes).toHaveLength(1)
      expect(changes[0].parentSlug).toBe(null)
      expect(changes[0].parentId).toBe(null)
    })

    it('should detect parentSlug change when moving between parents', () => {
      const original = [
        { _id: 'item1', parentId: 'parent1', parentSlug: 'parent1-slug', order: 0, level: 1, name: 'Item 1' }
      ]

      const modified = [
        { _id: 'item1', parentId: 'parent2', parentSlug: 'parent2-slug', order: 0, level: 1, name: 'Item 1' }
      ]

      const changes = getChangedItemsForParent(original, modified, 'parent2')

      expect(changes).toHaveLength(1)
      expect(changes[0].parentSlug).toBe('parent2-slug')
      expect(changes[0].parentId).toBe('parent2')
    })

    it('should not detect changes when only other properties change but parentSlug stays same', () => {
      const original = [
        { _id: 'item1', parentId: 'parent1', parentSlug: 'parent-slug', order: 0, level: 1, name: 'Item 1' },
        { _id: 'item2', parentId: 'parent1', parentSlug: 'parent-slug', order: 1, level: 1, name: 'Item 2' }
      ]

      const modified = [
        { _id: 'item1', parentId: 'parent1', parentSlug: 'parent-slug', order: 0, level: 1, name: 'Item 1' },
        { _id: 'item2', parentId: 'parent1', parentSlug: 'parent-slug', order: 1, level: 1, name: 'Item 2' }
      ]

      const changes = getChangedItemsForParent(original, modified, 'parent1')

      expect(changes).toHaveLength(0)
    })
  })
})
