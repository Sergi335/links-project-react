import { useEffect, useState } from 'react'
import { useStyles } from '../../hooks/useStyles'
import { MoonIcon, SunIcon } from '../Icons/icons'
import styles from './NavBar.module.css'

export default function ThemeSwitcher () {
  const [darkTheme, setDarkTheme] = useState(false)
  const { theme: initialTheme } = useStyles()
  useEffect(() => {
    setDarkTheme(initialTheme === 'dark')
  }, [])
  // console.log(darkTheme)

  const handleChangeTheme = () => {
    const root = document.documentElement
    // if (window.matchMedia('prefers-color-scheme: dark').matches) {
    //   document.root.classList.add('dark')
    // }
    if (root.classList.contains('dark')) {
      root.classList.remove('dark')
      root.classList.add('light')
      // constants.DEFAULT_BACKGROUNDS.light.applyBackground()
      window.localStorage.setItem('theme', JSON.stringify('light'))
    } else if (root.classList.contains('light')) {
      root.classList.remove('light')
      root.classList.add('dark')
      // constants.DEFAULT_BACKGROUNDS.dark.applyBackground()
      window.localStorage.setItem('theme', JSON.stringify('dark'))
    } else {
      root.classList.add('dark')
      // constants.DEFAULT_BACKGROUNDS.dark.applyBackground()
      window.localStorage.setItem('theme', JSON.stringify('dark'))
    }
    setDarkTheme(!darkTheme)
  }
  return (
        <div className={styles.themeSwitcher}>
            <button className={styles.themeSwitcherButton} onClick={handleChangeTheme}>
                <span className={darkTheme ? styles.themeSwitcherThumb : `${styles.themeSwitcherThumb} ${styles.light}`}>
                    {darkTheme ? <MoonIcon /> : <SunIcon />}
                </span>
            </button>
        </div>
  )
}
