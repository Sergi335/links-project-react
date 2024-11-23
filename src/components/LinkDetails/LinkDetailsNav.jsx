import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from '../Icons/icons'
import styles from './LinkDetails.module.css'

export default function LinkDetailsNav ({ links, actualDesktop, linkId, context, slug }) {
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH
  const path = context === 'singlecol' ? `${rootPath}${basePath}/${actualDesktop}/${slug}/` : `${rootPath}${basePath}/${actualDesktop}/link/`

  const nextIndex = links.findIndex(link => linkId === link?._id) + 1 // > length
  // console.log('🚀 ~ LinkDetailsNav ~ nextIndex:', nextIndex)
  const prevIndex = links.findIndex(link => linkId === link?._id) - 1 // -2
  // console.log('🚀 ~ LinkDetailsNav ~ prevIndex:', prevIndex)
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
  // const handleBack = (event) => {
  //   event.preventDefault() // Evita la navegación normal del enlace
  //   window.history.back() // Navega hacia atrás en el historial
  // }
  useEffect(() => {
    const links = Array.from(document.querySelectorAll('.link'))
    const link = links.find(link => link.id === linkId)
    if (links && link) {
      links.forEach(link => {
        if (link.id === linkId) {
          link.classList.add('navlink_active')
        } else {
          link.classList.remove('navlink_active')
        }
      })
    }
  }, [linkId])
  // if (!Array.isArray(links) || typeof linkId === 'undefined') {
  //   console.error("Invalid props: 'links' must be an array and 'linkId' must be defined.")
  //   return null
  // }
  return (
    <section className={styles.navigation_container}>
      <div className={styles.navigation}>
          {prevId
            ? <Link className={styles.details_nav_link} to={`${path}${prevId}`}>Prev<ArrowLeft/></Link>
            : <a className={styles.details_nav_link_disabled}>Prev<ArrowLeft/></a>}
          {
            context !== 'singlecol' && <Link className={styles.details_nav_link} to={`${rootPath}${basePath}/${actualDesktop}`} end>Volver</Link>
          }
          {nextId
            ? <Link className={styles.details_nav_link} to={`${path}${nextId}`}><ArrowRight/>Next</Link>
            : <a className={styles.details_nav_link_disabled}><ArrowRight/>Next</a>}
      </div>
    </section>
  )
}
