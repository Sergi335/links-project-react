import { create } from 'zustand'

export const usePreferencesStore = create(
  (set) => {
    return {
      activeLocalStorage: false,
      setActiveLocalStorage: (activeLocalStorage) => {
        set({ activeLocalStorage })
      }
    }
  }
)
