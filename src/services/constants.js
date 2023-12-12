export const constants = {
  BASE_API_URL: 'http://localhost:3001',
  BASE_LINK_IMG_URL: (url) => {
    return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=64`
  },
  FETCH_OPTIONS: {
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      'x-justlinks-user': 'SergioSR',
      'x-justlinks-token': 'otroheader'
    }
  },
  ACCENT_COLORS: {
    yellow: {
      color: '#ffff00',
      applyStyles: (element) => {
        document.documentElement.style.setProperty('--accentColor', constants.ACCENT_COLORS.yellow.color)
        document.documentElement.style.setProperty('--buttonTextColor', '#4e4e4e')
        window.localStorage.setItem('accentColor', JSON.stringify('#ffff00'))
        window.localStorage.setItem('buttonTextColor', JSON.stringify('#4e4e4e'))
        window.localStorage.setItem('accentColorName', JSON.stringify('yellow'))
      }
    },
    blue: {
      color: 'cornflowerblue',
      applyStyles: (element) => {
        document.documentElement.style.setProperty('--accentColor', constants.ACCENT_COLORS.blue.color)
        document.documentElement.style.setProperty('--buttonTextColor', '#ffffff')
        window.localStorage.setItem('accentColor', JSON.stringify('cornflowerblue'))
        window.localStorage.setItem('buttonTextColor', JSON.stringify('#ffffff'))
        window.localStorage.setItem('accentColorName', JSON.stringify('blue'))
      }
    },
    green: {
      color: '#00cc66',
      applyStyles: (element) => {
        document.documentElement.style.setProperty('--accentColor', constants.ACCENT_COLORS.green.color)
        document.documentElement.style.setProperty('--buttonTextColor', '#1a1a1a')
        window.localStorage.setItem('accentColor', JSON.stringify('#00cc66'))
        window.localStorage.setItem('buttonTextColor', JSON.stringify('#1a1a1a'))
        window.localStorage.setItem('accentColorName', JSON.stringify('green'))
      }
    },
    defaultLight: {
      color: '#bababa',
      applyStyles: (element) => {
        document.documentElement.style.setProperty('--accentColor', constants.ACCENT_COLORS.defaultLight.color)
        document.documentElement.style.setProperty('--buttonTextColor', '#1a1a1a')
        window.localStorage.setItem('accentColor', JSON.stringify('#bababa'))
        window.localStorage.setItem('buttonTextColor', JSON.stringify('#1a1a1a'))
        window.localStorage.setItem('accentColorName', JSON.stringify('defaultLight'))
      }
    },
    defaultDark: {
      color: '#bf7272',
      applyStyles: (element) => {
        document.documentElement.style.setProperty('--accentColor', constants.ACCENT_COLORS.defaultDark.color)
        document.documentElement.style.setProperty('--buttonTextColor', '#ffffff')
        window.localStorage.setItem('accentColor', JSON.stringify('#bf7272'))
        window.localStorage.setItem('buttonTextColor', JSON.stringify('#ffffff'))
        window.localStorage.setItem('accentColorName', JSON.stringify('defaultDark'))
      }
    }
  },
  SIDE_INFO_STYLES: {
    theme: {
      applyStyles: (element) => {
        element.style.background = 'var(--bgGradient)'
        element.style.backdropFilter = 'none'
        element.style.borderRadius = '5px'
      },
      background: 'var(--bgGradient)'
    },
    transparent: {
      applyStyles: (element) => {
        element.style.background = 'transparent'
        element.style.backdropFilter = 'none'
        element.style.borderRadius = '0'
      },
      background: 'transparent'
    },
    blur: {
      applyStyles: (element) => {
        element.style.background = 'transparent'
        element.style.backdropFilter = 'blur(15px)'
        element.style.borderRadius = '5px'
      },
      background: 'transparent'
    }
  },
  COLUMNS_COUNT: {
    1: 'repeat(auto-fill, minmax(100%, 1fr))',
    2: 'repeat(auto-fill, minmax(826px, 1fr))',
    3: 'repeat(auto-fill, minmax(537px, 1fr))',
    4: 'repeat(auto-fill, minmax(393px, 1fr))',
    5: 'repeat(auto-fill, minmax(306px, 1fr))'
  },
  MIDDLEWARE_ERROR_MESSAGE: {
    cookieFailed: 'MIDDLEWARE UNAUTHORIZE REQUEST!'
  }
}
