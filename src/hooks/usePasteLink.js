import { useRef } from 'react'
import { toast } from 'react-toastify'
import { constants } from '../services/constants'
import { addLink } from '../services/dbQueries'
import { handleResponseErrors } from '../services/functions'
import { useGlobalStore } from '../store/global'
import { useLinksStore } from '../store/links'

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
    // lee el contenido del portapapeles entonces ...
    // Arrow function anónima con los items de param
    navigator.clipboard.read().then(clipboardItems => {
      // por cada clipboardItem ...
      for (const clipboardItem of clipboardItems) {
        console.log('🚀 ~ pasteLink ~ clipboardItem:', clipboardItem)
        // Si el length de la propiedad types es 1, es texto plano
        if (clipboardItem.types.length === 1) {
          // lo confirmamos
          for (const type of clipboardItem.types) {
            console.log(type)
            if (type === 'text/plain') {
              handlePastedTextLinks(clipboardItem, type, params, desktopName, activeLocalStorage)
              // console.log('Texto plano')
            }
          }
        } else {
          for (const type of clipboardItem.types) {
            console.log(type)
            if (type === 'text/html') {
              handlePastedHtmlLinks(event, clipboardItem, type, params, desktopName, activeLocalStorage)
              // console.log('html text')
            }
            if (type.startsWith('image/')) {
              clipboardItem.getType(type).then((blob) => {
                // console.log('Es una immagen:', blob)
              })
            }
          }
        }
      }
    })
  }
  const handlePastedTextLinks = (clipboardItem, type, params) => {
    // Pasamos el blob a texto
    clipboardItem.getType(type).then(blob => {
      blob.text().then(text => {
        console.log(text)
        // Si tiene un enlace
        if (text.indexOf('http') === 0) {
          const urls = text.match(/https?:\/\/[^\s]+/g)
          if (urls.length > 1) {
            // console.log('entramos')
            pasteMultipleLinks(urls, params)
            // console.log('muchos links')
            return
          }
          // console.log('Tiene un enlace')
          processTextLinks(text, params)
        } else {
          // console.log('Es texto plano sin enlace')
          // console.log(text)
        }
      })
    })
  }
  async function processTextLinks (text, params) {
    // console.log(text)
    const order = columnRef.current.childNodes.length ? columnRef.current.childNodes.length - 1 : 0
    const nombre = await getNameByUrl({ url: text }) // Iniciar el proceso de carga dentro de la función

    const body = {
      categoryId: params._id,
      name: nombre,
      url: text,
      imgUrl: `${constants.BASE_LINK_IMG_URL(text)}`,
      order
    }
    const response = await addLink(body)
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast.error(message)
      return
    }
    const { data } = response
    const newList = [...globalLinks, data]
    setColumnLoaderTarget(columnRef.current)
    setTimeout(() => {
      setLinkLoader(false)
      setGlobalLinks(newList) // hay que actualizar globalLinks
      setColumnLoaderTarget(null)
    }, 1000)
    setPastedLinkId([data._id])
  }
  const handlePastedHtmlLinks = (clipboardItem, type, params) => {
    clipboardItem.getType(type).then(blob => {
      blob.text().then(text => {
        if (text.indexOf('<a href') === 0) {
          // console.log('Es un enlace html')
          // console.log(text)
          // console.log(typeof (text))
          processHtmlLink(text, params)
        } else {
          // console.log('No hay enlace')
        }
      })
    })
  }
  async function processHtmlLink (text, params) {
    const order = columnRef.current.childNodes.length ? columnRef.current.childNodes.length - 1 : 0
    const range = document.createRange()
    range.selectNode(document.body)
    const fragment = range.createContextualFragment(text)
    const a = fragment.querySelector('a')
    const url = a.href
    const nombre = a.innerText
    // const escritorio = params.escritorio

    const body = {
      categoryId: params._id,
      name: nombre,
      url,
      imgUrl: `${constants.BASE_LINK_IMG_URL(url)}`,
      order
    }
    const response = await addLink(body)
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast.error(message)
      return
    }
    const { data } = response
    const newList = [...globalLinks, data]
    setColumnLoaderTarget(columnRef.current)
    setTimeout(() => {
      setLinkLoader(false)
      setGlobalLinks(newList)
      setColumnLoaderTarget(null)
    }, 1000)
    setPastedLinkId([data._id])
  }
  async function pasteMultipleLinks (array, params) {
    const pasteLoading = toast.loading('Procesando links ...')
    let order = columnRef.current.childNodes.length ? columnRef.current.childNodes.length - 2 : 0 // que pasa si está vacia? 1 - 2 = -1 orden++ = 0
    const bodies = array.map(link => {
      order++
      return {
        categoryId: params._id,
        url: link,
        imgUrl: `${constants.BASE_LINK_IMG_URL(link)}`,
        order
      }
    })
    for (const bodie of bodies) {
      bodie.name = await getNameByUrl({ url: bodie.url })
      // console.log(bodie)
    }
    setNumberOfPastedLinks(bodies.length)
    const requests = bodies.map(async body => {
      const response = await addLink(body)
      const { hasError, message } = handleResponseErrors(response)
      if (hasError) {
        toast.error(message)
        return
      }
      toast.update(pasteLoading, { render: 'Procesado!', type: 'success', isLoading: false, autoClose: 3000 })
      return response.data
    })

    const links = await Promise.all(requests)
    console.log('🚀 ~ pasteMultipleLinks ~ links:', links)
    const newList = [...globalLinks, ...links]
    setColumnLoaderTarget(columnRef.current)
    setTimeout(() => {
      setLinkLoader(false)
      setGlobalLinks(newList)
      setColumnLoaderTarget(null)
      setNumberOfPastedLinks(1)
    }, 1000)
    setPastedLinkId([...links.map(link => link._id)])
    // activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.toSorted((a, b) => (a.orden - b.orden))))
  }
  async function getNameByUrl ({ url }) {
    // console.log(url)
    const res = await fetch(`${constants.BASE_API_URL}/links/getname?url=${url}`, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
    if (!res.ok) {
      return { status: res.status, statusText: res.statusText }
    }
    const response = await res.json()
    const { data } = response
    // console.log(title)
    return data
  }
  return { pasteLink }
}
