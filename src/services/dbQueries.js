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
export async function addLink (body) {
  return fetch(`${constants.BASE_API_URL}/links`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'x-justlinks-user': 'SergioSR',
      'x-justlinks-token': 'otroheader'
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => {
      return data
    })
    .catch(error => {
      return error
    })
}
export const createDesktop = async ({ name, displayName, orden }) => {
  const body = { name, displayName, orden }
  return fetch(`${constants.BASE_API_URL}/escritorios`, {
    method: 'POST',
    headers: {
      'Content-type': 'Application/json'
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => {
      return data
    })
    .catch(error => {
      return error
    })
}
export async function editColumn (name, desk, idPanel) {
  try {
    const body = { nombre: name, escritorio: desk, id: idPanel }
    const res = await fetch(`${constants.BASE_API_URL}/columnas`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    if (res.ok) {
      const data = await res.json()
      console.log(data)
      return data
    } else {
      const data = await res.json()
      console.log(data)
      return data
    }
  } catch (error) {
    console.log(error)
    return error
  }
}
export async function moveColumn (deskOrigen, deskDestino, idPanel) {
  try {
    const body = { deskOrigen, deskDestino, colId: idPanel }
    const res = await fetch(`${constants.BASE_API_URL}/moveCols`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    if (res.ok) {
      const data = await res.json()
      return data
    } else {
      const data = await res.json()
      return data
    }
  } catch (error) {
    console.log(error)
    return error
  }
}
export async function deleteColumn (idPanel) {
  try {
    const body = { id: idPanel }
    const res = await fetch(`${constants.BASE_API_URL}/columnas`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    if (res.ok) {
      const data = await res.json()
      console.log(data)
      return data
    } else {
      const data = await res.json()
      console.log(data)
      return data
    }
  } catch (error) {
    console.log(error)
    return error
  }
}
export async function moveLink (body) {
  return fetch(`${constants.BASE_API_URL}/links`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'Application/json'
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => {
      return data
    })
    .catch(error => {
      return error
    })
}
export async function editDesktopName (body) {
  return fetch(`${constants.BASE_API_URL}/escritorios`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'x-justlinks-user': 'SergioSR',
      'x-justlinks-token': 'otroheader'
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => {
      return data
    })
    .catch(error => {
      return error
    })
}
export async function editDesktopVisible (body) {
  return fetch(`${constants.BASE_API_URL}/escritoriosvisible`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'x-justlinks-user': 'SergioSR',
      'x-justlinks-token': 'otroheader'
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => {
      return data
    })
    .catch(error => {
      return error
    })
}
export async function changeBackgroundImage (event) {
  const nombre = event.target.alt
  if (event.target.nodeName === 'IMG') {
    return fetch(`${constants.BASE_API_URL}/getBackground?nombre=${nombre}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'x-justlinks-user': 'SergioSR',
        'x-justlinks-token': 'otroheader'
      }
    })
      .then(res => res.text())
      .then(data => {
        document.body.style.backgroundImage = `url(${data})`
        document.body.style.backgroundSize = 'cover'
        window.localStorage.setItem('bodyBackground', JSON.stringify(`${data}`))
        return data
      })
      .catch(error => {
        return error
      })
  } else {
    document.body.style.backgroundImage = ''
    document.body.style.backgroundSize = 'initial'
    window.localStorage.setItem('bodyBackground', '')
  }
}
export async function getBackgroundMiniatures () {
  return fetch(`${constants.BASE_API_URL}/escritorios/backgrounds`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json', // A variable global
      'x-justlinks-user': 'SergioSR',
      'x-justlinks-token': 'otroheader'
    }
  })
    .then(res => res.json())
    .then(data => {
      return data
    })
    .catch(error => {
      return error
    })
}
export async function fetchImage ({ imageUrl, linkId }) {
  try {
    const formData = new FormData()
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    // eslint-disable-next-line no-undef
    const file = new File([blob], 'image', { type: blob.type })
    formData.append('images', file, 'image.png')
    formData.append('linkId', linkId)
    const res = await fetch(`${constants.BASE_API_URL}/uploadImg`, {
      method: 'POST',
      body: formData
    })
    if (res.ok) {
      const result = await res.json()
      return result
    } else {
      console.error('Error al subir las imágenes al servidor.')
      return { error: 'Error al subir las imágenes al servidor' }
    }
  } catch (error) {
    console.error('Error al obtener la imagen:', error)
    return { error }
  }
}
export async function deleteImage ({ imageUrl, linkId }) {
  try {
    let body = {
      image: imageUrl,
      id: linkId
    }
    body = JSON.stringify(body)
    const res = await fetch(`${constants.BASE_API_URL}/deleteImg`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
      body
    })
    if (res.ok) {
      const result = await res.json()
      console.log(result)
      const firstKey = Object.keys(result)[0]
      const firstValue = result[firstKey]

      if (firstKey === 'error' || firstKey === 'errors') {
        if (firstKey === 'errors') {
          return `Error, valor ${firstValue[0].path} no válido`
        } else {
          return `${firstKey}, ${firstValue}`
        }
      } else {
        return result
      }
    } else {
      const error = await res.json()
      if (error.error === 'storage/invalid-url' || error.error === 'storage/object-not-found') {
        return 'Referencia eliminada'
      } else {
        console.log(error)
        console.error(error.error)
        return error.error
      }
    }
  } catch (error) {
    console.error('Error al borrar la imagen:', error)
    return error
  }
}
export async function sendNotes ({ id, notes }) {
  let body = { id, fields: { notes } }
  body = JSON.stringify(body)
  console.log(body)
  const res = await fetch(`${constants.BASE_API_URL}/links`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
  const json = await res.json()
  console.log(json)
  const firstKey = Object.keys(json)[0]
  const firstValue = json[firstKey]

  if (firstKey === 'error' || firstKey === 'errors') {
    if (firstKey === 'errors') {
      return (`Error, valor ${firstValue[0].path} no válido`)
    } else {
      return (`${firstKey}, ${firstValue}`)
    }
  } else {
    return json
  }
}
export async function fetchLinkIconFile ({ file, linkId }) {
  if (file) {
    const formData = new FormData()
    formData.append('linkImg', file)
    formData.append('linkId', linkId)
    console.log(formData)
    try {
      const response = await fetch(`${constants.BASE_API_URL}/uploadLinkImg`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        // const link = document.getElementById(linkId)
        // link.childNodes[0].src = src
        const firstKey = Object.keys(result)[0]
        const firstValue = result[firstKey]

        if (firstKey === 'error') {
          return (`${firstKey}, ${firstValue}`)
        } else {
          return result
        }
      } else {
        console.error('Error al actualizar la ruta de la imagen')
        return ('Error al cambiar imagen')
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error)
      return ('Error al cambiar imagen')
    }
  }
}
export async function saveLinkIcon ({ src, linkId }) {
  const formData = new FormData()
  formData.append('filePath', src)
  formData.append('linkId', linkId)
  try {
    const response = await fetch(`${constants.BASE_API_URL}/uploadLinkImg`, {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      const result = await response.json()
      console.log(result)
      const firstKey = Object.keys(result)[0]
      const firstValue = result[firstKey]

      if (firstKey === 'error') {
        return (`${firstKey}, ${firstValue}`)
      } else {
        return result
      }
    } else {
      console.error('Error al actualizar la ruta de la imagen')
      return ('Error al cambiar imagen')
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error)
    return ('Error al cambiar imagen')
  }
}
export async function deleteLinkImage (imageId) {
  try {
    let body = {
      image: imageId
      // id
    }
    body = JSON.stringify(body)
    const res = await fetch(`${constants.BASE_API_URL}/deleteLinkImg`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
      body
    })
    if (res.ok) {
      const result = await res.json()
      console.log(result)
      const firstKey = Object.keys(result)[0]
      const firstValue = result[firstKey]

      if (firstKey === 'error' || firstKey === 'errors') {
        if (firstKey === 'errors') {
          return (`Error, valor ${firstValue[0].path} no válido`)
        } else {
          return (`${firstKey}, ${firstValue}`)
        }
      } else {
        console.log('Borrado con éxito')
        return { message: 'Borrado con éxito' }
      }
    } else {
      console.log(await res.json())
      return ('Error en la solicitud')
    }
  } catch (error) {
    console.log(error)
    return error
  }
}
export async function editLink ({ id, name, URL, description }) {
  const body = {
    id,
    fields: {
      name,
      URL,
      description
    }
  }
  return fetch(`${constants.BASE_API_URL}/links`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'Application/json'
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => {
      return data
    })
    .catch(err => {
      console.log(err)
      return err
    })
}
export async function uploadProfileImg (file) {
  if (file) {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await fetch(`${constants.BASE_API_URL}/uploadImgProfile`, {
        method: 'POST',
        body: formData
      })
      if (response.ok) {
        const result = await response.json()
        const firstKey = Object.keys(result)[0]
        const firstValue = result[firstKey]

        if (firstKey === 'error') {
          return (`${firstKey}, ${firstValue}`)
        } else {
          return result.url
        }
      } else {
        console.error('Error al actualizar la ruta de la imagen')
        return ('Error al actualizar la ruta de la imagen')
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error)
      return (`Error al realizar la solicitud:, ${error}`)
    }
  }
}
export async function editUserAditionalInfo ({ realName, aboutMe, website }) {
  const body = {
    realName,
    aboutMe,
    website
  }
  return fetch(`${constants.BASE_API_URL}/userAditionalInfo`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'Application/json'
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => {
      return data
    })
    .catch(err => {
      console.log(err)
      return err
    })
}
export async function findDuplicates () {
  try {
    const res = await fetch(`${constants.BASE_API_URL}/duplicados`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
    if (res.ok) {
      const data = await res.json()
      console.log(data)
      return data
    } else {
      const data = await res.json()
      console.log(data)
      return data
    }
  } catch (error) {
    console.log(error)
    return error
  }
}
export async function getAllLinks () {
  try {
    const res = await fetch(`${constants.BASE_API_URL}/links/all/all`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    })
    if (res.ok) {
      const data = await res.json()
      console.log(data)
      return data
    } else {
      const data = await res.json()
      console.log(data)
      return data
    }
  } catch (error) {
    console.log(error)
    return error
  }
}
// export async function findBrokenLinks () {
//   // try catch deberia estar en otra función y dejar un solo fetch
//   try {
//     const data = await fetch(`${constants.BASE_URL}/links/all/all`, {
//       method: 'GET',
//       headers: {
//         'content-type': 'application/json'
//       }
//     })
//     const res = await data.json()
//     // res = res.slice(0, 50)
//     console.log(res.length)
//     const porcentajePorPaso = 100 / res.length
//     console.log(porcentajePorPaso)
//     const numeroPasos = Math.ceil(100 / porcentajePorPaso)
//     console.log('🚀 ~ file: profile.js:325 ~ findBrokenLinks ~ numeroPasos:', numeroPasos)
//     let count = 0
//     const downLinks = await Promise.all(res.map(async (link) => {
//       const response = await fetch(`${constants.BASE_API_URL}/linkStatus?url=${link.URL}`, {
//         method: 'GET',
//         headers: {
//           'content-type': 'application/json'
//         }
//       })
//       const data = await response.json()
//       if (data.status !== 'success') {
//         count += porcentajePorPaso
//         return { data, link }
//       }
//       count += porcentajePorPaso
//       $ppc.dataset.percent = count
//       progressCircle()
//       // console.log(count)
//       return null
//     }))
//     const filteredLinks = downLinks.filter(link => link !== null)
//     console.log(filteredLinks)
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }
