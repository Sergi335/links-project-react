import { useParams } from 'react-router-dom'
import { useNavStore } from '../store/session'
import Columna from './Column'
import CustomLink from './customlink'
import { getDataForDesktops } from '../services/dbQueries'
import { useEffect, useState } from 'react'

export default function ListOfLinks ({ params }) {
  const handleContextMenu = params
  const { desktopName } = useParams()
  const [desktopColumns, setDesktopColumns] = useState([])
  const [desktopLinks, setDesktopLinks] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [columnsData, linksData] = await getDataForDesktops(desktopName)
        setDesktopColumns(columnsData)
        setDesktopLinks(linksData)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [desktopName])
  const setLinks = useNavStore(state => state.setLinks)
  const orderedLinks = desktopColumns.map(col => (
    desktopLinks.map(link => (link.idpanel === col._id ? link : null))
  ))
  setLinks(orderedLinks.flat().filter(el => el !== null))

  return (
        <main>
        { desktopColumns
          ? desktopColumns.map(columna => (
            <Columna key={columna._id} data={{ columna, handleContextMenu }}>
              {
                desktopLinks.map(link => (
                  link.idpanel === columna._id
                    ? (<CustomLink key={link._id} data={{ link }} idpanel={columna._id} columnas={desktopColumns}/>)
                    : null
                ))
              }
            </Columna>
          ))
          : <div>Cargando Columnas...</div>
      }
      </main>
  )
}
