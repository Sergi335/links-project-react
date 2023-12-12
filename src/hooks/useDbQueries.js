import { useEffect } from 'react'
import { constants } from '../services/constants'
import { useDesktopsStore } from '../store/desktops'
// import { useColumnsStore } from '../store/columns'
// import { useLinksStore } from '../store/links'
import { useGlobalStore } from '../store/global'
// import { useSessionStore } from '../store/session'

const useDbQueries = ({ desktopName }) => {
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)
  // const setColumnsStore = useColumnsStore(state => state.setColumnsStore)
  // const setLinksStore = useLinksStore(state => state.setLinksStore)
  const setGlobalLoading = useGlobalStore(state => state.setGlobalLoading)
  const setGlobalError = useGlobalStore(state => state.setGlobalError)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  // const globalColumns = useGlobalStore(state => state.globalColumns)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  // const globalLinks = useGlobalStore(state => state.globalLinks)
  // const [linksState, setLinksState] = useState([])
  // const [error, setError] = useState(null) // si da error de cors poner usuario a null

  useEffect(() => {
    setGlobalLoading(true)
    const getData = async () => {
      console.log('Toda la info')
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
            // setColumnsStore(columns.filter(col => col.escritorio === desktopName).toSorted((a, b) => (a.orden - b.orden)))
            setGlobalColumns(columns)
            // setLinksStore(links.toSorted((a, b) => (a.orden - b.orden)))
            setGlobalLinks(links) // 1 fuente de la verdad y filtrar luego
            setGlobalLoading(false)
          })
          .catch((error) => {
            console.log(error)
            setGlobalError({ error: 'Error al recuperar los datos' })
            setGlobalLoading(false)
          })
      }
    }
    getData()
  }, [])

  // useEffect(() => {
  //   console.log('Info de un solo desktop')
  //   // const newColumnsState = [...columnsState].filter(col => col.escritorio === desktopName).toSorted((a, b) => (a.orden - b.orden))
  //   // setColumnsStore(globalColumns.filter(col => col.escritorio === desktopName).toSorted((a, b) => (a.orden - b.orden)))
  //   // setLinksStore(globalLinks.toSorted((a, b) => (a.orden - b.orden)))
  // }, [desktopName])
}
export default useDbQueries
