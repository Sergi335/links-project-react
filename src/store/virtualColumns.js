import { create } from 'zustand'

export const useVirtualColumnsStore = create((set, get) => ({
  // Cache de columnas virtuales calculadas
  virtualColumnsCache: {},

  /**
   * Genera las columnas a mostrar para una categoría dada
   * Incluye una "columna virtual" si la categoría tiene links directos + subcategorías
   */
  getColumnsForCategory: (categoryId, categories, links) => {
    if (!categoryId || !categories || !links) return { columns: [], virtualColumn: null, directLinks: [] }

    const category = categories.find(c => c._id === categoryId)
    if (!category) return { columns: [], virtualColumn: null, directLinks: [] }

    // Subcategorías de esta categoría
    const subCategories = categories
      .filter(c => c.parentId === categoryId && !c.hidden)
      .sort((a, b) => a.order - b.order)

    // Links directos de esta categoría (no de sus subcategorías)
    const directLinks = links
      .filter(l => l.categoryId === categoryId)
      .sort((a, b) => a.order - b.order)

    const hasSubCategories = subCategories.length > 0
    const hasDirectLinks = directLinks.length > 0

    // Caso 1: Solo subcategorías (sin links directos)
    if (hasSubCategories && !hasDirectLinks) {
      return {
        columns: subCategories,
        virtualColumn: null,
        directLinks: []
      }
    }

    // Caso 2: Solo links directos (sin subcategorías)
    if (!hasSubCategories && hasDirectLinks) {
      // Crear columna virtual para mostrar los links directos
      const virtualColumn = {
        _id: `virtual-${categoryId}`,
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        parentSlug: category.parentSlug,
        level: category.level,
        order: 0,
        isVirtual: true,
        originalCategoryId: categoryId,
        hidden: false
      }
      return {
        columns: [virtualColumn],
        virtualColumn,
        directLinks
      }
    }

    // Caso 3: Tiene AMBOS - crear columna virtual + subcategorías
    if (hasSubCategories && hasDirectLinks) {
      const virtualColumn = {
        _id: `virtual-${categoryId}`,
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        parentSlug: category.parentSlug,
        level: category.level,
        order: -1, // Para que aparezca primero
        isVirtual: true,
        originalCategoryId: categoryId,
        hidden: false
      }

      return {
        columns: [virtualColumn, ...subCategories],
        virtualColumn,
        directLinks
      }
    }

    // Caso 4: Sin subcategorías ni links
    return {
      columns: [],
      virtualColumn: null,
      directLinks: []
    }
  },

  /**
   * Obtiene los links para una columna (virtual o real)
   */
  getLinksForColumn: (column, links) => {
    if (!column || !links) return []

    // Si es columna virtual, usar el ID original de la categoría
    const categoryId = column.isVirtual ? column.originalCategoryId : column._id

    return links
      .filter(l => l.categoryId === categoryId)
      .sort((a, b) => a.order - b.order)
  },

  /**
   * Verifica si una categoría tiene contenido mixto (links + subcategorías)
   */
  hasMixedContent: (categoryId, categories, links) => {
    if (!categoryId || !categories || !links) return false

    const hasSubCategories = categories.some(c => c.parentId === categoryId && !c.hidden)
    const hasDirectLinks = links.some(l => l.categoryId === categoryId)

    return hasSubCategories && hasDirectLinks
  }
}))
