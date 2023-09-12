import { Link } from 'react-router-dom'
import useGoogleAuth from '../hooks/useGoogleAuth'
import { useSessionStore } from '../store/session'
import styles from './Header.module.css'
import GithubIcon from './Icons/icons'
import Search from './Search'
export default function Header () {
  const user = useSessionStore(state => state.user)
  const { handleGoogleLogOut } = useGoogleAuth()
  return (

        <header className={styles.header}>
          <div className={styles.headLeft}>
            <div>
              <Link className={styles.logo} to={'/'}>
                <GithubIcon />
                <div className={styles.logoText}>
                  <span className='textBold'>
                    JUST
                  </span>
                  <span className='textMono'>
                    Links
                  </span>
                </div>
              </Link>
            </div>
          </div>
          <div className={styles.headCenter}>
            <Search />
          </div>
          <div className={styles.headRight}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="uiIcon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="uiIcon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
          </svg>

            <img src={user.photoUrl} alt={user.displayName}/>
            <svg onClick={handleGoogleLogOut} className="uiIcon icofont-exit" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"></path></svg>
          </div>
        </header>

  )
}
