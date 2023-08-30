import { useEffect, useState } from 'react'

export default function useData (name) {
  const [columnas, setColumnas] = useState([])
  const [links, setLinks] = useState([])

  useEffect(() => {
    fetch(`http://localhost:3003/api/columnas?escritorio=${name}`)
      .then(response => response.json())
      .then(data => {
        setColumnas(data)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }, [name])

  useEffect(() => {
    fetch(`http://localhost:3003/api/links/desktop/${name}`)
      .then(response => response.json())
      .then(data => {
        setLinks(data)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }, [name])

  return { columnas, links }
}
