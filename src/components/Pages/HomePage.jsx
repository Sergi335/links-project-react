import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './HomePage.module.css'

export default function HomePage () {
  useEffect(() => {
    document.title = 'Zenmarks'
    document.body.classList.add(`${styles.home}`)
    document.body.style.backgroundImage = ''
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      if (prefersDarkMode.matches) {
        // Aplicar estilos para el modo oscuro
        document.documentElement.classList.add('dark')
        console.log('dark mode desde el home')
      } else {
        // Aplicar estilos para el modo claro
        document.documentElement.classList.remove('dark')
        console.log('light mode desde el home')
      }
    }
    prefersDarkMode.addEventListener('change', applyTheme)
    return () => {
      // Este código se ejecuta cuando el componente se desmonta
      document.body.classList.remove('home')
      prefersDarkMode.removeEventListener('change', applyTheme)
    }
  }, [])
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#my-gallery',
      children: 'a',
      pswpModule: () => import('photoswipe')
    })
    lightbox.init()
    const lightbox2 = new PhotoSwipeLightbox({
      gallery: '#my-gallery2',
      children: 'a',
      pswpModule: () => import('photoswipe')
    })
    lightbox2.init()
    const lightbox3 = new PhotoSwipeLightbox({
      gallery: '#my-gallery3',
      children: 'a',
      pswpModule: () => import('photoswipe')
    })
    lightbox3.init()
  })
  return (
      <>
        <header className={styles.header}>
          <nav className={styles.nav}>
            <div className={styles.navlinks}>
              <a href="">About</a>
              <a href="">Donate</a>
              <a href="">Github</a>
            </div>
          </nav>
          <div className={styles.heroSection}>
            <div className={styles.logo}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 19V5m6 14V5M6 19V5"/></svg>
              <h2 className={styles.logoText}>Zenmarks</h2>
            </div>
            <h2 className={styles.subtitle}>Organiza Tu Mundo Digital</h2>
            <div className={styles.actionLinks}>
              <Link className={styles.start} to={'/login'}>Get Started</Link>
              <Link className={`${styles.start} ${styles.try}`} to={'/login'}>Try Out</Link>
            </div>
            <p className={styles.headingText}>Bienvenido a <strong className={styles.strong}>Zenmarks</strong>, la herramienta definitiva para gestionar tus enlaces y maximizar tu productividad. Con funciones intuitivas y personalizables, para simplificar tu experiencia digital.</p>
            <video src="img/zenmarks2.webm" autoPlay loop muted></video>
            {/* <div className={styles.fakelinks}>
              <div className={styles.link}>
                <div className={styles.background}></div>
                <div className={styles.border}></div>
                <div className={styles.linkContent}>
                  <img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://github.com&size=64" alt="" />
                  Github
                </div>
              </div>
            </div> */}
          </div>
        </header>
        <main className={styles.main}>
          <section className={styles.section}>
            <div className={styles.textColumn}>
              <h2>Potentes Funciones a tu Alcance</h2>
              <p>Guardar enlaces con un simple copy/paste, añadir descripciones detalladas, imágenes, notas...</p>
              <p><strong>Zenmarks</strong> ofrece un conjunto completo de herramientas para extraer y sintetizar la información de tus enlaces. Reordénarlos con facilidad, reproduce vídeos directamente desde la aplicación y más.</p>
            </div>
            <div className={styles.mediaColumn} id='my-gallery'>
              <a href="img/557shots_so.png" data-pswp-width="960" data-pswp-height="640" target='_blank' ><img src="img/557shots_so.png" width='960' height='640' alt=""/></a>
            </div>
          </section>
          <section className={styles.section}>
            <div className={styles.mediaColumn} id='my-gallery2'>
            <a href="img/717shots_so.png" data-pswp-width="960" data-pswp-height="640" target='_blank' ><img src="img/717shots_so.png" width='960' height='640' alt=""/></a>
            </div>
            <div className={styles.textColumn}>
              <h2>Amplias opciones de personalización</h2>
              <p>Diseña tu experiencia a tu gusto, temas, colores, fondos, iconos de los links ... tú tienes el control.</p>
              <p> Mantén tu espacio de trabajo organizado y estéticamente agradable para una experiencia de usuario agradable.</p>
            </div>
          </section>
          <section className={styles.section}>
          <div className={styles.textColumn}>
              <h2>Mejora continua</h2>
              <p>Estamos comprometidos con la mejora continua. Nuestro equipo está constantemente trabajando en nuevas funciones y mejoras para hacer de Zenmarks la herramienta definitiva para la gestión de enlaces.</p>
              <p> <strong>Próximamente:</strong> Lista de lectura y modo lectura, snippets de código, extensión para el navegador y más. Mantente al tanto de nuestras actualizaciones.</p>
            </div>
            <div className={styles.mediaColumn} id='my-gallery3'>
            <a href="img/189shots_so.png" data-pswp-width="960" data-pswp-height="640" target='_blank' ><img src="img/189shots_so.png" width='960' height='640' alt=""/></a>
            </div>
          </section>
        </main>
        <footer className={styles.footer}>
          <p>Footer</p>
        </footer>
      </>
  )
}
