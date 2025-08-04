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
export async function editLink ({ id, name, URL, description, notes, bookmark, bookmarkOrder }) {
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
        notes,
        bookmark,
        bookmarkOrder
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
    const updateType = position === 'inside' ? 'nesting' : 'reordering'

    if (updateType === 'nesting') {
      // Anidamiento: actualizar level y parentId
      const nestingResult = await handleNestingUpdate(draggedItemOrArray, targetItem, finalItems)
      return nestingResult
    } else {
      // Reordenamiento: actualizar solo order (y posiblemente level si cambió de nivel)
      const reorderingResult = await handleReorderingUpdate(draggedItemOrArray, targetItem, finalItems)
      return reorderingResult
    }
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
    console.log('No hay cambios para enviar a la base de datos')
    return { success: true, message: 'No changes to update' }
  }

  // Asegurar que changedItems es un array
  const itemsArray = Array.isArray(changedItems) ? changedItems : [changedItems]

  console.log('📤 Enviando al backend:', itemsArray)

  const response = await fetch(`${constants.BASE_API_URL}/categories/reorder`, {
    method: 'POST',
    credentials: 'include',
    ...constants.FETCH_OPTIONS,
    body: JSON.stringify({
      updates: itemsArray.map(item => ({
        itemId: item._id,
        newOrder: item.order,
        newLevel: item.level,
        parentId: item.parentId,
        parentSlug: item.parentSlug
      }))
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to update items: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()
  console.log(`Successfully updated ${itemsArray.length} items`)
  return result
}

const handleNestingUpdate = async (draggedItem, targetItem, finalItems) => {
  const updatedItem = findUpdatedItem(finalItems, draggedItem._id)

  const response = await fetch(`${constants.BASE_API_URL}/categories/nest`, {
    method: 'POST',
    credentials: 'include',
    ...constants.FETCH_OPTIONS,
    body: JSON.stringify({
      itemId: draggedItem._id,
      parentId: targetItem._id,
      parentSlug: targetItem.slug,
      newLevel: updatedItem.level,
      newOrder: updatedItem.order
    })
  })

  if (!response.ok) {
    throw new Error('Failed to nest item')
  }
  return response.json()
}

const handleReorderingUpdate = async (draggedItem, targetItem, finalItems) => {
  // Obtener todos los items que cambiaron de orden en el mismo nivel
  const affectedItems = getAffectedItems(finalItems, draggedItem, targetItem)

  const response = await fetch(`${constants.BASE_API_URL}/categories/reorder`, {
    method: 'POST',
    credentials: 'include',
    ...constants.FETCH_OPTIONS,
    body: JSON.stringify({
      updates: affectedItems.map(item => ({
        itemId: item._id,
        newOrder: item.order,
        newLevel: item.level,
        parentId: item.parentId,
        parentSlug: item.parentSlug
      }))
    })
  })

  if (!response.ok) {
    throw new Error('Failed to reorder items')
  }
  return response.json()
}
// Encuentra un item específico en la estructura final
const findUpdatedItem = (items, itemId) => {
  const findInItems = (currentItems) => {
    for (const item of currentItems) {
      if (item._id === itemId) return item
      if (item.children) {
        const found = findInItems(item.children)
        if (found) return found
      }
    }
    return null
  }
  return findInItems(items)
}

// Encuentra el slug de un padre específico
const findParentSlug = (items, parentId) => {
  const findInItems = (currentItems) => {
    for (const item of currentItems) {
      if (item._id === parentId) return item.slug
      if (item.children) {
        const found = findInItems(item.children)
        if (found) return found
      }
    }
    return null
  }
  return findInItems(items)
}

// Obtiene todos los items afectados por el reordenamiento
const getAffectedItems = (finalItems, draggedItem, targetItem) => {
  const affected = []

  // Verificar que finalItems existe y es un array
  if (!finalItems || !Array.isArray(finalItems)) {
    console.warn('getAffectedItems: finalItems is not a valid array', finalItems)
    return affected
  }

  const collectItems = (currentItems, level = 0, parentId = null) => {
    if (!currentItems || !Array.isArray(currentItems)) {
      console.warn('collectItems: currentItems is not a valid array', currentItems)
      return
    }

    currentItems.forEach((item, index) => {
      affected.push({
        _id: item._id,
        order: index,
        level,
        parentId,
        parentSlug: parentId ? findParentSlug(finalItems, parentId) : null
      })

      if (item.children && item.children.length > 0) {
        collectItems(item.children, level + 1, item._id)
      }
    })
  }

  collectItems(finalItems)
  return affected
}
// Column, ContextualColMenu, useDragItems
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

// Anidar desktop
export async function nestDesktop ({ desktopId, parentId, level }) {
  try {
    const body = { desktopId, parentId, level }
    const response = await fetch(`${constants.BASE_API_URL}/desktops/nest`, {
      method: 'PATCH',
      ...constants.FETCH_OPTIONS,
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error('Error al anidar desktop')
    }

    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error de red:', error)
    return { hasError: true, message: 'Error al anidar desktop' }
  }
}

// Desanidar desktop
export async function unnestDesktop ({ desktopId }) {
  try {
    const body = { desktopId }
    const response = await fetch(`${constants.BASE_API_URL}/desktops/unnest`, {
      method: 'PATCH',
      ...constants.FETCH_OPTIONS,
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error('Error al desanidar desktop')
    }

    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error de red:', error)
    return { hasError: true, message: 'Error al desanidar desktop' }
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
        const element = document.querySelector('#root')
        element.setAttribute('data-background', 'image')
        element.style.background = `url(${data})`
        element.style.backgroundSize = 'cover'
        element.style.backgroundAttachment = 'fixed'
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
    return { error: 'Sin conexión con servidor, inténtalo más tarde' } // TODO hacerlo con todos
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
    console.log(error)
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
