import { getDataForDesktops } from '../services/dbQueries'
import { useEffect, useState } from 'react'
import { useColumnsStore } from '../store/columns'

export const useColumns = ({ desktopName }) => {
  const [loading, setLoading] = useState(false)
  const setColumnsStore = useColumnsStore(state => state.setColumnsStore)
  // const columnsStore = useColumnsStore(state => state.columnsStore)
  const storage = JSON.parse(localStorage.getItem(`${desktopName}Columns`))

  useEffect(() => {
    if (storage && storage?.length > 0) {
      setColumnsStore(storage)
    } else {
      setLoading(true)
      const fetchData = async () => {
        try {
          const [columnsData] = await getDataForDesktops(desktopName)
          setColumnsStore(columnsData.toSorted((a, b) => (a.order - b.order)))
          setLoading(false)
          // localStorage.setItem(`${desktopName}Columns`, JSON.stringify(columnsData.toSorted((a, b) => (a.order - b.order))))
        } catch (error) {
          console.error(error)
        }
      }

      fetchData()
    }
  }, [desktopName])

  return { loading }
}
