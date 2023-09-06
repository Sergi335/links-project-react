import { Link } from 'react-router-dom'
import useGoogleAuth from '../hooks/useGoogleAuth'
import { useSessionStore } from '../store/session'
import styles from './Header.module.css'
import GithubIcon from './Icons/icons'
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
            <input type="text" name="" id="" />
          </div>
          <div className={styles.headRight}>
            <p>{user}</p>
            <button onClick={handleGoogleLogOut}>{'Log Out'}</button>
          </div>
        </header>

  )
}
