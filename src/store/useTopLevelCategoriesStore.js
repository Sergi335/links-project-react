import { create } from 'zustand'

export const useTopLevelCategoriesStore = create(
  (set) => {
    return {
      topLevelCategoriesStore: [],
      setTopLevelCategoriesStore: (topLevelCategoriesStore) => {
        set({ topLevelCategoriesStore })
      }
    }
  }
)
