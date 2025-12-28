import { useQuery } from '@tanstack/react-query'
// import { useNavigate } from 'react-router-dom'
import { constants } from '../services/constants'
import { apiFetch } from '../services/api'
import { useGlobalStore } from '../store/global'
import { useTopLevelCategoriesStore } from '../store/useTopLevelCategoriesStore'
// import { useSessionStore } from '../store/session'

// Fetch functions
const fetchDesktops = async () => {
  return await apiFetch(`${constants.BASE_API_URL}/categories/toplevel`, {
    method: 'GET',
    ...constants.FETCH_OPTIONS
  })
}

const fetchColumns = async () => {
  return await apiFetch(`${constants.BASE_API_URL}/categories`, {
    method: 'GET',
    ...constants.FETCH_OPTIONS
  })
}

const fetchLinks = async () => {
  return await apiFetch(`${constants.BASE_API_URL}/links`, {
    method: 'GET',
    ...constants.FETCH_OPTIONS
  })
}

const useDbQueries = () => {
  // const navigate = useNavigate()
  const setTopLevelCategoriesStore = useTopLevelCategoriesStore(state => state.setTopLevelCategoriesStore)
  const setGlobalLoading = useGlobalStore(state => state.setGlobalLoading)
  const setGlobalError = useGlobalStore(state => state.setGlobalError)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  // const setGlobalDesktops = useGlobalStore(state => state.setGlobalDesktops)
  // const setUser = useSessionStore(state => state.setUser)

  // Parallel queries using useQueries
  const { isLoading, isError, error } = useQuery({
    queryKey: ['dbData'],
    queryFn: async () => {
      try {
        setGlobalLoading(true)
        const [desktopsResponse, columnsResponse, linksResponse] = await Promise.all([
          fetchDesktops(),
          fetchColumns(),
          fetchLinks()
        ])

        // Update stores
        setTopLevelCategoriesStore(desktopsResponse.data)
        // setGlobalDesktops(desktopsResponse.data)
        setGlobalColumns(columnsResponse.data)
        setGlobalLinks(linksResponse.data)
        // //console.log('🚀 ~ queryFn: ~ linksResponse.data:', linksResponse.data, desktopsResponse.data, columnsResponse.data)

        // Set first desktop in localStorage
        localStorage.setItem('firstDesktop', JSON.stringify(desktopsResponse.data.find(desktop => desktop.order === 0)?.slug))

        return { desktops: desktopsResponse.data, columns: columnsResponse.data, links: linksResponse.data }
      } catch (err) {
        // Handle error
        setGlobalError({ error: 'Error al recuperar los datos' })
        // setUser(null)
        // navigate('/login')
        throw err
      } finally {
        setGlobalLoading(false)
      }
    },
    retry: false,
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    onSettled: () => {
      setGlobalLoading(false)
    }
  })

  return { isLoading, isError, error }
}

export default useDbQueries
