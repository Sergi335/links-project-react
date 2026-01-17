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
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const getAddedLinkOrder = () => {
    if (String(params?._id).startsWith('virtual-')) {
      const destinyId = String(params._id).split('virtual-')[1]
      return globalLinks?.filter(link => link.categoryId === destinyId).length ?? 0
    } else {
      return globalLinks?.filter(link => link.categoryId === params?._id).length ?? 0
    }
  }
  console.log(getAddedLinkOrder())
  const getDestinyId = () => {
    if (String(params?._id).startsWith('virtual-')) {
      return String(params._id).split('virtual-')[1]
    } else {
      return params?._id
    }
  }
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
              handlePastedTextLinks(clipboardItem, type, params)
              // console.log('Texto plano')
            }
          }
        } else {
          for (const type of clipboardItem.types) {
            console.log(type)
            if (type === 'text/html') {
              handlePastedHtmlLinks(clipboardItem, type, params)
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
    // Activar loader ANTES de la petición
    setColumnLoaderTarget({ id: params?._id })
    setNumberOfPastedLinks(1)
    setLinkLoader(true)

    const nombre = await getNameByUrl({ url: text })

    const body = {
      categoryId: getDestinyId(),
      name: nombre ?? '',
      url: text,
      imgUrl: `${constants.BASE_LINK_IMG_URL(text)}`,
      order: getAddedLinkOrder()
    }
    const response = await addLink(body)
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      setLinkLoader(false)
      setColumnLoaderTarget(null)
      toast.error(message)
      return
    }
    const { data } = response
    const newList = [...globalLinks, data]
    setTimeout(() => {
      setLinkLoader(false)
      setGlobalLinks(newList)
      setColumnLoaderTarget(null)
    }, 1000)
    setPastedLinkId([data._id])
  }
  const handlePastedHtmlLinks = (clipboardItem, type, params) => {
    clipboardItem.getType(type).then(blob => {
      blob.text().then(text => {
        if (text.includes('<a href')) {
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
    // Activar loader ANTES de la petición
    setColumnLoaderTarget({ id: params?._id })
    setNumberOfPastedLinks(1)
    setLinkLoader(true)

    const range = document.createRange()
    range.selectNode(document.body)
    const fragment = range.createContextualFragment(text)
    const a = fragment.querySelector('a')
    const url = a.href
    const nombre = a.innerText

    const body = {
      categoryId: getDestinyId(),
      name: nombre,
      url,
      imgUrl: `${constants.BASE_LINK_IMG_URL(url)}`,
      order: getAddedLinkOrder()
    }
    const response = await addLink(body)
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      setLinkLoader(false)
      setColumnLoaderTarget(null)
      toast.error(message)
      return
    }
    const { data } = response
    const newList = [...globalLinks, data]
    setTimeout(() => {
      setLinkLoader(false)
      setGlobalLinks(newList)
      setColumnLoaderTarget(null)
    }, 1000)
    setPastedLinkId([data._id])
  }
  async function pasteMultipleLinks (array, params) {
    const pasteLoading = toast.loading('Procesando links ...')

    // Activar loader ANTES de las peticiones
    setColumnLoaderTarget({ id: params?._id })
    setNumberOfPastedLinks(array.length)
    setLinkLoader(true)

    let order = getAddedLinkOrder() - 1
    const bodies = array.map(link => {
      order++
      return {
        categoryId: getDestinyId(),
        url: link,
        imgUrl: `${constants.BASE_LINK_IMG_URL(link)}`,
        order
      }
    })
    for (const bodie of bodies) {
      bodie.name = await getNameByUrl({ url: bodie.url })
    }
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
    const newList = [...globalLinks, ...links]
    setTimeout(() => {
      setLinkLoader(false)
      setGlobalLinks(newList)
      setColumnLoaderTarget(null)
      setNumberOfPastedLinks(1)
    }, 1000)
    setPastedLinkId([...links.map(link => link._id)])
  }
  async function getNameByUrl ({ url }) {
    try {
      const res = await fetch(`${constants.BASE_API_URL}/links/getname?url=${url}`, {
        method: 'GET',
        ...constants.FETCH_OPTIONS
      })
      if (!res.ok) {
        return null
      }
      const response = await res.json()
      const { data } = response
      return data
    } catch (error) {
      console.error('Error getting name by URL:', error)
      return null
    }
  }
  return { pasteLink }
}
