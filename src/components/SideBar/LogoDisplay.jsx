import { Link } from 'react-router-dom'
import styles from './SideBar.module.css'

export default function LogoDisplay ({ customStyle }) {
  return (
    <div className={styles.logo_container} style={customStyle}>
      <Link className={styles.logo} to={'/'}>
        <div className={styles.logo_text}>
          <span>ZenMarks</span>
        </div>
      </Link>
    </div>
  )
}
