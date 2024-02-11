import { useRef } from 'react'
import { constants } from '../services/constants'
import { useLinksStore } from '../store/links'
import { useGlobalStore } from '../store/global'

export function usePasteLink ({ params, desktopName, activeLocalStorage }) {
  const setLinkLoader = useLinksStore(state => state.setLinkLoader)
  const setColumnLoaderTarget = useLinksStore(state => state.setColumnLoaderTarget)
  const setPastedLinkId = useLinksStore(state => state.setPastedLinkId)
  const setNumberOfPastedLinks = useLinksStore(state => state.setNumberOfPastedLinks)
  const columnRef = useRef(document.getElementById(params._id))
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)

  async function pasteLink () {
    setLinkLoader(true) // estamos usando???
    console.log('Ejecuto')
    // lee el contenido del portapapeles entonces ...
    // Arrow function anónima con los items de param
    navigator.clipboard.read().then(clipboardItems => {
      // por cada clipboardItem ...
      for (const clipboardItem of clipboardItems) {
        // Si el length de la propiedad types es 1, es texto plano
        if (clipboardItem.types.length === 1) {
          // lo confirmamos
          for (const type of clipboardItem.types) {
            if (type === 'text/plain') {
              handlePastedTextLinks(clipboardItem, type, params, desktopName, activeLocalStorage)
              console.log('Texto plano')
            }
          }
        } else {
          for (const type of clipboardItem.types) {
            if (type === 'text/html') {
              handlePastedHtmlLinks(event, clipboardItem, type, params, desktopName, activeLocalStorage)
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
  const handlePastedTextLinks = (clipboardItem, type, params, desktopName, activeLocalStorage) => {
    // Pasamos el blob a texto
    clipboardItem.getType(type).then(blob => {
      blob.text().then(text => {
        console.log(text)
        // Si tiene un enlace
        if (text.indexOf('http') === 0) {
          const urls = text.match(/https?:\/\/[^\s]+/g)
          if (urls.length > 1) {
            console.log('entramos')
            pasteMultipleLinks(urls, params, desktopName, activeLocalStorage)
            console.log('muchos links')
            return
          }
          console.log('Tiene un enlace')
          processTextLinks(text, params, desktopName, activeLocalStorage)
        } else {
          console.log('Es texto plano sin enlace')
          console.log(text)
        }
      })
    })
  }
  async function processTextLinks (text, params, desktopName, activeLocalStorage) {
    console.log(text)
    const orden = columnRef.current.childNodes.length ? columnRef.current.childNodes.length - 1 : 0
    const nombre = await getNameByUrl({ url: text }) // Iniciar el proceso de carga dentro de la función

    const body = {
      idpanel: params._id,
      data: [{
        idpanel: params._id,
        name: nombre,
        URL: text,
        imgURL: `${constants.BASE_LINK_IMG_URL(text)}`,
        orden,
        escritorio: params.escritorio,
        panel: params.name
      }]
    }
    try {
      const res = await fetch(`${constants.BASE_API_URL}/links`, {
        method: 'POST',
        ...constants.FETCH_OPTIONS,
        body: JSON.stringify(body)
      })
      if (res.ok) {
        const data = await res.json()
        console.log(data)
        const { link } = data
        const newList = [...globalLinks, link]
        setColumnLoaderTarget(columnRef.current)
        setTimeout(() => {
          setLinkLoader(false)
          setGlobalLinks(newList) // hay que actualizar globalLinks
          setColumnLoaderTarget(null)
        }, 1000)
        setPastedLinkId([link._id])
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
    clipboardItem.getType(type).then(blob => {
      blob.text().then(text => {
        if (text.indexOf('<a href') === 0) {
          console.log('Es un enlace html')
          console.log(text)
          console.log(typeof (text))
          processHtmlLink(text, params, linksStore, setLinksStore, desktopName, activeLocalStorage)
        } else {
          console.log('No hay enlace')
        }
      })
    })
  }
  async function processHtmlLink (text, params, desktopName, activeLocalStorage) {
    const orden = columnRef.current.childNodes.length ? columnRef.current.childNodes.length - 1 : 0
    const range = document.createRange()
    range.selectNode(document.body)
    const fragment = range.createContextualFragment(text)
    const a = fragment.querySelector('a')
    const url = a.href
    const nombre = a.innerText
    const escritorio = params.escritorio

    const body = {
      idpanel: params._id,
      data: [{
        idpanel: params._id,
        name: nombre,
        URL: url,
        imgURL: `${constants.BASE_LINK_IMG_URL(url)}`,
        orden,
        escritorio,
        panel: params.name
      }]
    }
    try {
      const res = await fetch(`${constants.BASE_API_URL}/links`, {
        method: 'POST',
        ...constants.FETCH_OPTIONS,
        body: JSON.stringify(body)
      })
      if (res.ok) {
        const data = await res.json()
        const { link } = data
        const newList = [...globalLinks, link]
        setColumnLoaderTarget(columnRef.current)
        setTimeout(() => {
          setLinkLoader(false)
          setGlobalLinks(newList)
          setColumnLoaderTarget(null)
        }, 1000)
        setPastedLinkId([link._id])
        activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.toSorted((a, b) => (a.orden - b.orden))))
      } else {
        const data = await res.json()
        console.log(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  async function pasteMultipleLinks (array, params, desktopName, activeLocalStorage) {
    let orden = columnRef.current.childNodes.length ? columnRef.current.childNodes.length - 2 : 0 // que pasa si está vacia? 1 - 2 = -1 orden++ = 0
    const bodies = array.map(link => {
      orden++
      return {
        idpanel: params._id,
        data: [{
          idpanel: params._id,
          escritorio: params.escritorio,
          panel: params.name,
          URL: link,
          imgURL: `${constants.BASE_LINK_IMG_URL(link)}`,
          orden
        }]
      }
    })
    for (const bodie of bodies) {
      bodie.data[0].name = await getNameByUrl({ url: bodie.data[0].URL })
      console.log(bodie)
    }
    setNumberOfPastedLinks(bodies.length)
    const requests = bodies.map(async body => {
      try {
        const res = await fetch(`${constants.BASE_API_URL}/links`, {
          method: 'POST',
          ...constants.FETCH_OPTIONS,
          body: JSON.stringify(body)
        })
        if (res.ok) {
          const data = await res.json()
          return data.link
        } else {
          const data = await res.json()
          console.log(data)
        }
      } catch (error) {
        console.log(error)
      }
    })

    const links = await Promise.all(requests)
    const newList = [...globalLinks, ...links]
    setColumnLoaderTarget(columnRef.current)
    setTimeout(() => {
      setLinkLoader(false)
      setGlobalLinks(newList)
      setColumnLoaderTarget(null)
    }, 1000)
    setPastedLinkId([...links.map(link => link._id)])
    activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.toSorted((a, b) => (a.orden - b.orden))))
  }
  async function getNameByUrl ({ url }) {
    console.log(url)
    const res = await fetch(`${constants.BASE_API_URL}/links/getname?url=${url}`, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
    if (!res.ok) {
      return { status: res.status, statusText: res.statusText }
    }
    const title = await res.text()
    console.log(title)
    return title
  }
  return { pasteLink }
}
