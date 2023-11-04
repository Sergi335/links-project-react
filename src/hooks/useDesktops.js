import { useEffect } from 'react'
import { getDesktops } from '../services/dbQueries'
import { useDesktopsStore } from '../store/desktops'

export const useDesktops = ({ desktopName }) => {
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)
  const desktop = desktopsStore.find(desk => desk.name === desktopName)
  const desktopDisplayName = desktop?.displayName
  const storage = JSON.parse(localStorage.getItem('Desktops'))

  useEffect(() => {
    if (localStorage.getItem('Desktops') && storage?.length > 0) {
      setDesktopsStore(storage)
    } else {
      const fetchData = async () => {
        try {
          const data = await getDesktops()
          setDesktopsStore(data)
          localStorage.setItem('Desktops', JSON.stringify(data.toSorted((a, b) => (a.order - b.order))))
        } catch (error) {
          console.error(error)
        }
      }

      fetchData()
    }
  }, [desktopName])

  return { desktopDisplayName, desktop }
}
