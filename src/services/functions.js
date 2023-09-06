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
