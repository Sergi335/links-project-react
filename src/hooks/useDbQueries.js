import { useQuery } from '@tanstack/react-query'
// import { useNavigate } from 'react-router-dom'
import { constants } from '../services/constants'
import { useDesktopsStore } from '../store/desktops'
import { useGlobalStore } from '../store/global'
// import { useSessionStore } from '../store/session'

// Fetch functions
const fetchDesktops = async () => {
  const response = await fetch(`${constants.BASE_API_URL}/categories/toplevel`, {
    method: 'GET',
    ...constants.FETCH_OPTIONS
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return response.json()
}

const fetchColumns = async () => {
  const response = await fetch(`${constants.BASE_API_URL}/categories`, {
    method: 'GET',
    ...constants.FETCH_OPTIONS
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return response.json()
}

const fetchLinks = async () => {
  const response = await fetch(`${constants.BASE_API_URL}/links`, {
    method: 'GET',
    ...constants.FETCH_OPTIONS
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return response.json()
}

const useDbQueries = () => {
  // const navigate = useNavigate()
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)
  const setGlobalLoading = useGlobalStore(state => state.setGlobalLoading)
  const setGlobalError = useGlobalStore(state => state.setGlobalError)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
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
        setDesktopsStore(desktopsResponse.data)
        setGlobalColumns(columnsResponse.data)
        setGlobalLinks(linksResponse.data)
        // console.log('🚀 ~ queryFn: ~ linksResponse.data:', linksResponse.data, desktopsResponse.data, columnsResponse.data)

        // Set first desktop in localStorage
        localStorage.setItem('firstDesktop', JSON.stringify(desktopsResponse.data.find(desktop => desktop.order === 0)?.slug))

        // return { desktops: desktopsResponse.data }
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
