import { constants } from './constants'
export async function getDataForDesktops (desktop) {
  try {
    const columnsResponsePromise = fetch(`${constants.BASE_API_URL}/columnas?escritorio=${desktop}`)
    const linksResponsePromise = fetch(`${constants.BASE_API_URL}/links/desktop/${desktop}`)

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
    const response = await fetch(`${constants.BASE_API_URL}/escritorios`, {
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
export async function moveColumns (columnIds, escritorio) {
  try {
    const body = columnIds
    const response = await fetch(`${constants.BASE_API_URL}/dragcol?escritorio=${escritorio}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'x-justlinks-user': 'SergioSR',
        'x-justlinks-token': 'otroheader'
      },
      body: JSON.stringify({ body })
    })

    if (!response.ok) {
      throw new Error('Error al mover columnas')
    }

    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error de red:', error)
    throw error
  }
}
export async function moveLinks (id, linkIds, escritorio, idpanel) {
  try {
    const body = { id, destinyIds: linkIds, fields: { escritorio, idpanel } }
    // let body = { id, destinyIds, fields: { escritorio, name: nombre, idpanel, panel, orden } }
    const response = await fetch(`${constants.BASE_API_URL}/links`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'x-justlinks-user': 'SergioSR',
        'x-justlinks-token': 'otroheader'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error('Error al mover columnas')
    }

    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error de red:', error)
    throw error
  }
}
export async function moveDesktops (items) {
  try {
    const names = items.map(item => {
      return item.displayName
    })
    const body = { names }
    const response = await fetch(`${constants.BASE_API_URL}/ordenaDesks`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'x-justlinks-user': 'SergioSR',
        'x-justlinks-token': 'otroheader'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error('Error al mover columnas')
    }

    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error de red:', error)
    throw error
  }
}
export async function createColumn (nombre, escritorio, orden) {
  try {
    const body = { nombre, escritorio, orden }
    console.log(body)
    const response = await fetch(`${constants.BASE_API_URL}/columnas`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-justlinks-user': 'SergioSR',
        'x-justlinks-token': 'otroheader'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error('Error al mover columnas')
    }

    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error de red:', error)
    throw error
  }
}
