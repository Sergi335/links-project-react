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
            <p className={styles.headingText}>Bienvenido a Zenmarks, la herramienta definitiva para gestionar tus enlaces y maximizar tu productividad. Con funciones intuitivas y personalizables, para simplificar tu experiencia digital.</p>
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
            <div className={styles.actionLinks}>
              <Link className={styles.start} to={'/login'}>Get Started</Link>
              <Link className={`${styles.start} ${styles.try}`} to={'/login'}>Try Out</Link>
            </div>
          </div>
        </header>
        <main className={styles.main}>
          <section className={styles.section}>
            <div className={styles.textColumn}>
              <h2>Potentes Funciones a tu Alcance</h2>
              <p>Desde guardar enlaces con un simple copy/paste, añadir descripciones detalladas, imágenes, notas... nuestra aplicación ofrece un conjunto completo de herramientas para extraer y sintetizar la información de tus enlaces. Reordénarlos con facilidad, reproducir vídeos directamente desde la aplicación y más.</p>
            </div>
            <div className={styles.mediaColumn}>
              {/* <video src="img/zenmarks2.webm" autoPlay loop controls muted></video> */}
              <img src="img/557shots_so.png" alt="" />
            </div>
          </section>
          <section className={styles.section}>
            <div className={styles.mediaColumn}>
            <img src="img/717shots_so.png" alt="" />
            </div>
            <div className={styles.textColumn}>
              <h2>Hazlo Tuyo: Personalización sin Límites</h2>
              <p>Diseña tu experiencia a tu gusto con nuestras opciones de personalización avanzadas. Desde ajustes de interfaz hasta temas y diseños, tú tienes el control. Mantén tu espacio de trabajo organizado y estéticamente agradable para una experiencia de usuario óptima.</p>
            </div>
          </section>
          <section className={styles.section}>
          <div className={styles.textColumn}>
              <h2>Innovando Constantemente para Ti</h2>
              <p>Estamos comprometidos con la mejora continua. Nuestro equipo está constantemente trabajando en nuevas funciones y mejoras para hacer de Zenmarks la herramienta definitiva para la gestión de enlaces y la productividad en general. Mantente al tanto de nuestras actualizaciones.</p>
            </div>
            <div className={styles.mediaColumn}>
            <img src="img/189shots_so.png" alt="" />
            </div>
          </section>
        </main>
        <footer className={styles.footer}>
          <p>Footer</p>
        </footer>
      </>
  )
}
