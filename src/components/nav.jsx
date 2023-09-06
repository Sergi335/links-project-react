import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Nav.module.css'

export default function Nav () {
  const [escritorios, setEscritorios] = useState([])
  useEffect(() => {
    const getEscritorios = async () => {
      fetch('http://localhost:3003/api/escritorios', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'x-justlinks-user': 'SergioSR',
          'x-justlinks-token': 'otroheader'
        }
      })
        .then(response => response.json())
        .then(data => {
          // console.log(data)
          setEscritorios(data)
        })
        .catch(error => {
          console.error('Error fetching data:', error)
        })
    }
    getEscritorios()
  }, [])
  return (
        <nav className={styles.nav}>
            <ul>
                {
                    escritorios.map(escritorio => (
                        <li key={escritorio._id}><Link to={`/desktop/${escritorio.name}`}>{escritorio.displayName}</Link></li>
                    ))
                }
            </ul>
        </nav>
  )
}
