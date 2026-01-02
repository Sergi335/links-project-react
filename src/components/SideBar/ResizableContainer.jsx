import { useResizable } from '../../hooks/useResizable'
import styles from './SideBar.module.css'
// Componente Resizable genérico
export const ResizableContainer = ({ children, initialWidth, minWidth, maxWidth, className = '', id, pinned = true }) => {
  const { width, elementRef, handleMouseDown, handleMouseEnter, handleMouseLeave, isResizing } = useResizable(
    initialWidth,
    minWidth,
    maxWidth
  )

  return (
    <div
      id={id}
      ref={elementRef}
      className={`${className} ${pinned ? 'pinned' : ''}`}
      style={{ width: `${width}px`, position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Handle de redimensionado */}
      <div
        onMouseDown={handleMouseDown}
        className={`${styles.resizable_handle} ${isResizing ? 'bg-blue' : 'bg-gray'}`}
        style={{ transform: 'translateX(50%)' }}
      >
        {/* Área de agarre más grande para mejor UX */}
        <div className={styles.resizable_grab_area} />
      </div>
    </div>
  )
}
