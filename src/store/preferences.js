import { create } from 'zustand'
import { constants } from '../services/constants'

export const usePreferencesStore = create(
  (set) => {
    return {
      activeLocalStorage: false,
      setActiveLocalStorage: (activeLocalStorage) => {
        set({ activeLocalStorage })
      },
      numberOfColumns: constants.COLUMNS_COUNT[4],
      setNumberOfColumns: (numberOfColumns) => {
        set({ numberOfColumns })
      }
    }
  }
)
