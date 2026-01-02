import { useCallback, useEffect, useRef, useState } from 'react'

// Custom Hook para hacer elementos resizable
const useResizable = (initialWidth = 300, minWidth = 100, maxWidth = 800, storageKey = 'resizable-width') => {
  // Obtener el ancho guardado de localStorage o usar el inicial
  const getSavedWidth = () => {
    const saved = localStorage.getItem(storageKey)
    return saved ? parseInt(saved, 10) : initialWidth
  }

  const [width, setWidth] = useState(getSavedWidth)
  const [isPinned, setIsPinned] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const elementRef = useRef(null)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)
  const savedWidthRef = useRef(getSavedWidth())

  // Guardar en localStorage cuando cambia el width (solo si está pinned)
  useEffect(() => {
    if (isPinned && width !== minWidth) {
      localStorage.setItem(storageKey, width.toString())
      savedWidthRef.current = width
    }
  }, [width, isPinned, minWidth, storageKey])

  // Observer para detectar cambios en la clase "pinned"
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Función para verificar si tiene la clase pinned
    const checkPinnedClass = () => {
      const hasPinned = element.classList.contains('pinned')
      setIsPinned(hasPinned)

      if (hasPinned) {
        // Restaurar el ancho guardado
        const savedWidth = localStorage.getItem(storageKey)
        if (savedWidth) {
          setWidth(parseInt(savedWidth, 10))
        } else {
          setWidth(savedWidthRef.current)
        }
      } else {
        // Guardar el ancho actual antes de minimizar
        if (width !== minWidth) {
          localStorage.setItem(storageKey, width.toString())
          savedWidthRef.current = width
        }
        // Adoptar la anchura mínima
        setWidth(minWidth)
      }
    }

    // Verificar estado inicial
    checkPinnedClass()

    // Crear MutationObserver para escuchar cambios de clase
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkPinnedClass()
        }
      })
    })

    observer.observe(element, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [minWidth, storageKey])

  // Handlers para hover - expandir cuando no está pinned
  const handleMouseEnter = useCallback(() => {
    if (!isPinned) {
      setIsHovered(true)
      const savedWidth = localStorage.getItem(storageKey)
      if (savedWidth) {
        setWidth(parseInt(savedWidth, 10))
      } else {
        setWidth(savedWidthRef.current)
      }
    }
  }, [isPinned, storageKey])

  const handleMouseLeave = useCallback(() => {
    if (!isPinned) {
      setIsHovered(false)
      setWidth(minWidth)
    }
  }, [isPinned, minWidth])

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
    handleMouseEnter,
    handleMouseLeave,
    isResizing,
    isHovered,
    isPinned,
    setWidth
  }
}

export { useResizable }
