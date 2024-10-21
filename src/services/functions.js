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
      // console.log(data)
      return data
    } else {
      const data = await response.json()
      console.log(data)
    }
  } catch (error) {
    return { error }
  }
}
export function formatPath (path) {
  const decodedPath = decodeURIComponent(path)
  const formattedPath = decodedPath.replace(/\s+/g, '-').toLowerCase()
  console.log('🚀 ~ file: formatUrl.js:6 ~ formatUrl ~ formattedUrl:', formattedPath)
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
  // console.log(resultado)
  return resultado
}
export async function getUrlStatus (url) {
  // console.log('🚀 ~ file: sidepanel.js:644 ~ getUrlStatus ~ url:', url)
  // console.log('Funciona Status')
  const query = await fetch(`${constants.BASE_API_URL}/links/status?url=${url}`, {
    method: 'GET',
    ...constants.FETCH_OPTIONS
  })
  const res = await query.json()
  // console.log(res)
  // const holder = document.getElementById('lactive')
  const firstKey = Object.keys(res)[0]
  const firstValue = res[firstKey]
  let icon
  if (firstKey === 'error' || firstKey === 'errors') {
    if (firstKey === 'errors') {
      // icon = convertHtmlEntityToEmoji('&#x1F198;')
      icon = false
    } else {
      // icon = convertHtmlEntityToEmoji('&#x1F198;')
      icon = false
    }
    return icon
  } else {
    if (firstValue === 'success' || firstValue === 'redirect') {
      // icon = convertHtmlEntityToEmoji('&#x1F197;')
      icon = true
    }
    if (firstValue === 'clientErr' || firstValue === 'serverErr') {
      // icon = convertHtmlEntityToEmoji('&#x1F198;')
      icon = true
    }
    return icon
  }
}
export function handleResponseErrors (response) {
  if (response.status !== 'success' || !response.status) {
    // return { hasError: true, message: 'Error al efectuar la operación' }
    return { hasError: true, message: response.error || 'Error al efectuar la operación' }
  }
  // if (response.status === 'error') {
  //   // return { hasError: true, message: 'Error al efectuar la operación' }
  //   return { hasError: true, message: response.error?.message }
  // }
  return { hasError: false, message: '' }
}
// function convertHtmlEntityToEmoji (htmlEntity) {
//   // Elimina los primeros tres caracteres ('&#x') y el último (';'), luego convierte el resultado de hexadecimal a decimal
//   const codePoint = parseInt(htmlEntity.slice(3, -1), 16)
//   return String.fromCodePoint(codePoint)
// }
