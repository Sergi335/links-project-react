import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { usePasteLink } from '../hooks/usePasteLink'
import { updateCategory } from '../services/dbQueries'
import { handleResponseErrors } from '../services/functions'
import { useFormsStore } from '../store/forms'
import { useGlobalStore } from '../store/global'
import { usePreferencesStore } from '../store/preferences'
import styles from './ContextualColMenu.module.css'
import { ArrowDown } from './Icons/icons'

export default function ContextualColMenu ({ visible, points, setPoints, params, desktops, setAddLinkFormVisible }) {
  const { desktopName } = useParams()
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const setGlobalColumns = useGlobalStore(state => state.setGlobalColumns)
  // const globalLinks = useGlobalStore(state => state.globalLinks)
  // const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)
  const setDeleteColFormVisible = useFormsStore(state => state.setDeleteColFormVisible)
  const { pasteLink } = usePasteLink({ params, desktopName, activeLocalStorage })
  const menuRef = useRef(null)
  const subMenuRef = useRef(null)
  const [subMenuSide, setSubMenuSide] = useState('')
  const [subMenuTop, setSubMenuTop] = useState('')

  const handleMoveCol = async (desk) => {
    try {
      const updatedState = [...globalColumns]
      const categoryIndex = updatedState.findIndex(cat => cat._id === params._id)
      const category = updatedState[categoryIndex]
      // Actualizar el campo orden
      const order = globalColumns.filter(col => col.parentId === desk._id).length
      updatedState[categoryIndex] = { ...category, parentId: desk._id, parentSlug: desk.slug, order }
      setGlobalColumns(updatedState)

      const oldCategories = updatedState.filter(cat => cat.parentId === category.parentId)
      const siblings = oldCategories.filter(cat => cat._id !== category._id)
      // Agregamos las categorias que quedan en el escritorio, para actualizar el orden
      const items = siblings.map((cat, index) => ({
        id: cat._id,
        order: index,
        name: cat.name,
        parentId: cat.parentId
      }))
      // Agregar la categoría actual
      items.push({
        parentId: desk._id,
        parentSlug: desk.slug,
        id: category._id,
        order
      })

      const response = await updateCategory({ items })

      const { hasError, message } = handleResponseErrors(response)
      if (hasError) {
        throw new Error(message)
      }
      toast('Movido a ' + desk.displayName)
    } catch (error) {
      toast(error.message)
      // Revertir los cambios en caso de error
      setGlobalColumns(globalColumns)
    }
  }
  useEffect(() => {
    const menu = menuRef.current
    const submenu = subMenuRef.current
    const newPoints = { x: points.x, y: points.y }
    // console.log({ pointsX: points.x, menuWidth: menu.offsetWidth, windowWidth: window.innerWidth, submenuHeight: submenu.offsetHeight, windowHeight: window.innerHeight })
    if (points.x + menu.offsetWidth + submenu.offsetWidth > window.innerWidth) {
      setSubMenuSide('left')
      newPoints.x = window.innerWidth - menu.offsetWidth
    } else {
      setSubMenuSide('right')
    }
    if (points.y + menu.offsetHeight > document.body.scrollHeight) {
      newPoints.y = document.body.scrollHeight - menu.offsetHeight
    }
    if (points.y + submenu.offsetHeight > document.body.scrollHeight || points.y + submenu.offsetHeight > window.innerHeight) {
      setSubMenuTop(`-${submenu.offsetHeight - menu.offsetHeight + 13}px`)
    } else {
      setSubMenuTop('94px')
    }
    setPoints(newPoints)
  }, [params])
  // el 67% depende del ancho del menu no esta fijo TODO
  return (
        <div ref={menuRef} className={
            visible ? styles.flex : styles.hidden
          } style={{ left: points.x, top: points.y }}>
            <p><strong>Opciones Columna</strong></p>
            <p>{params.name}</p>
            <span onClick={() => setAddLinkFormVisible(true)}>Nuevo</span>
            <span onClick={() => { pasteLink() }}>Pegar</span>
            {/* <span>Renombrar</span> */}
            <span className={styles.moveTo}>Mover a<ArrowDown className={`${styles.rotate} uiIcon_small`}/>
              <ul ref={subMenuRef} className={styles.moveList} style={subMenuSide === 'right' ? { top: subMenuTop } : { left: '-67%', top: subMenuTop }}>
                {
                  desktops.map(desk => desk.name === desktopName // <---
                    ? (
                        null
                      )
                    : <li key={desk._id} id={desk._id} onClick={() => { handleMoveCol(desk) }}>{desk.displayName}</li>)
                }
              </ul>
            </span>
            <span onClick={() => setDeleteColFormVisible(true)}>Borrar</span>
        </div>
  )
}
