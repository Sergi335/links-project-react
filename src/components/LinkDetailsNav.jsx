import { NavLink } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from './Icons/icons'
import styles from './Pages/LinkDetails.module.css'

export default function LinkDetailsNav ({ links, actualDesktop, linkId }) {
  const nextIndex = links.findIndex(link => linkId.id === link._id) + 1 // > length
  const prevIndex = links.findIndex(link => linkId.id === link._id) - 1 // -2
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
  return (
    <section className={styles.navigation_container}>
      <div className={styles.navigation}>
          {prevId
            ? <NavLink className={styles.details_nav_link} to={`/desktop/link/${prevId}`}>Prev<ArrowLeft/></NavLink>
            : <a className={styles.details_nav_link_disabled}>Prev<ArrowLeft/></a>}
          <NavLink className={styles.details_nav_link} to={`/desktop/${actualDesktop}`}>Volver</NavLink>
          {nextId
            ? <NavLink className={styles.details_nav_link} to={`/desktop/link/${nextId}`}><ArrowRight/>Next</NavLink>
            : <a className={styles.details_nav_link_disabled}><ArrowRight/>Next</a>}
      </div>
    </section>
  )
}
