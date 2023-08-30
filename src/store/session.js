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
