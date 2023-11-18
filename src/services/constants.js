export const constants = {
  BASE_API_URL: 'http://localhost:3003/api',
  BASE_LINK_IMG_URL: (url) => {
    return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=64`
  },
  ACCENT_COLORS: {
    yellow: '#ffff00',
    blue: 'cornflowerblue',
    green: '#00cc66',
    defaultLight: '#bababa',
    defaultDark: '#bf7272'
  },
  COLUMNS_COUNT: {
    1: 'repeat(auto-fill, minmax(100%, 1fr))',
    2: 'repeat(auto-fill, minmax(441px, 1fr))',
    3: 'repeat(auto-fill, minmax(325px, 1fr))',
    4: 'repeat(auto-fill, minmax(300px, 1fr))',
    5: 'repeat(auto-fill, minmax(200px, 1fr))'
  }
}
