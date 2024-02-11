// import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './HomePage.module.css'
import { useEffect } from 'react'

export default function HomePage () {
  useEffect(() => {
    document.title = 'Zenmarks'
    document.body.classList.add(`${styles.home}`)
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (theme) => {
      if (prefersDarkMode.matches) {
        // Aplicar estilos para el modo oscuro
        document.documentElement.classList.add('dark')
      } else {
        // Aplicar estilos para el modo claro
        document.documentElement.classList.remove('dark')
      }
    }
    prefersDarkMode.addEventListener('change', applyTheme)

    return () => {
      document.body.classList.remove('home')
      prefersDarkMode.removeEventListener('change', applyTheme)
    }
  }, [])
  return (
      <>
        <header className={styles.header}>
          {/* <div className={styles.background}></div> */}
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
            <h2>Organiza Tu Mundo Digital con Zenmarks</h2>
            <p>Bienvenido a Zenmarks, la herramienta definitiva para gestionar tus enlaces y maximizar tu productividad. Con funciones intuitivas y personalizables, estamos aquí para simplificar tu experiencia digital</p>
            {/* <img src="img/hero3.png" alt="" />
            <img src="img/hero4.png" alt="" />
            <img src="img/hero5.png" alt="" /> */}
            <div className={styles.fakelinks}>
              {/* <div className={styles.link}><img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.es&size=64" alt="" />Google</div> */}
              <div className={styles.link}>
                <div className={styles.background}></div>
                <div className={styles.border}></div>
                <div className={styles.linkContent}>
                  <img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://github.com&size=64" alt="" />
                  Github
                </div>
              </div>
              {/* <div className={styles.link}><img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://amazon.es&size=64" alt="" />Amazon</div> */}
            </div>
            <Link className={styles.start} to={'/login'}>Get Started</Link>
          </div>
        </header>
        <main className={styles.main}>
          <section className={styles.section}>
            <div className={styles.textColumn}>
              <h2>Potentes Funciones a tu Alcance</h2>
              <p>Desde guardar enlaces con un simple copy/paste hasta añadir descripciones detalladas, nuestra aplicación ofrece un conjunto completo de herramientas para optimizar tu flujo de trabajo. Reordena tus enlaces con facilidad, reproduce vídeos directamente desde la aplicación y más.</p>
            </div>
            {/* <img src="img/pic1.svg" alt="" /> */}
            <div className={styles.mediaColumn}>
              <video src="img/Video2.webm" autoPlay loop controls muted></video>
            </div>
          </section>
          <section className={styles.section}>
            <div className={styles.mediaColumn}>
            <img src="img/pic2.svg" alt="" />
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
            <img src="img/pic3.svg" alt="" />
            </div>
          </section>
        </main>
        <footer>
          <p>Footer</p>
        </footer>
      </>
  )
}
