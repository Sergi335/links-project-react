import { useGlobalStore } from '../store/global'

export const useDesktopLinks = () => {
  const getLinksByCategory = useGlobalStore(state => state.getLinksByCategory)
  const globalLoading = useGlobalStore(state => state.globalLoading)

  return {
    loading: globalLoading,
    getLinksByCategory
  }
}
