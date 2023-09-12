export async function getDataForDesktops (desktop) {
  try {
    const columnsResponsePromise = fetch(`http://localhost:3003/api/columnas?escritorio=${desktop}`)
    const linksResponsePromise = fetch(`http://localhost:3003/api/links/desktop/${desktop}`)

    const [columnsResponse, linksResponse] = await Promise.all([columnsResponsePromise, linksResponsePromise])

    if (columnsResponse.ok && linksResponse.ok) {
      const [columnsData, linksData] = await Promise.all([columnsResponse.json(), linksResponse.json()])

      return [columnsData, linksData]
    } else {
      // Manejar el caso en el que columnsResponse o linksResponse no estén bien
      throw new Error('Una o ambas respuestas no están bien')
    }
  } catch (error) {
    console.log(error)
    throw error // Volver a lanzar el error para propagarlo más adelante si es necesario
  }
}
export async function getDesktops () {
  try {
    const response = await fetch('http://localhost:3003/api/escritorios', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-justlinks-user': 'SergioSR',
        'x-justlinks-token': 'otroheader'
      }
    })

    if (!response.ok) {
      throw new Error('Error de red al obtener datos')
    }

    const data = await response.json()
    // console.log(data)
    return data
  } catch (error) {
    console.error('Error al obtener datos:', error)
    throw error
  }
}
