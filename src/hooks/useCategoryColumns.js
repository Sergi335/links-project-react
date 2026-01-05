import { useMemo } from 'react'
import { useVirtualColumnsStore } from '../store/virtualColumns'

/**
 * Hook para obtener las columnas (incluyendo virtuales) de una categoría
 * @param {string} categoryId - ID de la categoría padre
 * @param {Array} categories - Lista de todas las categorías
 * @param {Array} links - Lista de todos los links
 */
export function useCategoryColumns (categoryId, categories, links) {
  const getColumnsForCategory = useVirtualColumnsStore(state => state.getColumnsForCategory)
  const getLinksForColumnFn = useVirtualColumnsStore(state => state.getLinksForColumn)
  const hasMixedContent = useVirtualColumnsStore(state => state.hasMixedContent)

  const result = useMemo(() => {
    return getColumnsForCategory(categoryId, categories, links)
  }, [categoryId, categories, links, getColumnsForCategory])

  const isMixed = useMemo(() => {
    return hasMixedContent(categoryId, categories, links)
  }, [categoryId, categories, links, hasMixedContent])

  // Función para obtener los links de una columna específica
  const getLinksForColumn = (column) => {
    return getLinksForColumnFn(column, links)
  }

  // Calcular el número total de links (directos + en subcategorías)
  const totalLinks = useMemo(() => {
    const directLinksCount = result.directLinks?.length || 0
    const subCategoriesLinksCount = result.columns
      .filter(col => !col.isVirtual)
      .reduce((acc, col) => {
        return acc + links.filter(l => l.categoryId === col._id).length
      }, 0)
    return directLinksCount + subCategoriesLinksCount
  }, [result, links])

  return {
    columns: result.columns,
    virtualColumn: result.virtualColumn,
    directLinks: result.directLinks,
    isMixed,
    totalLinks,
    getLinksForColumn
  }
}
