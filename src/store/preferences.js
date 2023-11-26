import { create } from 'zustand'
import { constants } from '../services/constants'

export const usePreferencesStore = create(
  (set) => {
    return {
      activeLocalStorage: false,
      setActiveLocalStorage: (activeLocalStorage) => {
        set({ activeLocalStorage })
      },
      numberOfColumns: localStorage.getItem('numberOfColumns') ? JSON.parse(localStorage.getItem('numberOfColumns')) : 4,
      setNumberOfColumns: (numberOfColumns) => {
        set({ numberOfColumns })
      },
      styleOfColumns: localStorage.getItem('styleOfColumns') ? JSON.parse(localStorage.getItem('styleOfColumns')) : constants.COLUMNS_COUNT[4],
      setStyleOfColumns: (styleOfColumns) => {
        set({ styleOfColumns })
      }
    }
  }
)
