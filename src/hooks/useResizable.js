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
  const widthRef = useRef(getSavedWidth())
  const rafRef = useRef(null)
  const pendingWidthRef = useRef(null)

  const setWidthValue = useCallback((nextWidth) => {
    widthRef.current = nextWidth
    setWidth(nextWidth)
  }, [])

  // Observer para detectar cambios en la clase "pinned"
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Funcion para verificar si tiene la clase pinned
    const checkPinnedClass = () => {
      const hasPinned = element.classList.contains('pinned')
      setIsPinned(hasPinned)

      if (hasPinned) {
        // Restaurar el ancho guardado
        const savedWidth = localStorage.getItem(storageKey)
        if (savedWidth) {
          setWidthValue(parseInt(savedWidth, 10))
        } else {
          setWidthValue(savedWidthRef.current)
        }
      } else {
        // Guardar el ancho actual antes de minimizar
        if (widthRef.current !== minWidth) {
          localStorage.setItem(storageKey, widthRef.current.toString())
          savedWidthRef.current = widthRef.current
        }

        // Adoptar la anchura minima
        setWidthValue(minWidth)
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
  }, [minWidth, storageKey, setWidthValue])

  // Handlers para hover - expandir cuando no esta pinned
  const handleMouseEnter = useCallback(() => {
    if (!isPinned) {
      setIsHovered(true)
      const savedWidth = localStorage.getItem(storageKey)
      if (savedWidth) {
        setWidthValue(parseInt(savedWidth, 10))
      } else {
        setWidthValue(savedWidthRef.current)
      }
    }
  }, [isPinned, storageKey, setWidthValue])

  const handleMouseLeave = useCallback(() => {
    if (!isPinned) {
      setIsHovered(false)
      setWidthValue(minWidth)
    }
  }, [isPinned, minWidth, setWidthValue])

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsResizing(true)
    startXRef.current = e.clientX
    startWidthRef.current = widthRef.current
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return

    const diff = e.clientX - startXRef.current
    const newWidth = startWidthRef.current + diff

    // Aplicar limites minimo y maximo
    const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))

    if (constrainedWidth === widthRef.current) return

    pendingWidthRef.current = constrainedWidth

    if (rafRef.current !== null) return

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null
      const nextWidth = pendingWidthRef.current
      if (nextWidth == null || nextWidth === widthRef.current) return
      setWidthValue(nextWidth)
    })
  }, [isResizing, minWidth, maxWidth, setWidthValue])

  const handleMouseUp = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    if (pendingWidthRef.current != null && pendingWidthRef.current !== widthRef.current) {
      setWidthValue(pendingWidthRef.current)
    }

    pendingWidthRef.current = null

    if (isPinned && widthRef.current !== minWidth) {
      localStorage.setItem(storageKey, widthRef.current.toString())
      savedWidthRef.current = widthRef.current
    }

    setIsResizing(false)
  }, [isPinned, minWidth, storageKey, setWidthValue])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      // Prevenir seleccion de texto mientras se redimensiona
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

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return {
    width,
    elementRef,
    handleMouseDown,
    handleMouseEnter,
    handleMouseLeave,
    isResizing,
    isHovered,
    isPinned,
    setWidth: setWidthValue
  }
}

export { useResizable }
