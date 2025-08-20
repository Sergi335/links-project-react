import { create } from 'zustand'

export const useGlobalStore = create(
  (set, get) => {
    return {
      globalLoading: false,
      setGlobalLoading: (globalLoading) => {
        set({ globalLoading })
      },
      registerLoading: false,
      setRegisterLoading: (registerLoading) => {
        set({ registerLoading })
      },
      loginLoading: false,
      setLoginLoading: (loginLoading) => {
        set({ loginLoading })
      },
      globalError: null,
      setGlobalError: (globalError) => {
        set({ globalError })
      },
      globalDesktops: [],
      setGlobalDesktops: (globalDesktops) => {
        set({ globalDesktops })
      },
      globalColumns: [],
      setGlobalColumns: (globalColumns) => {
        set({ globalColumns })
      },
      globalLinks: [],
      setGlobalLinks: (globalLinks) => {
        set({ globalLinks })
      },
      globalArticles: null,
      setGlobalArticles: (globalArticles) => {
        set({ globalArticles })
      }
    }
  }
)
