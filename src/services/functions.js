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
export function getCookie (name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
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
  YoutubeShort: {
    url: /^https:\/\/www\.youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    embedURL: 'https://www.youtube.com/embed/',
    extractParam: function (url) {
      return url.split('/')[4]
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
  if (url === '' || url === null || url === undefined) return null
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
// export function saludo (user) {
//   const fecha = new Date()
//   const hora = fecha.getHours()
//   let frase

//   if (hora >= 7 && hora < 14) {
//     frase = `Buenos días ${user}`
//   } else if (hora >= 14 && hora < 20) {
//     frase = `Buenas tardes ${user}`
//   } else {
//     frase = `Buenas noches ${user}`
//   }

//   return frase
// }
// export function hora () {
//   const fecha = new Date()
//   const hora = fecha.getHours()
//   const min = fecha.getMinutes()
//   const text = `${hora < 10 ? '0' : ''}${hora}:${min < 10 ? '0' : ''}${min}`

//   return text
// }
export const searchLinks = async ({ search }) => {
  if (search === '') return null
  try {
    const response = await fetch(`${constants.BASE_API_URL}/search?query=${search}`, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
    if (response.ok) {
      const data = await response.json()
      // //console.log(data)
      return data
    } else {
      // const data = await response.json()
      // console.log(data)
    }
  } catch (error) {
    return { error }
  }
}
export function formatPath (path) {
  const decodedPath = decodeURIComponent(path)
  const formattedPath = decodedPath.replace(/\s+/g, '-').toLowerCase()
  // //console.log('🚀 ~ file: formatUrl.js:6 ~ formatUrl ~ formattedUrl:', formattedPath)
  const normalizedPath = formattedPath.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return normalizedPath
}
export function kebabToTitleCase (kebabStr) {
  if (kebabStr === undefined || kebabStr === null) return ''
  // Dividir la cadena en palabras separadas por guiones
  const words = kebabStr.split('-')

  // Convertir la primera letra de cada palabra a mayúscula y el resto en minúscula
  const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

  // Unir las palabras con un espacio
  return capitalizedWords.join(' ')
}
export function formatDate (date) {
  const fecha = new Date(date)

  const opcionesFecha = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  const opcionesHora = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  }

  const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha)
  const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora)

  const resultado = fechaFormateada + ' ' + horaFormateada
  // //console.log(resultado)
  return resultado
}
export async function getUrlStatus (url) {
  try {
    const response = await fetch(`${constants.BASE_API_URL}/links/status?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
    const res = await response.json()
    const data = res.data || {}
    const firstKey = Object.keys(data)[0]
    const firstValue = data[firstKey]

    if (firstKey === 'error' || firstKey === 'errors') {
      return false
    }

    if (firstValue === 'success' || firstValue === 'redirect') {
      return true
    }
    if (firstValue === 'clientErr' || firstValue === 'serverErr') {
      return true
    }

    // Si no coincide ningún caso conocido, devuelve null
    return null
  } catch (error) {
    console.error('Error en getUrlStatus:', error)
    return null
  }
}
export function handleResponseErrors (response) {
  if (response.success !== true) {
    return { hasError: true, message: response.message || 'Error al efectuar la operación', error: response.error || '' }
  }
  return { hasError: false, message: '' }
}
export function keepServerAwake (apiUrl, intervalMinutes = 14) {
  const wakeUp = async () => {
    try {
      await fetch(apiUrl)
      // console.log('Server pinged at:', new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Ping failed:', error)
      // toast.error('Servidor no disponible en estos momentos', { toastId: 'server-error' })
    }
  }

  //   // Ejecutar inmediatamente y luego periódicamente
  wakeUp()
  return setInterval(wakeUp, intervalMinutes * 60 * 1000)
}
export function getFileNameFromUrl (url) {
  const decodedUrl = decodeURIComponent(url)
  // Busca el último segmento después de la última barra
  const match = decodedUrl.match(/\/(\d+-\d+\.(png|jpg|jpeg|svg|gif|webp))(\?|$)/i)
  return match ? match[1] : null
}
// function convertHtmlEntityToEmoji (htmlEntity) {
//   // Elimina los primeros tres caracteres ('&#x') y el último (';'), luego convierte el resultado de hexadecimal a decimal
//   const codePoint = parseInt(htmlEntity.slice(3, -1), 16)
//   return String.fromCodePoint(codePoint)
// }
