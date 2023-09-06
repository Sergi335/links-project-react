import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useSessionStore = create(
  persist(
    (set) => {
      return {
        user: null,
        setUser: (user) => {
          set({ user })
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
