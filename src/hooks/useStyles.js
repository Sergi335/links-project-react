import { useEffect, useState } from 'react'
import { constants } from '../services/constants'

export const useStyles = () => {
  const [themeforToastify, setThemeforToastify] = useState()
  // Usar estado para reactividad con el theme changer
  const theme = localStorage.getItem('theme') === null ? 'light' : JSON.parse(localStorage.getItem('theme'))
  useEffect(() => {
    setThemeforToastify(localStorage.getItem('theme') === null ? 'light' : JSON.parse(localStorage.getItem('theme'))) // no funciona?
    document.documentElement.classList.add(theme)

    const accentColors = Object.keys(constants.ACCENT_COLORS)
    const accentColor = JSON.parse(localStorage.getItem('accentColorName')) ?? accentColors[0]
    constants.ACCENT_COLORS[accentColor].applyStyles()

    if (localStorage.getItem('themeVariant') === null) {
      localStorage.setItem('themeVariant', JSON.stringify('solid'))
      constants.THEME_VARIANTS.solid.applyStyles()
    } else {
      const themeVariant = JSON.parse(localStorage.getItem('themeVariant'))
      constants.THEME_VARIANTS[themeVariant].applyStyles()
    }
    const element = document.querySelector('.root')
    if (localStorage.getItem('bodyBackground') !== 'null') {
      if (element) {
        element.setAttribute('data-background', 'image')
        element.style.background = `url(${JSON.parse(localStorage.getItem('bodyBackground'))})`
        element.style.backgroundSize = 'cover'
        element.style.backgroundAttachment = 'fixed'
      }
    } else {
      if (element) {
        element.setAttribute('data-background', 'color')
      }
    }
  }, [])

  return { themeforToastify, theme }
}
