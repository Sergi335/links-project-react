import React, { useEffect, useState } from 'react'
import styles from './ScrollToTop.module.css'

export default function ScrollToTop () {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    isVisible && (
      <button className={styles.scrollToTopButton} onClick={scrollToTop}>
        {/* Puedes usar una imagen o un icono aquí */}
        ^
      </button>
    )
  )
}
