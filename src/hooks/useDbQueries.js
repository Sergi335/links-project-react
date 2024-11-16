import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { constants } from '../services/constants'
import { useDesktopsStore } from '../store/desktops'
import { useGlobalStore } from '../store/global'
import { useSessionStore } from '../store/session'

const useDbQueries = () => {
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)
  const setGlobalLoading = useGlobalStore(state => state.setGlobalLoading)
  const setGlobalError = useGlobalStore(state => state.setGlobalError)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const navigate = useNavigate()
  const setUser = useSessionStore(state => state.setUser)

  useEffect(() => {
    setGlobalLoading(true)
    const getData = async () => {
      const desktopsQuery = fetch(`${constants.BASE_API_URL}/desktops`, {
        method: 'GET',
        ...constants.FETCH_OPTIONS
      })
      const columnsQuery = fetch(`${constants.BASE_API_URL}/columns`, {
        method: 'GET',
        ...constants.FETCH_OPTIONS
      })
      const linksQuery = fetch(`${constants.BASE_API_URL}/links`, {
        method: 'GET',
        ...constants.FETCH_OPTIONS
      })
      const [desktopsResponse, columnsResponse, linksResponse] = await Promise.all([desktopsQuery, columnsQuery, linksQuery])
      if (desktopsResponse.ok && columnsResponse.ok && linksResponse.ok) {
        await Promise.all([desktopsResponse.json(), columnsResponse.json(), linksResponse.json()])
          .then((response) => {
            const desktops = response[0].data
            const columns = response[1].columns
            const links = response[2].links
            setDesktopsStore(desktops)
            setGlobalColumns(columns)
            setGlobalLinks(links)
            localStorage.setItem('firstDesktop', JSON.stringify(desktops[0]?.name))
          })
          .catch((error) => {
            console.log(error)
            setGlobalError({ error: 'Error al recuperar los datos' })
          })
          .finally(() => {
            setGlobalLoading(false)
          })
      } else {
        // Diccionario de errores por codigo de respuesta, eg 401: 'Unauthorized'
        console.log({ error: desktopsResponse.statusText })
        setGlobalError({ error: desktopsResponse.statusText })
        setGlobalLoading(false)
        setUser(null)
        navigate('/login')
      }
    }
    getData()
  }, [])
}
export default useDbQueries
