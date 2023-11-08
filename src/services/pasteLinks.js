export async function pasteLink ({ params, linksStore, setLinksStore, desktopName, activeLocalStorage }) {
  console.log('Ejecuto')
  // lee el contenido del portapapeles entonces ...
  // Arrow function anónima con los items de param
  navigator.clipboard.read().then((clipboardItems) => {
    // por cada clipboardItem ...
    for (const clipboardItem of clipboardItems) {
      // Si el length de la propiedad types es 1, es texto plano
      if (clipboardItem.types.length === 1) {
        // lo confirmamos
        for (const type of clipboardItem.types) {
          if (type === 'text/plain') {
            handlePastedTextLinks(event, clipboardItem, type, params, linksStore, setLinksStore, desktopName, activeLocalStorage)
            console.log('Texto plano')
          }
        }
      } else {
        for (const type of clipboardItem.types) {
          if (type === 'text/html') {
            handlePastedHtmlLinks(event, clipboardItem, type, params, linksStore, setLinksStore, desktopName, activeLocalStorage)
            console.log('html text')
          }
          if (type.startsWith('image/')) {
            clipboardItem.getType(type).then((blob) => {
              console.log('Es una immagen:', blob)
            })
          }
        }
      }
    }
  })
}
const handlePastedTextLinks = (event, clipboardItem, type, params, linksStore, setLinksStore, desktopName, activeLocalStorage) => {
  // Pasamos el blob a texto
  clipboardItem.getType(type).then((blob) => {
    blob.text().then(function (text) {
      console.log(text)
      // Si tiene un enlace
      if (text.indexOf('http') === 0) {
        const urls = text.match(/https?:\/\/[^\s]+/g)
        if (urls.length > 1) {
          console.log('entramos')
          // const raiz = event.target.parentNode.childNodes[1].innerText
          pasteMultipleLinks(urls, params, linksStore, setLinksStore, desktopName, activeLocalStorage)
          console.log('muchos links')
          return
        }
        console.log('Tiene un enlace')
        processTextLinks(event, text, params, linksStore, setLinksStore, desktopName, activeLocalStorage)
      } else {
        console.log('Es texto plano sin enlace')
        console.log(text)
      }
    })
  })
}
async function processTextLinks (event, text, params, linksStore, setLinksStore, desktopName, activeLocalStorage) {
  const nombre = await getNameByUrl(text)
  const escritorio = params.escritorio
  const url = text
  const columna = params.name
  const raiz = params._id
  const orden = 0

  const body = {
    idpanel: raiz,
    data: [{
      idpanel: raiz,
      name: nombre,
      URL: url,
      imgURL: `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=128`,
      orden,
      escritorio,
      panel: columna
    }]

  }
  try {
    const res = await fetch('http://localhost:3003/api/links', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    if (res.ok) {
      const data = await res.json()
      console.log(data)
      const newList = [...linksStore, data]
      setLinksStore(newList)
      activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.toSorted((a, b) => (a.orden - b.orden))))
    } else {
      const data = await res.json()
      console.log(data)
    }
  } catch (error) {
    console.log(error)
  }
}
const handlePastedHtmlLinks = (event, clipboardItem, type, params, linksStore, setLinksStore, desktopName, activeLocalStorage) => {
  clipboardItem.getType(type).then((blob) => {
    blob.text().then(function (text) {
      if (text.indexOf('<a href') === 0) {
        console.log('Es un enlace html')
        console.log(text)
        console.log(typeof (text))
        processHtmlLink(event, text, params, linksStore, setLinksStore, desktopName, activeLocalStorage)
      } else {
        console.log('No hay enlace')
      }
    })
  })
}
async function processHtmlLink (event, text, params, linksStore, setLinksStore, desktopName, activeLocalStorage) {
  const raiz = params._id
  const range = document.createRange()
  range.selectNode(document.body)
  const fragment = range.createContextualFragment(text)
  const a = fragment.querySelector('a')
  const url = a.href
  const nombre = a.innerText
  const escritorio = params.escritorio
  const columna = params.name
  const orden = 0

  const body = {
    idpanel: raiz,
    data: [{
      idpanel: raiz,
      name: nombre,
      URL: url,
      imgURL: `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=128`,
      orden,
      escritorio,
      panel: columna
    }]
  }
  try {
    const res = await fetch('http://localhost:3003/api/links', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(body)
    }) // Manejo errores
    if (res.ok) {
      const data = await res.json()
      const newList = [...linksStore, data]
      setLinksStore(newList)
      activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.toSorted((a, b) => (a.orden - b.orden))))
    } else {
      const data = await res.json()
      console.log(data)
    }
  } catch (error) {
    console.log(error)
  }
}
async function pasteMultipleLinks (array, params, linksStore, setLinksStore, desktopName, activeLocalStorage) {
  const escritorio = params.escritorio
  const columna = params.name
  const body = {
    idpanel: params._id,
    data: array.map(link => {
      return {
        idpanel: params._id,
        escritorio,
        panel: columna,
        URL: link,
        imgURL: `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${link}&size=64`
      }
    })
  }
  try {
    const res = await fetch('http://localhost:3003/api/links', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    if (res.ok) {
      const data = await res.json()
      const newList = [...linksStore, ...data]
      setLinksStore(newList)
      activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.toSorted((a, b) => (a.orden - b.orden))))
    } else {
      const data = await res.json()
      console.log(data)
    }
  } catch (error) {
    console.log(error)
  }
}
async function getNameByUrl (url) {
  const res = await fetch(`http://localhost:3003/api/linkName?url=${url}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  })
  // eslint-disable-next-line no-throw-literal
  if (!res.ok) throw { status: res.status, statusText: res.statusText }
  const title = await res.text()
  console.log(title)
  return title
}
