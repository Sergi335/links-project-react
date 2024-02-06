// import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './HomePage.module.css'
import { useEffect } from 'react'

export default function HomePage () {
  useEffect(() => {
    document.title = 'Zenmarks'
    document.body.classList.add('home')
    // const body = document.body
    // body.style.backgroundImage = 'linear-gradient(to top, #feada6 0%, #f5efef 100%)'
  })
  return (
      <>
        <header className={styles.header}>
          <div className={styles.background}></div>
          <nav className={styles.nav}>
            <div className={styles.navlinks}>
              <a href="">About</a>
              <a href="">Donate</a>
              <a href="">Github</a>
            </div>
          </nav>
          {/* <h1>Bienvenido a Zenmarkz<span className={styles.sup}>Beta</span></h1> */}
          <div className={styles.heroImage}>
            {/* <img width='125' className={styles.logo} src="img/Aiken-colored.svg" alt="" /> */}
            <div className={styles.logo}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 19V5m6 14V5M6 19V5"/></svg>
              <h2>Zenmarks</h2>
              {/* <span className={styles.sup}>Beta</span> */}
            </div>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita, voluptatum consequatur! Error sit quidem eligendi itaque repellendus deserunt, molestiae, magnam illum recusandae neque hic pariatur dolorum, optio fuga dolores laborum.</p>
            {/* <img src="img/hero3.png" alt="" />
            <img src="img/hero4.png" alt="" />
            <img src="img/hero5.png" alt="" /> */}
            <div className={styles.fakelinks}>
              <div className={styles.link}><img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.es&size=64" alt="" />Google</div>
              <div className={styles.link}><img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://github.com&size=64" alt="" />Github</div>
              <div className={styles.link}><img src="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://amazon.es&size=64" alt="" />Amazon</div>
            </div>
            <Link className={styles.start} to={'/login'}>Get Started</Link>
          </div>
        </header>
        <main>
          <section className={styles.section}>
            <div className={styles.textColumn}>
              <h2>Section 1</h2>
              <p>Vídeo usando la app</p>
            </div>
            {/* <img src="img/pic1.svg" alt="" /> */}
            <video src="img/Video2.webm" autoPlay loop controls></video>
          </section>
          <section className={styles.section}>
            <img src="img/pic2.svg" alt="" />
            <div className={styles.textColumn}>
              <h2>Section 2</h2>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.</p>
            </div>
          </section>
          <section className={styles.section}>
          <div className={styles.textColumn}>
              <h2>Section 3</h2>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.</p>
            </div>
            <img src="img/pic3.svg" alt="" />
          </section>
        </main>
        <footer>
          <p>Footer</p>
        </footer>
      </>
  )
}
