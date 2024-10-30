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
      addLinkFormVisible: false,
      setAddLinkFormVisible: (addLinkFormVisible) => {
        set({ addLinkFormVisible })
      },
      editFormVisible: false,
      setEditFormVisible: (editFormVisible) => {
        set({ editFormVisible })
      },
      deleteFormVisible: false,
      setDeleteFormVisible: (deleteFormVisible) => {
        set({ deleteFormVisible })
      },
      deleteColFormVisible: false,
      setDeleteColFormVisible: (deleteColFormVisible) => {
        set({ deleteColFormVisible })
      },
      moveFormVisible: false,
      setMoveFormVisible: (moveFormVisible) => {
        set({ moveFormVisible })
      },
      customizePanelVisible: false,
      setCustomizePanelVisible: (customizePanelVisible) => {
        set({ customizePanelVisible })
      },
      addDeskFormVisible: false,
      setAddDeskFormVisible: (addDeskFormVisible) => {
        set({ addDeskFormVisible })
      },
      deleteConfFormVisible: false,
      setDeleteConfFormVisible: (deleteConfFormVisible) => {
        set({ deleteConfFormVisible })
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
