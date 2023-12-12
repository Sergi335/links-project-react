import { useEffect, useState } from 'react'
// import { getDesktops } from '../services/dbQueries'
import { useDesktopsStore } from '../store/desktops'
// import { usePreferencesStore } from '../store/preferences'
// import { handleResponseErrors } from '../services/functions'
// import { toast } from 'react-toastify'

export const useDesktops = ({ desktopName }) => {
  const [desktop, setDesktop] = useState()
  const [desktopDisplayName, setDesktopDisplayName] = useState()
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)
  //   const setDesktopsStore = useDesktopsStore(state => state.setDesktopsStore)

  //   const storage = JSON.parse(localStorage.getItem('Desktops'))
  //   const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)

  //   useEffect(() => {
  //     if (localStorage.getItem('Desktops') && storage?.length > 0) {
  //       setDesktopsStore(storage)
  //     } else {
  //       const fetchData = async () => {
  //         try {
  //           const response = await getDesktops()
  //           const { hasError, message } = handleResponseErrors(response)
  //           if (hasError) {
  //             toast(message)
  //             return
  //           }
  //           const { data } = response
  //           const state = data.filter(desk => desk.hidden !== true)
  //           // Hay que setear los hidden desktops tambien para que aparezcan
  //           setDesktopsStore(state)
  //           activeLocalStorage ?? localStorage.setItem('Desktops', JSON.stringify(data.toSorted((a, b) => (a.order - b.order))))
  //         } catch (error) {
  //           console.error(error)
  //         }
  //       }

  //       fetchData()
  //     }
  //   }, [desktopName])

  useEffect(() => {
    setDesktop(desktopsStore.find(desk => desk.name === desktopName))
    setDesktopDisplayName(desktop?.displayName)
  }, [desktopsStore])

  return { desktopDisplayName, desktop }
}
