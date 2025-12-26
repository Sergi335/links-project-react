import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// URL base sin dependencia circular
const BASE_API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3001' : 'https://zenmarks-api.onrender.com'

export const useSessionStore = create(
  persist(
    (set, get) => {
      return {
        user: null,
        setUser: (user) => {
          set({ user })
        },
        csfrtoken: null,
        setCsfrtoken: (csfrtoken) => {
          set({ csfrtoken })
          // También guardar en localStorage como backup
          if (csfrtoken) {
            localStorage.setItem('csrfToken', JSON.stringify(csfrtoken))
          } else {
            localStorage.removeItem('csrfToken')
          }
        },
        isTokenReady: false,
        fetchCsrfToken: async () => {
          set({ isTokenReady: false })
          try {
            const response = await fetch(BASE_API_URL, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              }
            })
            const data = await response.json()
            if (data.csrfToken) {
              console.log(data.csrfToken)

              set({ csfrtoken: data.csrfToken, isTokenReady: true })
              localStorage.setItem('csrfToken', JSON.stringify(data.csrfToken))
              return data.csrfToken
            }
          } catch (error) {
            localStorage.removeItem('csrfToken')
            set({ csfrtoken: '', isTokenReady: true })
            console.error('Error fetching CSRF token:', error)
          }
          return null
        },
        getToken: () => {
          const storeToken = get().csfrtoken
          if (storeToken) return storeToken
          const localToken = localStorage.getItem('csrfToken')
          if (localToken) {
            try {
              return JSON.parse(localToken)
            } catch {
              return null
            }
          }
          return null
        }
      }
    },
    {
      name: 'sessionStore',
      storage: createJSONStorage(() => localStorage)
    })
)
export const useNavStore = create(
  persist(
    (set) => {
      return {
        links: [],
        setLinks: (links) => {
          set({ links })
        }
      }
    },
    {
      name: 'navStore',
      storage: createJSONStorage(() => localStorage)
    })
)
export const useLinkRefStore = create(
  persist(
    (set) => {
      return {
        link: null,
        setLink: (link) => {
          set({ link })
        }
      }
    },
    {
      name: 'linkRefStore',
      storage: createJSONStorage(() => localStorage)
    })
)
