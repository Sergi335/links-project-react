import { useParams } from 'react-router-dom'
import useData from '../hooks/useData'
import Header from './header'
import Nav from './nav'
import Columna from './column'
import CustomLink from './customlink'
import { useSessionStore } from '../store/session'

export default function AppLayout () {
  const { desktopName } = useParams()
  const { columnas, links } = useData(desktopName)
  const user = useSessionStore(state => state.user)
  console.log('🚀 ~ file: applayout.jsx:13 ~ AppLayout ~ user:', user)

  return (
    <>
      <Header />
      <Nav />
      <main>
        {columnas.map(columna => (
          <Columna key={columna._id} data={columna}>
            {links.map(link => (
              link.idpanel === columna._id
                ? (
                <CustomLink key={link._id} data={link} />
                  )
                : null
            ))}
          </Columna>
        ))}
      </main>
    </>
  )
}
