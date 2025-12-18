import { constants } from './constants'

/* ------------ LINKS ------------------- */

// ProfilePage
export async function getAllLinks () {
  try {
    const res = await fetch(`${constants.BASE_API_URL}/links`, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
    const data = await res.json()
    // console.log(data)
    return data
  } catch (error) {
    // console.log(error)
    return error
  }
}
// MoveOtherDeskForm
export async function getLinksCount ({ categoryId }) {
  try {
    const res = await fetch(`${constants.BASE_API_URL}/links/count/?categoryId=${categoryId}`, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
    const data = await res.json()
    // console.log(data)
    return data
  } catch (error) {
    // console.log(error)
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
    // console.log(data)
    return data
  } catch (error) {
    // console.log(error)
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
export async function updateLink ({ items }) {
  if (!items || items.length === 0) {
    // console.log('No hay cambios para enviar a la base de datos')
    return { success: true, message: 'No changes to update' }
  }

  // Asegurar que items es un array
  const itemsArray = Array.isArray(items) ? items : [items]

  // console.log('📤 Enviando al backend:', itemsArray)

  const response = await fetch(`${constants.BASE_API_URL}/links`, {
    method: 'PATCH',
    credentials: 'include',
    ...constants.FETCH_OPTIONS,
    body: JSON.stringify({
      updates: itemsArray.map(item => ({
        id: item.id || item._id,
        oldCategoryId: item.oldCategoryId || undefined,
        destinyIds: item.destinyIds || undefined,
        previousIds: item.previousIds || undefined,
        fields: {
          name: item.name ?? undefined,
          url: item.url ?? undefined,
          description: item.description ?? undefined,
          imgUrl: item.url ? constants.BASE_LINK_IMG_URL(item.url) : undefined,
          notes: item.notes ?? undefined,
          bookmark: item.bookmark ?? undefined,
          bookmarkOrder: item.bookmarkOrder ?? undefined,
          categoryId: item.categoryId ?? undefined,
          order: item.order ?? undefined,
          extractedArticle: item.extractedArticle === null ? null : undefined
        }
      }))
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to update items: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()
  // console.log(`Successfully updated ${itemsArray.length} items`)
  return result
}
export async function setBookMarksOrder ({ links }) {
  return fetch(`${constants.BASE_API_URL}/links/setbookmarksorder`, {
    method: 'PATCH',
    ...constants.FETCH_OPTIONS,
    body: JSON.stringify({ links })
  })
    .then(res => res.json())
    .then(data => {
      return data
    })
    .catch(err => {
      // console.log(err)
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
      // console.log(data)
      return data
    } else {
      const data = await res.json()
      // console.log(data)
      return data
    }
  } catch (error) {
    // console.log(error)
    return error
  }
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
      // console.log(data)
      return data
    } else {
      const data = await res.json()
      // console.log(data)
      return data
    }
  } catch (error) {
    // console.log(error)
    return error
  }
}

/* --------------- CATEGORIES AKA COLUMNS -------------------- */
export const updateDbAfterDrag = async (draggedItemOrArray, targetItem = null, position = null, finalItems = null) => {
  try {
    // Si recibimos un array en lugar de draggedItem, usar la nueva lógica optimizada
    if (Array.isArray(draggedItemOrArray)) {
      return await handleOptimizedUpdate(draggedItemOrArray)
    }

    // Si recibimos un solo objeto sin otros parámetros, también usar lógica optimizada
    if (!targetItem && !position && !finalItems) {
      // Es un objeto individual (caso de anidamiento)
      return await handleOptimizedUpdate([draggedItemOrArray])
    }

    // Lógica original para compatibilidad hacia atrás
    // const updateType = position === 'inside' ? 'nesting' : 'reordering'

    // if (updateType === 'nesting') {
    //   // Anidamiento: actualizar level y parentId
    //   const nestingResult = await handleNestingUpdate(draggedItemOrArray, targetItem, finalItems)
    //   return nestingResult
    // } else {
    //   // Reordenamiento: actualizar solo order (y posiblemente level si cambió de nivel)
    //   const reorderingResult = await handleReorderingUpdate(draggedItemOrArray, targetItem, finalItems)
    //   return reorderingResult
    // }
  } catch (error) {
    console.error('Error updating database:', error)
    throw error
    // toast.error('Error al actualizar la estructura')
    // TODO: Implementar rollback del estado local
  }
}

// Nueva función para manejar updates optimizados
const handleOptimizedUpdate = async (changedItems) => {
  if (!changedItems || changedItems.length === 0) {
    // console.log('No hay cambios para enviar a la base de datos')
    return { success: true, message: 'No changes to update' }
  }

  // Asegurar que changedItems es un array
  const itemsArray = Array.isArray(changedItems) ? changedItems : [changedItems]

  // console.log('📤 Enviando al backend:', itemsArray)

  const response = await updateCategory({ items: itemsArray })

  if (response.success !== true) {
    throw new Error(`Failed to update items: ${response.status} ${response.statusText}`)
  }

  // const result = await response.json()
  // console.log(response)
  return response
}

export async function updateCategory ({ items }) {
  if (!items || items.length === 0) {
    // console.log('No hay cambios para enviar a la base de datos')
    return { success: true, message: 'No changes to update' }
  }

  // Asegurar que items es un array
  const itemsArray = Array.isArray(items) ? items : [items]

  // console.log('📤 Enviando al backend:', itemsArray)

  const response = await fetch(`${constants.BASE_API_URL}/categories`, {
    method: 'PATCH',
    credentials: 'include',
    ...constants.FETCH_OPTIONS,
    body: JSON.stringify({
      updates: itemsArray.map(item => ({
        id: item.id || item._id,
        oldParentId: item.oldParentId || undefined,
        fields: {
          order: item.order ?? undefined,
          level: item.level ?? undefined,
          parentId: item.level === 0 ? null : item.parentId,
          parentSlug: item.level === 0 ? null : item.parentSlug,
          name: item.name ?? undefined,
          hidden: item.hidden ?? undefined,
          isEmpty: item.isEmpty ?? undefined,
          displayName: item.displayName ?? undefined
        }
      }))
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to update items: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()
  // console.log(`Successfully updated ${itemsArray.length} items`)
  return result
}

// DeleteColConfirmForm
export async function deleteColumn ({ id, level }) {
  try {
    const body = { id, level }
    const res = await fetch(`${constants.BASE_API_URL}/categories`, {
      method: 'DELETE',
      ...constants.FETCH_OPTIONS,
      body: JSON.stringify(body)
    })
    if (res.ok) {
      const data = await res.json()
      // console.log(data)
      return data
    } else {
      const data = await res.json()
      // console.log(data)
      return data
    }
  } catch (error) {
    // console.log(error)
    return error
  }
}
// SideInfo
export async function createColumn ({ name, parentId, order, level }) {
  try {
    const body = { name, parentId, order, level }
    // console.log(body)
    const res = await fetch(`${constants.BASE_API_URL}/categories`, {
      method: 'POST',
      ...constants.FETCH_OPTIONS,
      body: JSON.stringify(body)
    })
    if (res.ok) {
      const data = await res.json()
      // console.log(data)
      return data
    } else {
      const data = await res.json()
      // console.log(data)
      return data
    }
  } catch (error) {
    console.error('Error de red:', error)
    return error
  }
}

/* --------------- STORAGE -------------------- */

// CustomizeDesktopPanel
export async function changeBackgroundImage (event) {
  const nombre = event.target.alt
  if (event.target.nodeName === 'IMG') {
    // console.log('fetch')
    return fetch(`${constants.BASE_API_URL}/storage/backgroundurl?nombre=${nombre}`, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
      .then(res => res.json())
      .then(data => {
        const element = document.querySelector('#root')
        element.setAttribute('data-background', 'image')
        element.style.background = `url(${data.data})`
        element.style.backgroundSize = 'cover'
        element.style.backgroundAttachment = 'fixed'
        window.localStorage.setItem('bodyBackground', JSON.stringify(`${data.data}`))
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
      return data
    })
    .catch(error => {
      return error
    })
}
export async function getLinkImages ({ linkId }) {
  try {
    const res = await fetch(`${constants.BASE_API_URL}/storage/link/${linkId}/images`, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
    if (res.ok) {
      const data = await res.json()
      return data
    } else {
      const error = await res.json()
      return error
    }
  } catch (error) {
    return error
  }
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
      ...constants.STORAGE_FETCH_OPTIONS,
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
    return { error: 'Sin conexión con servidor, inténtalo más tarde' } // TODO hacerlo con todos
  }
}
// DeleteImageConfirmForm
export async function deleteImage ({ imageKey, linkId }) {
  try {
    let body = {
      image: imageKey,
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
      // console.log(result)
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
        // console.log(error)
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
    // console.log(formData)
    try {
      const response = await fetch(`${constants.BASE_API_URL}/storage/icon`, {
        method: 'POST',
        ...constants.STORAGE_FETCH_OPTIONS,
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
      ...constants.STORAGE_FETCH_OPTIONS,
      body: formData
    })

    if (response.ok) {
      const result = await response.json()
      return result
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error)
    return ('Error al realizar la solicitud')
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
      return result
    }
  } catch (error) {
    // console.log(error)
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
        ...constants.STORAGE_FETCH_OPTIONS,
        body: formData
      })
      if (response.ok) {
        const result = await response.json()
        return result.data.url
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
      // console.log(err)
      return err
    })
}
export async function deleteAccount ({ email }) {
  try {
    const query = await fetch(`${constants.BASE_API_URL}/auth/deleteuser`, {
      method: 'DELETE',
      ...constants.FETCH_OPTIONS,
      body: JSON.stringify({ email })
    })
    const result = await query.json()
    if (!query.ok) {
      console.error(result)
      return result
    } else {
      return result
    }
  } catch (error) {
    // console.log(error)
    return error
  }
}
export const sendLogoutSignal = async ({ idToken, csrfToken }) => {
  const body = { idToken, csrfToken }
  return fetch(`${constants.BASE_API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    ...constants.FETCH_OPTIONS,
    body: JSON.stringify(body)
  })
}
