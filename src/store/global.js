import { create } from 'zustand'

export const useGlobalStore = create(
  (set) => {
    return {
      globalLoading: false,
      setGlobalLoading: (globalLoading) => {
        set({ globalLoading })
      },
      globalError: null,
      setGlobalError: (globalError) => {
        set({ globalError })
      },
      globalColumns: [],
      setGlobalColumns: (globalColumns) => {
        set({ globalColumns })
      },
      globalLinks: [],
      setGlobalLinks: (globalLinks) => {
        set({ globalLinks })
      }
    }
  }
)
