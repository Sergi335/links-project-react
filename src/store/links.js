import { create } from 'zustand'
// import { useParams } from 'react-router-dom'

export const useLinksStore = create(
  (set, get) => {
    return {
      linksStore: [],
      setLinksStore: (linksStore) => {
        set({ linksStore })
      },
      linkLoader: false,
      setLinkLoader: (linkLoader) => {
        set({ linkLoader })
      },
      columnLoaderTarget: null,
      setColumnLoaderTarget: (columnLoaderTarget) => {
        set({ columnLoaderTarget })
      },
      pastedLinkId: [],
      setPastedLinkId: (pastedLinkId) => {
        set({ pastedLinkId })
      },
      numberOfPastedLinks: 1,
      setNumberOfPastedLinks: (numberOfPastedLinks) => {
        set({ numberOfPastedLinks })
      }
    }
  }
)
// Suscribirte a cambios en la tienda y guardar en localStorage
useLinksStore.subscribe(state => {
  // const { linksStore } = state
  // //console.log('Store Actualizada')
  // const path = window.location.pathname
  // const valor = path.substring(path.lastIndexOf('/') + 1)
  // //console.log(valor)
  // localStorage.setItem('testlinks', JSON.stringify(linksStore.toSorted((a, b) => (a.orden - b.orden))))
})
