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
      globalColumns: [],
      setGlobalColumns: (globalColumns) => {
        set({ globalColumns })
      },
      globalLinks: [],
      setGlobalLinks: (globalLinks) => {
        set({ globalLinks })
      }//,
      // mappedGlobalLinks: new Map(),
      // setMappedGlobalLinks: (mappedGlobalLinks) => {
      //   const paneles = get().globalColumns
      //   const links = get().globalLinks
      //   paneles.forEach(panel => {
      //     const matchingLinks = links.filter(link => link.idpanel === panel._id)
      //     mappedGlobalLinks.set(panel._id, matchingLinks)
      //   })

      //   set({ mappedGlobalLinks })
      // }
    }
  }
)
