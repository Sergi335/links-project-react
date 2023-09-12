import { useParams } from 'react-router-dom'
import { useNavStore, useSessionStore } from '../store/session'
import Columna from './Column'
import CustomLink from './customlink'
import { getDataForDesktops, getDesktops } from '../services/dbQueries'
import { useEffect, useState } from 'react'
import SideInfo from './SideInfo'

export default function ListOfLinks () {
  const { desktopName } = useParams()
  const [desktopColumns, setDesktopColumns] = useState([])
  const [desktopLinks, setDesktopLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [desktops, setDesktops] = useState([])
  const user = useSessionStore(state => state.user)
  const desktop = desktops.find(desk => desk.name === desktopName)
  const desktopDisplayName = desktop?.displayName
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const [columnsData, linksData] = await getDataForDesktops(desktopName)
        setDesktopColumns(columnsData.toSorted((a, b) => (a.order - b.order)))
        setDesktopLinks(linksData.toSorted((a, b) => (a.orden - b.orden)))
        const data = await getDesktops()
        setDesktops(data)
        setLoading(false)
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
      <SideInfo props={{ user, desktopColumns, desktopDisplayName }} />
      {loading
        ? (
        <p>Cargando ...</p>
          )
        : desktopColumns
          ? (
              desktopColumns.map((columna) => (
                <Columna
                  key={columna._id}
                  data={{ columna }}
                  desktopColumns={desktopColumns}
                  setDesktopColumns={setDesktopColumns}
                  desktops={desktops}
                  desktopLinks={desktopLinks}
                  setDesktopLinks={setDesktopLinks}>

                  {desktopLinks.map((link) =>
                    link.idpanel === columna._id
                      ? (
                      <CustomLink
                        key={link._id}
                        data={{ link }}
                        idpanel={columna._id}
                        columnas={desktopColumns}
                        desktopLinks={desktopLinks}
                        setDesktopLinks={setDesktopLinks}
                      />
                        )
                      : null
                  )}
                </Columna>
              ))
            )
          : (
        <div>Cargando Columnas...</div>
            )}
    </main>
  )
}
