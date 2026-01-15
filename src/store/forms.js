import { create } from 'zustand'

export const useFormsStore = create(
  (set, get) => {
    return {
      linkContextMenuVisible: false,
      setContextMenuVisible: (linkContextMenuVisible) => {
        set({ linkContextMenuVisible })
      },
      columnContextMenuVisible: false,
      setColumnContextMenuVisible: (columnContextMenuVisible) => {
        set({ columnContextMenuVisible })
      },
      points: { x: 0, y: 0 },
      setPoints: (points) => {
        set({ points })
      },
      moveFormVisible: false,
      setMoveFormVisible: (moveFormVisible) => {
        set({ moveFormVisible })
      },
      customizePanelVisible: false,
      setCustomizePanelVisible: (customizePanelVisible) => {
        set({ customizePanelVisible })
      },
      searchBoxVisible: false,
      setSearchBoxVisible: (searchBoxVisible) => {
        set({ searchBoxVisible })
      },
      activeLink: null,
      setActiveLink: (activeLink) => {
        set({ activeLink })
      },
      activeColumn: null,
      setActiveColumn: (activeColumn) => {
        set({ activeColumn })
      },
      activeElement: null,
      setActiveElement: (activeElement) => {
        set({ activeElement })
      },
      activeColElement: null,
      setActiveColElement: (activeColElement) => {
        set({ activeColElement })
      },
      actualDesktop: undefined,
      setActualDesktop: (actualDesktop) => {
        set({ actualDesktop })
      }
    }
  }
)
