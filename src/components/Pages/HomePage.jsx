import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './HomePage.module.css'
import { PricingTable } from './PricingPage'
import { YouTube, Sparkles } from '../Icons/icons'

export function HomeNav () {
  return (
        <nav className={styles.nav}>
          <div>
            <Link to={'/'}>
              <div className={styles.logo}>
                <span>ZenMarks</span>
              </div>
            </Link>
          </div>
          <div className={styles.navlinks}>
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <a href="#footer">About</a>
          </div>
          <div className={styles.navLogin}>
            <Link to="/login">Login</Link>
          </div>
        </nav>
  )
}

export function HomeFooter () {
  return (
    <footer className={styles.footer} id="footer">
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <span>ZenMarks</span>
          </div>
          <div className={styles.footerLinks}>
            <Link to="/aviso-legal">Aviso Legal</Link>
            <Link to="/privacidad">Política de Privacidad</Link>
            <Link to="/terminos-y-condiciones">Términos de Uso</Link>
            <Link to="/politica-de-cookies">Cookies</Link>
          </div>
          <p className={styles.copy}>© {new Date().getFullYear()} ZenMarks. Todos los derechos reservados.</p>
        </div>
      </footer>
  )
}

export default function HomePage () {
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
    <div className={styles.home}>
      <HomeNav />
      <header className={styles.header}>
        <div className={styles.heroSection}>
          <h1>Tu Mundo Digital <span>Organizado.</span></h1>
          <p>Organiza tu mundo digital con ZenMarks, el gestor de marcadores para productividad y ocio.</p>
          <div className={styles.actionLinks}>
            <Link className={styles.start} to={'/login'}>Get Started</Link>
            <Link className={`${styles.start} ${styles.try}`} to={'/login'}>Try Out</Link>
          </div>
          <img src="img/heroimage4.png" />
        </div>
      </header>
      <main className={styles.main}>
        <section className={styles.cards} id="features">
          <h2>Features built for <span>power users</span></h2>
          <p>Everything you need to curate, consume, and comprehend content faster.</p>
          <div className={styles.cardsContainer}>
            <div className={styles.card}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-chrome"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M12 9h8.4" /><path d="M14.598 13.5l-4.2 7.275" /><path d="M9.402 13.5l-4.2 -7.275" /></svg>
            <h3>Importa tus enlaces</h3>
            <p>Traete tus enlaces favoritos de chrome con un solo click</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
          <div className={styles.card}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-clipboard"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17.997 4.17a3 3 0 0 1 2.003 2.83v12a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 2.003 -2.83a4 4 0 0 0 3.997 3.83h4a4 4 0 0 0 3.98 -3.597zm-3.997 -2.17a2 2 0 1 1 0 4h-4a2 2 0 1 1 0 -4z" /></svg>
            <h3>No olvides nada</h3>
            <p>Añade notas, descripciones, imágenes, listas, tareas ...</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
          </div>
          <div className={styles.card}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-brand-youtube"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 3a5 5 0 0 1 5 5v8a5 5 0 0 1 -5 5h-12a5 5 0 0 1 -5 -5v-8a5 5 0 0 1 5 -5zm-9 6v6a1 1 0 0 0 1.514 .857l5 -3a1 1 0 0 0 0 -1.714l-5 -3a1 1 0 0 0 -1.514 .857z" /></svg>
            <h3>Todos tus vídeos</h3>
            <p>Visualiza y resume videos de youtube con inteligencia artificial</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
          <div className={styles.card}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-settings-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12.483 20.935c-.862 .239 -1.898 -.178 -2.158 -1.252a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.08 .262 1.496 1.308 1.247 2.173" /><path d="M16 19h6" /><path d="M19 16v6" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>
            <h3>Añade nuevos enlaces</h3>
            <p>Añade nuevos enlaces mediante la extension de chrome</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
            <a href="https://chromewebstore.google.com/" target='_blank' className={styles.cardButton} rel="noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-chrome"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M12 9h8.4" /><path d="M14.598 13.5l-4.2 7.275" /><path d="M9.402 13.5l-4.2 -7.275" /></svg>
              <span>Disponible en <b>Chrome Store</b></span>
            </a>
          </div>
          <div className={styles.card}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-category-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4h6v6h-6v-6" /><path d="M14 4h6v6h-6v-6" /><path d="M4 14h6v6h-6v-6" /><path d="M14 17h6m-3 -3v6" /></svg>
            <h3>Organiza a tu modo</h3>
            <p>Organiza tus enlaces de la manera que prefieras</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
          </div>
        </section>
        <section className={styles.section}>
          <div style={{ maxWidth: '60%', margin: '0 auto', display: 'flex', flexDirection: 'row', gap: '50px' }}>
            <div className={styles.textColumn}>
              <h2>Potentes Funciones a tu Alcance</h2>
              <p>Resume y chatea con videos de Youtube, guarda enlaces con un simple copiar y pegar, añade descripciones detalladas, imágenes, notas...</p>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                <YouTube />
                <Sparkles />
              </div>
              <p><strong>Zenmarks</strong> ofrece un conjunto completo de herramientas para extraer y sintetizar la información de tus enlaces.</p>
              <p>Reordénarlos con facilidad, reproducir vídeos directamente desde la aplicación y más.</p>
            </div>
            <div className={styles.mediaColumn} id='my-gallery'>
              <a href="img/airesume.webp" data-pswp-width="960" data-pswp-height="601" target='_blank' ><img src="img/airesume.webp" width='960' height='601' alt="" /></a>
            </div>
          </div>
        </section>
        <section className={styles.pricingSection} id="pricing">
          <PricingTable style={{ minHeight: 'auto' }} />
        </section>
      </main>
      <HomeFooter />
    </div>
  )
}
