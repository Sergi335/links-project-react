import { constants } from './constants'

// Organizar por links, columns, desktops, etc
// Poner donde se llama a cada funcion

// LinkDetails, useColumns, useLinks, useDragItems ---> Activo solo en LinkDetails
// Necesario para crear el mapa de links para la navegación de linkdetails
// export async function getDataForDesktops (desktop) {
//   try {
//     const columnsResponsePromise = fetch(`${constants.BASE_API_URL}/columns/getbydesk/${desktop}`, {
//       method: 'GET',
//       ...constants.FETCH_OPTIONS
//     })
//     const linksResponsePromise = fetch(`${constants.BASE_API_URL}/links/desktop/?desk=${desktop}`, {
//       method: 'GET',
//       ...constants.FETCH_OPTIONS
//     })

//     const [columnsResponse, linksResponse] = await Promise.all([columnsResponsePromise, linksResponsePromise])

//     if (columnsResponse.ok && linksResponse.ok) {
//       const [columnsData, linksData] = await Promise.all([columnsResponse.json(), linksResponse.json()])
//       // respuesta ok solo se ocupa de errores de red, comprobar el success de la respuesta
//       return [columnsData, linksData]
//     } else {
//       // Manejar el caso en el que columnsResponse o linksResponse no estén bien
//       return ({ error: 'Fallo al obtener datos para el escritorio' })
//     }
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }
// MoveOtherDeskForm ---> Necesario para crear el menu con todos los escritorios y columnas a donde mover el link
// export async function getDesktopsAndColumns () {
//   try {
//     const desktopsResponsePromise = fetch(`${constants.BASE_API_URL}/desktops`, {
//       method: 'GET',
//       ...constants.FETCH_OPTIONS
//     })
//     const columnsResponsePromise = fetch(`${constants.BASE_API_URL}/columns`, {
//       method: 'GET',
//       ...constants.FETCH_OPTIONS
//     })

//     const [desktopsResponse, columnsResponse] = await Promise.all([desktopsResponsePromise, columnsResponsePromise])

//     if (desktopsResponse.ok && columnsResponse.ok) {
//       const [desktopsData, columnsData] = await Promise.all([desktopsResponse.json(), columnsResponse.json()])
//       const desktops = desktopsData.data
//       const columns = columnsData.columns
//       return [desktops, columns]
//     } else {
//       console.log(desktopsResponse, columnsResponse)
//       return { error: 'Error al obtener datos' }
//     }
//   } catch (error) {
//     console.log(error)
//     return error
//   }
// }

/* ------------ LINKS ------------------- */

// ProfilePage
export async function getAllLinks () {
  try {
    const res = await fetch(`${constants.BASE_API_URL}/links`, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
    const data = await res.json()
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}
// MoveOtherDeskForm
export async function getLinksCount ({ idpanel }) {
  try {
    const res = await fetch(`${constants.BASE_API_URL}/links/count/?column=${idpanel}`, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
    const data = await res.json()
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}
// useDragItems
export async function getLinkById ({ id }) {
  try {
    const res = await fetch(`${constants.BASE_API_URL}/links/getbyid/${id}`, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
    const data = await res.json()
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}
// AddLinkForm -- Validar datos
export async function addLink (body) {
  return fetch(`${constants.BASE_API_URL}/links`, {
    method: 'POST',
    ...constants.FETCH_OPTIONS,
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
// EditlinkForm, linkDetails -- Validar datos
export async function editLink ({ id, name, URL, description, notes }) {
  return fetch(`${constants.BASE_API_URL}/links`, {
    method: 'PATCH',
    ...constants.FETCH_OPTIONS,
    body: JSON.stringify({
      id,
      fields: {
        name,
        URL,
        description,
        imgURL: URL ? constants.BASE_LINK_IMG_URL(URL) : undefined,
        notes
      }
    })
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
// DeleteLinkForm -- Validar datos
export async function deleteLink ({ body }) {
  try {
    const res = await fetch(`${constants.BASE_API_URL}/links`, {
      method: 'DELETE',
      ...constants.FETCH_OPTIONS,
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
// Contextualmenu, moveOtherDeskForm, useDragItems -- Validar datos
export async function moveLink (body) {
  return fetch(`${constants.BASE_API_URL}/links`, {
    method: 'PATCH',
    ...constants.FETCH_OPTIONS,
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
export async function moveMultipleLinks (body) {
  return fetch(`${constants.BASE_API_URL}/links/move`, {
    method: 'PATCH',
    ...constants.FETCH_OPTIONS,
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
// ProfilePage
export async function findDuplicateLinks () {
  try {
    const res = await fetch(`${constants.BASE_API_URL}/links/duplicates`, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
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
/* --------------- COLUMNS -------------------- */

// Column, ContectualColMenu, useDragItems
export async function editColumn ({ name, oldDesktop, newDesktop, idPanel, columnsIds }) {
  try {
    const body = { id: idPanel, oldDesktop, columnsIds, fields: { name, escritorio: newDesktop } }
    const res = await fetch(`${constants.BASE_API_URL}/columns`, {
      method: 'PATCH',
      ...constants.FETCH_OPTIONS,
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
// DeleteColConfirmForm
export async function deleteColumn (idPanel) {
  try {
    const body = { id: idPanel }
    const res = await fetch(`${constants.BASE_API_URL}/columns`, {
      method: 'DELETE',
      ...constants.FETCH_OPTIONS,
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
// SideInfo
export async function createColumn ({ name, escritorio, order }) {
  try {
    const body = { name, escritorio, order }
    console.log(body)
    const res = await fetch(`${constants.BASE_API_URL}/columns`, {
      method: 'POST',
      ...constants.FETCH_OPTIONS,
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
    console.error('Error de red:', error)
    return error
  }
}

/* --------------- DESKTOPS -------------------- */
// useDesktops
// export async function getDesktops () {
//   try {
//     const res = await fetch(`${constants.BASE_API_URL}/desktops`, {
//       method: 'GET',
//       ...constants.FETCH_OPTIONS
//     })
//     if (res.ok) {
//       const data = await res.json()
//       console.log(data)
//       return data
//     } else {
//       const data = await res.json()
//       console.log(data)
//       return data
//     }
//   } catch (error) {
//     console.error('Error al obtener datos:', error)
//     return error
//   }
// }
// Nav
export async function moveDesktops (items) {
  try {
    const names = items.map(item => {
      return item.displayName
    })
    const body = { names }
    const response = await fetch(`${constants.BASE_API_URL}/desktops/setorder`, {
      method: 'PATCH',
      ...constants.FETCH_OPTIONS,
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
// AddDesktopForm
export async function createDesktop ({ name, displayName, orden }) {
  const body = { name, displayName, orden }
  return fetch(`${constants.BASE_API_URL}/desktops`, {
    method: 'POST',
    ...constants.FETCH_OPTIONS,
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
// CustomizeDesktopPanel
export async function editDesktop (body) {
  return fetch(`${constants.BASE_API_URL}/desktops`, {
    method: 'PATCH',
    ...constants.FETCH_OPTIONS,
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
// DeleteConfirmForm
export async function deleteDesktop ({ body }) {
  try {
    const res = await fetch(`${constants.BASE_API_URL}/desktops`, {
      method: 'DELETE',
      ...constants.FETCH_OPTIONS,
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

/* --------------- STORAGE -------------------- */

// CustomizeDesktopPanel
export async function changeBackgroundImage (event) {
  const nombre = event.target.alt
  if (event.target.nodeName === 'IMG') {
    console.log('fetch')
    return fetch(`${constants.BASE_API_URL}/storage/backgroundurl?nombre=${nombre}`, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
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
    return { error: 'Error al cambiar la imagen de fondo' }
  }
}
// CustomizeDesktopPanel
export async function getBackgroundMiniatures () {
  return fetch(`${constants.BASE_API_URL}/storage/backgrounds`, {
    method: 'GET',
    ...constants.FETCH_OPTIONS
  })
    .then(res => res.json())
    .then(data => {
      const { backgrounds } = data
      return backgrounds
    })
    .catch(error => {
      return error
    })
}
// LinkDetails
export async function fetchImage ({ imageUrl, linkId }) {
  try {
    const formData = new FormData()
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const file = new File([blob], 'image', { type: blob.type })
    formData.append('images', file, 'image.png')
    formData.append('linkId', linkId)
    const res = await fetch(`${constants.BASE_API_URL}/storage/image`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'x-justlinks-user': 'SergioSR',
        'x-justlinks-token': 'otroheader'
      },
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
// DeleteImageConfirmForm
export async function deleteImage ({ imageUrl, linkId }) {
  try {
    let body = {
      image: imageUrl,
      id: linkId
    }
    body = JSON.stringify(body)
    const res = await fetch(`${constants.BASE_API_URL}/storage/image`, {
      method: 'DELETE',
      ...constants.FETCH_OPTIONS,
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
// LinkDetails
export async function fetchLinkIconFile ({ file, linkId }) {
  if (file) {
    const formData = new FormData()
    formData.append('linkImg', file)
    formData.append('linkId', linkId)
    console.log(formData)
    try {
      const response = await fetch(`${constants.BASE_API_URL}/storage/icon`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'x-justlinks-user': 'SergioSR',
          'x-justlinks-token': 'otroheader'
        },
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
// LinkDetails
export async function saveLinkIcon ({ src, linkId }) {
  const formData = new FormData()
  formData.append('filePath', src)
  formData.append('linkId', linkId)
  try {
    const response = await fetch(`${constants.BASE_API_URL}/storage/icon`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'x-justlinks-user': 'SergioSR',
        'x-justlinks-token': 'otroheader'
      },
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
// LinkDetails
export async function deleteLinkImage (imageId) {
  try {
    const res = await fetch(`${constants.BASE_API_URL}/storage/icon`, {
      method: 'DELETE',
      ...constants.FETCH_OPTIONS,
      body: JSON.stringify({ image: imageId })
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
// ProfilePage
export async function uploadProfileImg (file) {
  if (file) {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await fetch(`${constants.BASE_API_URL}/storage/profilepic`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'x-justlinks-user': 'SergioSR',
          'x-justlinks-token': 'otroheader'
        },
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

// Backup

/* --------------- USER -------------------- */

// ProfilePage
export async function editUserAditionalInfo ({ email, fields }) {
  const body = {
    email,
    fields
  }
  return fetch(`${constants.BASE_API_URL}/auth/updateuser`, {
    method: 'PATCH',
    ...constants.FETCH_OPTIONS,
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
