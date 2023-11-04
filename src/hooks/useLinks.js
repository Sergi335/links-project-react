import { useNavStore } from '../store/session'
import { useEffect } from 'react'
import { getDataForDesktops } from '../services/dbQueries'
import { useLinksStore } from '../store/links'
import { useColumnsStore } from '../store/columns'

export const useLinks = ({ desktopName }) => {
  const setLinks = useNavStore(state => state.setLinks)
  const setLinksStore = useLinksStore(state => state.setLinksStore)
  const linksStore = useLinksStore(state => state.linksStore)
  const columnsStore = useColumnsStore(state => state.columnsStore)
  const storage = JSON.parse(localStorage.getItem(`${desktopName}links`))
  // console.log(linksStore)
  useEffect(() => {
    if (storage && storage?.length > 0) {
      setLinksStore(storage)
    } else {
      const fetchData = async () => {
        try {
          const [, linksData] = await getDataForDesktops(desktopName)
          setLinksStore(linksData.toSorted((a, b) => (a.orden - b.orden)))
          localStorage.setItem(`${desktopName}links`, JSON.stringify(linksData.toSorted((a, b) => (a.orden - b.orden))))
        } catch (error) {
          console.error(error)
        }
      }
      fetchData()
    }
  }, [desktopName])

  // Almacenamos en zustand todos los links de la pagina por orden para poder navegar por ellos en la página de detalles
  const orderedLinks = columnsStore.map(col => (
    linksStore.filter(link => (link.idpanel === col._id ? link : null))
  ))
  setLinks(orderedLinks.flat().filter(el => el !== null))
}
