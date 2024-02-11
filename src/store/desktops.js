import { create } from 'zustand'

export const useDesktopsStore = create(
  (set) => {
    return {
      desktopsStore: [],
      setDesktopsStore: (desktopsStore) => {
        set({ desktopsStore })
      }
    }
  }
)
