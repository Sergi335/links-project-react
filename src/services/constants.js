import styles from '../components/SideBar/SideBar.module.css'
export const constants = {
  BASE_API_URL: 'http://localhost:3001',
  // BASE_API_URL: 'https://zenmarks-api.onrender.com',
  // BASE_API_URL: import.meta.env.MODE === 'development' ? 'http://localhost:3001' : 'https://zenmarks-api.onrender.com',
  BASE_LINK_IMG_URL: (url) => {
    return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=64`
  },
  FETCH_OPTIONS: {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-justlinks-user': 'SergioSR',
      'x-justlinks-token': 'otroheader'
    }
  },
  ACCENT_COLORS: {
    defaultLight: {
      color: 'hsl(0, 0%, 73%)',
      applyStyles: (element) => {
        document.documentElement.style.setProperty('--accentColor', constants.ACCENT_COLORS.defaultLight.color)
        document.documentElement.style.setProperty('--buttonTextColor', '#1a1a1a')
        window.localStorage.setItem('accentColor', `JSON.stringify(${constants.ACCENT_COLORS.defaultLight.color})`)
        window.localStorage.setItem('buttonTextColor', JSON.stringify('#1a1a1a'))
        window.localStorage.setItem('accentColorName', JSON.stringify('defaultLight'))
      }
    },
    yellow: {
      color: 'hsl(60, 100%, 50%)',
      applyStyles: (element) => {
        document.documentElement.style.setProperty('--accentColor', constants.ACCENT_COLORS.yellow.color)
        document.documentElement.style.setProperty('--buttonTextColor', '#4e4e4e')
        window.localStorage.setItem('accentColor', `JSON.stringify(${constants.ACCENT_COLORS.yellow.color})`)
        window.localStorage.setItem('buttonTextColor', JSON.stringify('#4e4e4e'))
        window.localStorage.setItem('accentColorName', JSON.stringify('yellow'))
      }
    },
    blue: {
      color: 'hsl(218.54deg 79.19% 66.08%)',
      applyStyles: (element) => {
        document.documentElement.style.setProperty('--accentColor', constants.ACCENT_COLORS.blue.color)
        document.documentElement.style.setProperty('--buttonTextColor', '#ffffff')
        window.localStorage.setItem('accentColor', `JSON.stringify(${constants.ACCENT_COLORS.blue.color})`)
        window.localStorage.setItem('buttonTextColor', JSON.stringify('#ffffff'))
        window.localStorage.setItem('accentColorName', JSON.stringify('blue'))
      }
    },
    green: {
      color: 'hsl(150deg 6.38% 44.55%)',
      applyStyles: (element) => {
        document.documentElement.style.setProperty('--accentColor', constants.ACCENT_COLORS.green.color)
        document.documentElement.style.setProperty('--buttonTextColor', '#1a1a1a')
        window.localStorage.setItem('accentColor', `JSON.stringify(${constants.ACCENT_COLORS.green.color})`)
        window.localStorage.setItem('buttonTextColor', JSON.stringify('#1a1a1a'))
        window.localStorage.setItem('accentColorName', JSON.stringify('green'))
      }
    },
    defaultDark: {
      color: 'hsl(0, 38%, 60%)',
      applyStyles: (element) => {
        document.documentElement.style.setProperty('--accentColor', constants.ACCENT_COLORS.defaultDark.color)
        document.documentElement.style.setProperty('--buttonTextColor', '#ffffff')
        window.localStorage.setItem('accentColor', `JSON.stringify(${constants.ACCENT_COLORS.defaultDark.color})`)
        window.localStorage.setItem('buttonTextColor', JSON.stringify('#ffffff'))
        window.localStorage.setItem('accentColorName', JSON.stringify('defaultDark'))
      }
    }
  },
  SIDE_INFO_STYLES: {
    theme: {
      applyStyles: (element) => {
        element.style.background = 'var(--mainColor)'
        element.style.border = 'var(--firstBorder)'
        element.style.backdropFilter = 'none'
        // element.style.backdropFilter = 'blur(20px)'
        // element.style.borderRadius = 'var(--border-radius)'
        // element.style.borderLeft = '1px solid transparent'
        const sects = element.querySelectorAll(`.${styles.sectActive}`)
        sects.forEach((sect) => {
          // sect.style.backgroundColor = 'transparent'
          sect.style.border = 'var(--firstBorder)'
          // sect.style.borderLeft = '2px solid var(--accentColor)'
        })
      },
      background: 'var(--frostColor)'
    },
    transparent: {
      applyStyles: (element) => {
        element.style.background = 'transparent'
        element.style.backdropFilter = 'none'
        // element.style.borderRadius = '0'
        element.style.border = 'none'
        const sects = element.querySelectorAll(`.${styles.sectActive}`)
        sects.forEach((sect) => {
          sect.style.backgroundColor = 'var(--mainColor)'
          sect.style.border = 'var(--firstBorder)'
        })
        // element.style.borderLeft = '1px dashed var(--firstBorderColor)'
      },
      background: 'url(/img/transparent-miniature.png)'
    },
    blur: {
      applyStyles: (element) => {
        element.style.background = 'transparent'
        element.style.backdropFilter = 'blur(15px)'
        // element.style.borderRadius = 'var(--border-radius)'
        element.style.borderLeft = '1px solid transparent'
        element.style.border = 'none'
        const sects = element.querySelectorAll(`.${styles.sectActive}`)
        sects.forEach((sect) => {
          // sect.style.backgroundColor = 'transparent'
          sect.style.border = 'none'
        })
      },
      background: 'url(/img/blur-background.png)'
    }
  },
  THEME_VARIANTS: {
    solid: {
      applyStyles: () => {
        const element = document.documentElement
        if (element.classList.contains('transparent')) {
          element.classList.remove('transparent')
          element.classList.add('solid')
        } else {
          element.classList.add('solid')
        }
      },
      background: 'var(--mainColor)'
    },
    transparent: {
      applyStyles: () => {
        const element = document.documentElement
        if (element.classList.contains('solid')) {
          element.classList.remove('solid')
          element.classList.add('transparent')
        } else {
          element.classList.add('transparent')
        }
      },
      background: 'url(/img/blur-background.png)'
    }
  },
  COLUMNS_COUNT: {
    1: '76ch',
    2: 'repeat(auto-fill, minmax(760px, 1fr))',
    3: 'repeat(auto-fill, minmax(500px, 1fr))',
    4: 'repeat(auto-fill, minmax(320px, 1fr))',
    5: 'repeat(auto-fill, minmax(269px, 1fr))'
  },
  DEFAULT_BACKGROUNDS: {
    light: {
      applyBackground: () => {
        document.body.style.backgroundImage = 'url("https://firebasestorage.googleapis.com/v0/b/justlinks-7330b.appspot.com/o/backgrounds%2Fbackground9.webp?alt=media&token=0df22fb0-0eb5-40b2-8692-1fe05818bf9f")'
      }
    },
    dark: {
      applyBackground: () => {
        document.body.style.backgroundImage = 'url("https://firebasestorage.googleapis.com/v0/b/justlinks-7330b.appspot.com/o/backgrounds%2Fbackground8.webp?alt=media&token=7638f025-0a9c-497c-bea2-230d83b9e4fd")'
      }
    }
  },
  MIDDLEWARE_ERROR_MESSAGE: {
    cookieFailed: 'MIDDLEWARE UNAUTHORIZE REQUEST!'
  },
  DEFAULT_LINK_ICONS: [
    { option: 'opcion1', url: '/img/opcion1.svg' },
    { option: 'opcion2', url: '/img/opcion2.png' },
    { option: 'opcion3', url: '/img/opcion3.png' },
    { option: 'opcion4', url: '/img/opcion4.svg' },
    { option: 'opcion5', url: '/img/opcion5.svg' },
    { option: 'opcion6', url: '/img/opcion6.svg' },
    { option: 'opcion7', url: '/img/opcion7.png' }
  ]
}
