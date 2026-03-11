import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Masonry from 'react-layout-masonry'
import { Link } from 'react-router-dom'
import { useTitle } from '../../hooks/useTitle'
import { BraveBrowser, Chrome, Edge, Opera } from '../Icons/icons'
import styles from './HomePage.module.css'
import { PricingTable } from './PricingPage'

export function HomeNav () {
  const { t } = useTranslation('common')

  return (
    <nav className={styles.nav}>
      <div>
        <Link to={'/'}>
          <div className={styles.logo}>
            <span>{t('brand')}</span>
          </div>
        </Link>
      </div>
      <div className={styles.navlinks}>
        <Link to="/features">{t('nav.features')}</Link>
        <Link to="/pricing">{t('nav.pricing')}</Link>
        <a href="#footer">{t('nav.about')}</a>
      </div>
      <div className={styles.navLogin}>
        <Link to="/login">{t('nav.login')}</Link>
      </div>
    </nav>
  )
}

export function HomeFooter () {
  const { t } = useTranslation('common')

  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.footerContent}>
        <div className={styles.footerLogo}>
          <span>{t('brand')}</span>
        </div>
        <div className={styles.footerLinks}>
          <Link to="/aviso-legal">{t('footer.legal')}</Link>
          <Link to="/privacidad">{t('footer.privacy')}</Link>
          <Link to="/terminos-y-condiciones">{t('footer.terms')}</Link>
          <Link to="/politica-de-cookies">{t('footer.cookies')}</Link>
        </div>
        <p className={styles.copy}>{t('footer.copy', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  )
}

export default function HomePage () {
  const { t } = useTranslation('home')

  useTitle({ title: 'ZenMarks - Home' })

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
          <h1>{t('hero.titlePrefix')} <span>{t('hero.titleHighlight')}</span></h1>
          <p>{t('hero.subtitle')}</p>
          <p className={styles.browserIconsTitle}>{t('hero.worksWith')}</p>
          <div className={styles.browserIcons}>
            <Chrome width={32} height={32} />
            <Edge width={32} height={32} />
            <BraveBrowser width={32} height={32} />
            <Opera width={32} height={32} />
          </div>
          <div className={styles.actionLinks}>
            <Link className={styles.start} to={'/login'}>{t('hero.getStarted')}</Link>
          </div>
          <img src="img/heroImage.png" alt="hero" />
        </div>
      </header>
      <main className={styles.main}>
        <section className={styles.cards} id="features">
          <h2>{t('cards.titlePrefix')} <span>{t('cards.titleHighlight')}</span></h2>
          <p>{t('cards.subtitle')}</p>
          <div className={styles.cardsContainer}>
            <div className={styles.card}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-chrome"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M12 9h8.4" /><path d="M14.598 13.5l-4.2 7.275" /><path d="M9.402 13.5l-4.2 -7.275" /></svg>
              <h3>{t('cards.items.0.title')}</h3>
              <p>{t('cards.items.0.description')}</p>
              <p>{t('cards.items.0.detail')}</p>
            </div>
            <div className={styles.card}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-clipboard"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17.997 4.17a3 3 0 0 1 2.003 2.83v12a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 2.003 -2.83a4 4 0 0 0 3.997 3.83h4a4 4 0 0 0 3.98 -3.597zm-3.997 -2.17a2 2 0 1 1 0 4h-4a2 2 0 1 1 0 -4z" /></svg>
              <h3>{t('cards.items.1.title')}</h3>
              <p>{t('cards.items.1.description')}</p>
              <p>{t('cards.items.1.detail')}</p>
            </div>
            <div className={styles.card}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-brand-youtube"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 3a5 5 0 0 1 5 5v8a5 5 0 0 1 -5 5h-12a5 5 0 0 1 -5 -5v-8a5 5 0 0 1 5 -5zm-9 6v6a1 1 0 0 0 1.514 .857l5 -3a1 1 0 0 0 0 -1.714l-5 -3a1 1 0 0 0 -1.514 .857z" /></svg>
              <h3>{t('cards.items.2.title')}</h3>
              <p>{t('cards.items.2.description')}</p>
              <p>{t('cards.items.2.detail')}</p>
            </div>
            <div className={styles.card}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-settings-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12.483 20.935c-.862 .239 -1.898 -.178 -2.158 -1.252a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.08 .262 1.496 1.308 1.247 2.173" /><path d="M16 19h6" /><path d="M19 16v6" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>
              <h3>{t('cards.items.3.title')}</h3>
              <p>{t('cards.items.3.description')}</p>
              <p>{t('cards.items.3.detail')}</p>
              <a href="https://chromewebstore.google.com/" target="_blank" className={styles.cardButton} rel="noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-chrome"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M12 9h8.4" /><path d="M14.598 13.5l-4.2 7.275" /><path d="M9.402 13.5l-4.2 -7.275" /></svg>
                <span>{t('cards.chromeCtaPrefix')} <b>{t('cards.chromeCtaStore')}</b></span>
              </a>
            </div>
            <div className={styles.card}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-category-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4h6v6h-6v-6" /><path d="M14 4h6v6h-6v-6" /><path d="M4 14h6v6h-6v-6" /><path d="M14 17h6m-3 -3v6" /></svg>
              <h3>{t('cards.items.4.title')}</h3>
              <p>{t('cards.items.4.description')}</p>
              <p>{t('cards.items.4.detail')}</p>
            </div>
          </div>
        </section>
        <section className={styles.section}>
          <div style={{ maxWidth: '60%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '50px' }}>
            <div className={styles.textColumn}>
              {/* <h2>{t('section.title')}</h2> */}
              <p>{t('section.text1')}<strong>{t('section.text2a')}</strong> {t('section.text2b')}</p>
              {/* <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                <YouTube />
                <Sparkles />
              </div> */}
            </div>
            <div className={styles.mediaColumn} id="my-gallery">
              <Masonry
                id="gallery"
                columns={{ 640: 1, 768: 1, 1024: 2, 1280: 2 }}
                gap={8}
              >
                <a href="img/img8.webp" data-pswp-width="984" data-pswp-height="486" target="_blank" rel="noreferrer"><img src="img/img8.webp" width="984" height="486" alt="zenmarks interface" /></a>
                <a href="img/img9.webp" data-pswp-width="984" data-pswp-height="486" target="_blank" rel="noreferrer"><img src="img/img9.webp" width="984" height="486" alt="zenmarks interface" /></a>
                <a href="img/img3.webp" data-pswp-width="984" data-pswp-height="486" target="_blank" rel="noreferrer"><img src="img/img3.webp" width="984" height="486" alt="zenmarks interface" /></a>
                <a href="img/img4.webp" data-pswp-width="984" data-pswp-height="486" target="_blank" rel="noreferrer"><img src="img/img4.webp" width="984" height="486" alt="zenmarks interface" /></a>
                <a href="img/img5.webp" data-pswp-width="984" data-pswp-height="486" target="_blank" rel="noreferrer"><img src="img/img5.webp" width="984" height="486" alt="zenmarks interface" /></a>
                <a href="img/img6.webp" data-pswp-width="984" data-pswp-height="486" target="_blank" rel="noreferrer"><img src="img/img6.webp" width="984" height="486" alt="zenmarks interface" /></a>
              </Masonry>
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
