import { useGlobalData } from './useGlobalData'

export function useTitle ({ slug, desktopName, title }) {
  const { categories } = useGlobalData()
  if (title !== undefined && title !== null && title !== '') {
    document.title = `${title} - Zenmarks`
  } else if (slug) {
    const category = categories?.find(cat => cat.slug === slug)
    document.title = category ? `${category.name} - Zenmarks` : `${slug} - Zenmarks`
  } else if (desktopName) {
    const category = categories?.find(cat => cat.slug === desktopName)
    document.title = category ? `${category.name} - Zenmarks` : `${desktopName} - Zenmarks`
  }
}
