import { create } from 'zustand'

export const useColumnsStore = create(
  (set) => {
    return {
      columnsStore: [],
      setColumnsStore: (columnsStore) => {
        set({ columnsStore })
      }
    }
  }
)
