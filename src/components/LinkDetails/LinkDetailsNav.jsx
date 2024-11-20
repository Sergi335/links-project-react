import { NavLink } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from '../Icons/icons'
import styles from './LinkDetails.module.css'

export default function LinkDetailsNav ({ links, actualDesktop, linkId, context, slug }) {
  console.log('🚀 ~ LinkDetailsNav ~ links:', links)
  console.log(linkId)
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH

  if (linkId === undefined) return
  const nextIndex = links.findIndex(link => linkId === link?._id) + 1 // > length
  console.log('🚀 ~ LinkDetailsNav ~ nextIndex:', nextIndex)
  const prevIndex = links.findIndex(link => linkId === link?._id) - 1 // -2
  console.log('🚀 ~ LinkDetailsNav ~ prevIndex:', prevIndex)
  let nextId
  if (typeof links[nextIndex] === 'object' && links[nextIndex]._id !== undefined) {
    nextId = links[nextIndex]._id
  } else {
    nextId = null
  }
  let prevId
  if (typeof links[prevIndex] === 'object' && links[prevIndex]._id !== undefined) {
    prevId = links[prevIndex]._id
  } else {
    prevId = null
  }
  const path = context === 'singlecol' ? `${rootPath}${basePath}/${actualDesktop}/${slug}/` : `${rootPath}${basePath}/${actualDesktop}/link/`
  const handleBack = (event) => {
    event.preventDefault() // Evita la navegación normal del enlace
    window.history.back() // Navega hacia atrás en el historial
  }
  return (
    <section className={styles.navigation_container}>
      <div className={styles.navigation}>
          {prevId
            ? <NavLink className={styles.details_nav_link} to={`${path}${prevId}`}>Prev<ArrowLeft/></NavLink>
            : <a className={styles.details_nav_link_disabled}>Prev<ArrowLeft/></a>}
          <NavLink className={styles.details_nav_link} to={'#'} end onClick={handleBack}>Volver</NavLink>
          {nextId
            ? <NavLink className={styles.details_nav_link} to={`${path}${nextId}`}><ArrowRight/>Next</NavLink>
            : <a className={styles.details_nav_link_disabled}><ArrowRight/>Next</a>}
      </div>
    </section>
  )
}
