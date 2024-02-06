import { useState, useEffect } from 'react'
import { constants } from '../services/constants'
import { useSessionStore } from '../store/session'
import { createBrowserHistory } from 'history'
export default function useStyles () {
  console.log('Magia')
  const [theme, setTheme] = useState('light')
  const history = createBrowserHistory()
  console.log('🚀 ~ useStyles ~ history:', history)
  // Maneja el cambio de ubicación y obtén el pathname
  // const handleLocationChange = () => {
  //   const { pathname } = history.location
  //   console.log('Ruta actual:', pathname)
  // }

  history.listen(({ action, location }) => {
    console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
    )
    console.log(`The last navigation action was ${action}`)
  })
  // Agrega un listener para el cambio de ubicación cuando el componente se monta
  useEffect(() => {

    // Limpia el listener cuando el componente se desmonta
    // return () => unlisten()
  }, [history])
  useEffect(() => {
    if (localStorage.getItem('bodyBackground')) {
      document.body.style.backgroundImage = `url(${JSON.parse(localStorage.getItem('bodyBackground'))})`
      document.body.style.backgroundSize = 'cover'
    }
    if (localStorage.getItem('theme')) {
      JSON.parse(localStorage.getItem('theme')) === 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
      JSON.parse(localStorage.getItem('theme')) === 'dark' ? setTheme('dark') : setTheme('light')
    }
    if (localStorage.getItem('sideInfoStyles')) {
      const panel = document.getElementById('sideinfo')
      panel && constants.SIDE_INFO_STYLES[JSON.parse(localStorage.getItem('sideInfoStyles'))].applyStyles(panel)
    }
    if (localStorage.getItem('accentColorName')) {
      constants.ACCENT_COLORS[JSON.parse(localStorage.getItem('accentColorName'))].applyStyles()
    }
  }, [])
  // const csfrtoken = useSessionStore(state => state.csfrtoken)
  const setCsfrtoken = useSessionStore(state => state.setCsfrtoken)
  useEffect(() => {
    fetch(constants.BASE_API_URL, {
      method: 'GET',
      ...constants.FETCH_OPTIONS
    })
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        const { csrfToken } = data
        setCsfrtoken(csrfToken)
      })
  }, [])

  return { theme, setTheme }
}
