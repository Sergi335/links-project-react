import { useCallback, useEffect, useRef, useState } from 'react'

// Custom Hook para hacer elementos resizable
const useResizable = (initialWidth = 300, minWidth = 100, maxWidth = 800) => {
  const [width, setWidth] = useState(initialWidth)
  const [isResizing, setIsResizing] = useState(false)
  const elementRef = useRef(null)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsResizing(true)
    startXRef.current = e.clientX
    startWidthRef.current = width
  }, [width])

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return

    const diff = e.clientX - startXRef.current
    const newWidth = startWidthRef.current + diff

    // Aplicar límites mínimo y máximo
    const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
    setWidth(constrainedWidth)
  }, [isResizing, minWidth, maxWidth])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      // Prevenir selección de texto mientras se redimensiona
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'ew-resize'

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return {
    width,
    elementRef,
    handleMouseDown,
    isResizing,
    setWidth
  }
}

export { useResizable }
