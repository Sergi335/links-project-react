import { Link } from 'react-router-dom'
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
      <section className={styles.navigation}>
          {prevId ? <Link to={`/desktop/link/${prevId}`}>Prev</Link> : null}
          <Link to={`/desktop/${actualDesktop}`}>Volver</Link>
          {nextId ? <Link to={`/desktop/link/${nextId}`}>Next</Link> : null}
      </section>
  )
}
