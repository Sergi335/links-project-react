import { create } from 'zustand'
import { constants } from '../services/constants'

let abortController = null
let activeScanId = 0
let closeChartTimeout = null
const MAX_CONCURRENT_REQUESTS = 8

const initialState = {
  status: 'idle',
  progress: 0,
  currentLinkName: '',
  processedCount: 0,
  totalCount: 0,
  brokenLinks: [],
  lastCompletedAt: null
}

const clearCloseChartTimeout = () => {
  if (closeChartTimeout) {
    clearTimeout(closeChartTimeout)
    closeChartTimeout = null
  }
}

export const useBrokenLinksCheckStore = create(
  (set) => ({
    ...initialState,
    clearBrokenLinks: () => {
      clearCloseChartTimeout()
      set({
        ...initialState,
        status: 'idle'
      })
    },
    resetScan: () => {
      clearCloseChartTimeout()
      if (abortController) {
        abortController.abort()
        abortController = null
      }
      activeScanId += 1
      set({ ...initialState })
    },
    cancelScan: () => {
      clearCloseChartTimeout()
      if (abortController) {
        abortController.abort()
        abortController = null
      }
      activeScanId += 1
      set({ ...initialState, status: 'canceled' })
    },
    startScan: async (links = []) => {
      clearCloseChartTimeout()
      if (!Array.isArray(links) || links.length === 0) {
        set({
          status: 'idle',
          progress: 0,
          currentLinkName: '',
          processedCount: 0,
          totalCount: 0,
          brokenLinks: []
        })
        return { completed: false, brokenLinks: [] }
      }

      if (abortController) {
        abortController.abort()
      }

      abortController = new AbortController()
      activeScanId += 1
      const scanId = activeScanId
      const newLinks = [...links]
      const downLinks = []
      let nextIndex = 0
      let processedCount = 0

      set({
        status: 'checking',
        progress: 0,
        currentLinkName: '',
        processedCount: 0,
        totalCount: newLinks.length,
        brokenLinks: [],
        lastCompletedAt: null
      })

      const runWorker = async () => {
        while (nextIndex < newLinks.length) {
          const currentIndex = nextIndex
          nextIndex += 1

          const link = newLinks[currentIndex]

          if (abortController.signal.aborted || scanId !== activeScanId) {
            return
          }

          const linkUrl = link.URL || link.url || ''
          const linkName = link.name || linkUrl

          set({
            currentLinkName: linkName
          })

          try {
            const response = await fetch(`${constants.BASE_API_URL}/links/status?url=${encodeURIComponent(linkUrl)}`, {
              method: 'GET',
              signal: abortController.signal,
              ...constants.FETCH_OPTIONS
            })
            const { data } = await response.json()
            if (data.status !== 'success' && data.status !== 'clientErr') {
              downLinks.push({ data, link })
            }
          } catch (error) {
            if (error.name === 'AbortError') {
              return
            }
            console.error('Error checking link:', error)
          }

          if (abortController.signal.aborted || scanId !== activeScanId) {
            return
          }

          processedCount += 1
          set({
            progress: Math.round((processedCount / newLinks.length) * 100),
            processedCount
          })
        }
      }

      const workerCount = Math.min(MAX_CONCURRENT_REQUESTS, newLinks.length)
      await Promise.all(Array.from({ length: workerCount }, () => runWorker()))

      if (abortController.signal.aborted || scanId !== activeScanId) {
        return { completed: false, brokenLinks: downLinks }
      }

      if (scanId === activeScanId) {
        abortController = null
        set({
          status: 'completed',
          progress: 100,
          currentLinkName: '',
          processedCount: newLinks.length,
          totalCount: newLinks.length,
          brokenLinks: downLinks,
          lastCompletedAt: new Date().toISOString()
        })

        closeChartTimeout = setTimeout(() => {
          if (scanId !== activeScanId) return

          set(state => ({
            ...state,
            status: 'idle',
            progress: 0,
            currentLinkName: '',
            processedCount: 0,
            totalCount: 0
          }))
          closeChartTimeout = null
        }, 1000)
      }

      return { completed: true, brokenLinks: downLinks }
    }
  })
)
