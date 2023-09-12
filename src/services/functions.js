import { constants } from './constants'
export function setCookie (name, value, days, domain) {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + value + expires + '; path=/; domain=' + domain
}
export const videoUrlsObj = {
  Youtube: {
    url: /^https:\/\/www\.youtube\.com\/watch\?(?!.*&list=PL)/,
    embedURL: 'https://www.youtube.com/embed/',
    extractParam: function (url) {
      return url.split('=')[1]
    }
  },
  YoutubeList: {
    url: /^https:\/\/www\.youtube\.com\/watch.*&list=PL/,
    embedURL: 'https://www.youtube.com/embed/',
    extractParam: function (url) {
      const videoIdMatch = url.match(/v=([^&]+)/)
      const playlistIdMatch = url.match(/list=([^&]+)/)

      if (videoIdMatch && playlistIdMatch) {
        const videoId = videoIdMatch[1]
        const playlistId = playlistIdMatch[1]
        return `${videoId}?list=${playlistId}`
      }
    }
  },
  Pornhub: {
    url: 'https://es.pornhub.com/view_video',
    embedURL: 'https://www.pornhub.com/embed/',
    extractParam: function (url) {
      return url.split('=')[1]
    }
  },
  Xvideos: {
    url: 'https://www.xvideos.com/video',
    embedURL: 'https://www.xvideos.com/embedframe/',
    extractParam: function (url) {
      const regex = /video(\d+)/i
      const match = url.match(regex)
      if (match && match[1]) {
        return match[1]
      }
    }
  }
}
export function checkUrlMatch (url) {
  for (const key in videoUrlsObj) {
    if (Object.prototype.hasOwnProperty.call(videoUrlsObj, key)) {
      const videoUrl = videoUrlsObj[key]

      if (
        (videoUrl.url instanceof RegExp && videoUrl.url.test(url)) || // Si es una expresión regular
        (typeof videoUrl.url === 'string' && url.includes(videoUrl.url)) // Si es un string
      ) {
        const extractedParam = videoUrl.extractParam(url)
        return videoUrl.embedURL + extractedParam
      }
    }
  }
  return null // Si no hay coincidencia
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
    } else {
      const data = await res.json()
      console.log(data)
    }
  } catch (error) {
    console.log(error)
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
      console.log(data)
    } else {
      const data = await res.json()
      console.log(data)
    }
  } catch (error) {
    console.log(error)
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
    } else {
      const data = await res.json()
      console.log(data)
    }
  } catch (error) {
    console.log(error)
  }
}
export function saludo (user) {
  const fecha = new Date()
  const hora = fecha.getHours()
  let frase

  if (hora >= 7 && hora < 14) {
    frase = `Buenos días ${user}`
  } else if (hora >= 14 && hora < 20) {
    frase = `Buenas tardes ${user}`
  } else {
    frase = `Buenas noches ${user}`
  }

  return frase
}
export function hora () {
  const fecha = new Date()
  const hora = fecha.getHours()
  const min = fecha.getMinutes()
  const text = `${hora < 10 ? '0' : ''}${hora}:${min < 10 ? '0' : ''}${min}`

  return text
}
export const searchLinks = async ({ search }) => {
  if (search === '') return null
  try {
    const response = await fetch(`${constants.BASE_API_URL}/search?query=${search}`)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      return data
    } else {
      const data = await response.json()
      console.log(data)
    }
  } catch (error) {
    return { error }
  }
}
