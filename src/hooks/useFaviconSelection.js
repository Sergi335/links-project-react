import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { constants } from '../services/constants'
import { deleteLinkImage, fetchLinkIconFile, saveLinkIcon } from '../services/dbQueries'
import { getFileNameFromUrl, handleResponseErrors } from '../services/functions'
import { useGlobalStore } from '../store/global'

export default function useFaviconSelection ({ data, deleteButtonRef, saveButtonRef, ref, inputRef }) {
  // const currentImageRef = ref
  const [icons, setIcons] = useState()
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const linkToChangeFavicon = useGlobalStore(state => state.linkToChangeFavicon)

  // Checa si la imagen es una de las subidas por el usuario para deshabilitar el boton de borrar
  // Como lo vamos a hacer: se van a poner todas las por defecto en la carpeta public, ya no tiramos de las de SergioSR
  useEffect(() => {
    const baseurl = new URL(import.meta.env.VITE_CUSTOM_BASE_URL)
    const autoUrlHost = import.meta.env.VITE_AUTO_FAVICON_HOST

    if (linkToChangeFavicon?.imgUrl !== '' && linkToChangeFavicon?.imgUrl !== undefined) {
      const imgUrl = linkToChangeFavicon.imgUrl

      // Verificar si es una URL absoluta (comienza con http:// o https://)
      const isAbsoluteUrl = imgUrl.startsWith('http://') || imgUrl.startsWith('https://')

      if (isAbsoluteUrl) {
        const url = new URL(imgUrl)
        if (url.host === baseurl.host || url.host === autoUrlHost) {
          deleteButtonRef.current.disabled = true
        } else {
          deleteButtonRef.current.disabled = false
        }
      } else {
      // Es una ruta relativa (ej: /img/icon.svg), imagen por defecto
        deleteButtonRef.current.disabled = true
      }

      // saveButtonRef.current.disabled = true
    }
  }, [globalLinks, linkToChangeFavicon])

  // Setea los iconos
  useEffect(() => {
    fetch(`${constants.BASE_API_URL}/storage/icons`, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
      .then(res => res.json())
      .then(data => {
        setIcons(data.data)
      })
  }, [])

  const handleSelectIconOnClick = async (event) => {
    // El icono de la lista en el que se ha hecho click
    const $linkIcon = document.getElementById(event.currentTarget.id)
    console.log('🚀 ~ handleSelectIconOnClick ~ $linkIcon:', $linkIcon)
    // Encuentra el link actual entre todos los links
    const elementIndex = globalLinks.findIndex(link => link._id === linkToChangeFavicon?._id)
    const newState = [...globalLinks]
    newState[elementIndex].imgUrl = $linkIcon.src
    // setPlaceHolderImageUrl(element.src)

    // adjudicar el id con el nombre del icono para poder borrarlo, importante
    // currentImageRef.current.id = $linkIcon.id

    // Está desabilitado porque el cambio se hace automaticamente al seleccionar un icono, pero cuidado no se quede asi
    saveButtonRef.current.disabled = true
    setGlobalLinks(newState)
    const response = await saveLinkIcon({ src: $linkIcon.id, linkId: linkToChangeFavicon?._id })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast.error(message)
    } else {
      // $notification.textContent = 'Saved!'
      // $notification.classList.add(`${styles.show}`)
      // setTimeout(() => {
      //   $notification.classList.remove(`${styles.show}`)
      // }, 1500)
    }
  }
  const handleCreateImageUrlFromFile = async () => {
    const file = inputRef.current.files[0]
    if (!file) return
    console.log('seguimos')

    // Lista de tipos MIME permitidos
    const allowedTypes = ['image/png', 'image/jpeg']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato no permitido. Solo se permiten PNG y JPG/JPEG.')
      inputRef.current.value = '' // Limpia el input para evitar problemas
      return
    }

    if (file.size > 500000) {
      toast.error('Imagen muy grande, máximo 500KB')
      return
    }
    const imageUrl = URL.createObjectURL(file)
    // currentImageRef.current.src = imageUrl
    const elementIndex = globalLinks.findIndex(link => link._id === linkToChangeFavicon?._id)
    const newState = [...globalLinks]
    newState[elementIndex].imgUrl = imageUrl
    setGlobalLinks(newState)

    saveButtonRef.current.disabled = false
  }
  const handleUploadImage = async () => {
    const file = inputRef.current.files[0]
    const elementIndex = globalLinks.findIndex(link => link._id === linkToChangeFavicon?._id)
    const newState = [...globalLinks]
    const response = await fetchLinkIconFile({ file, linkId: linkToChangeFavicon?._id })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast.error(message)
    } else {
      setIcons([...icons, { url: response.data.url, nombre: response.data.name }])
      newState[elementIndex].imgUrl = response.data.url
      setGlobalLinks(newState)
      // adjudicar el id con el nombre del icono para poder borrarlo, importante
      // currentImageRef.current.id = response.data.name
      toast('Imagen guardada!', { autoClose: 1500 })
    }
  }
  const handleSetAutoIcon = async () => {
    // const $notification = document.getElementById('notification')
    const elementIndex = globalLinks.findIndex(link => link._id === linkToChangeFavicon?._id)
    const newState = [...globalLinks]
    newState[elementIndex].imgUrl = constants.BASE_LINK_IMG_URL(linkToChangeFavicon?.url)
    setGlobalLinks(newState)
    // currentImageRef.current.src = constants.BASE_LINK_IMG_URL(linkToChangeFavicon?.url)
    const response = await saveLinkIcon({ src: constants.BASE_LINK_IMG_URL(linkToChangeFavicon?.url), linkId: linkToChangeFavicon?._id })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast.error(message)
    } else {
      // $notification.textContent = 'Saved!'
      // $notification.classList.add(`${styles.show}`)
      // setTimeout(() => {
      //   $notification.classList.remove(`${styles.show}`)
      // }, 1500)
    }
  }
  const handleDeleteLinkIcon = async () => {
    const url = linkToChangeFavicon?.imgUrl
    const fileName = getFileNameFromUrl(url)
    console.log(fileName)
    const response = await deleteLinkImage(fileName)
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast.error(message)
    } else {
      toast('Imagen borrada!', { autoClose: 1500 })
      const elementIndex = globalLinks.findIndex(link => link._id === linkToChangeFavicon?._id)
      const newLinksState = [...globalLinks]
      newLinksState[elementIndex].imgUrl = constants.BASE_LINK_IMG_URL(linkToChangeFavicon?.url)
      saveLinkIcon({ src: constants.BASE_LINK_IMG_URL(linkToChangeFavicon?.url), linkId: linkToChangeFavicon?._id }) // Await y control???
      setGlobalLinks(newLinksState)
      // const iconIndex = icons.findIndex(icon => icon.url === currentImageRef.current.src)
      const newIconsState = icons.filter(icon => icon.nombre !== fileName)
      console.log('🚀 ~ handleDeleteLinkIcon ~ newIconsState:', newIconsState)
      setIcons(newIconsState)
      // currentImageRef.current.src = constants.BASE_LINK_IMG_URL(linkToChangeFavicon?.url)
      // Deshabilitar boton de borrar imagen
      deleteButtonRef.current.disabled = true
    }
  }
  return {
    handleDeleteLinkIcon,
    handleCreateImageUrlFromFile,
    handleUploadImage,
    handleSetAutoIcon,
    handleSelectIconOnClick,
    icons
  }
}
