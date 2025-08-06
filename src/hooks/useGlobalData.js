import { useGlobalStore } from '../store/global'

export const useGlobalData = () => {
  const globalLoading = useGlobalStore(state => state.globalLoading)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const globalLinks = useGlobalStore(state => state.globalLinks)

  return { links: globalLinks, loading: globalLoading, categories: globalColumns }
}
