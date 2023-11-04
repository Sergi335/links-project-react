import { create } from 'zustand'

export const useFormsStore = create(
  (set) => {
    return {
      linkContextMenuVisible: false,
      setContextMenuVisible: (linkContextMenuVisible) => {
        set({ linkContextMenuVisible })
      },
      points: { x: 0, y: 0 },
      setPoints: (points) => {
        set({ points })
      },
      editFormVisible: false,
      setEditFormVisible: (editFormVisible) => {
        set({ editFormVisible })
      },
      deleteFormVisible: false,
      setDeleteFormVisible: (deleteFormVisible) => {
        set({ deleteFormVisible })
      },
      moveFormVisible: false,
      setMoveFormVisible: (moveFormVisible) => {
        set({ moveFormVisible })
      },
      activeLink: null,
      setActiveLink: (activeLink) => {
        set({ activeLink })
      },
      activeElement: null,
      setActiveElement: (activeElement) => {
        set({ activeElement })
      }
    }
  }
)
