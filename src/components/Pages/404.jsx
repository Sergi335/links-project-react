import { Link } from 'react-router-dom'
import styles from './404.module.css'

export default function NotFound () {
  return (
    <div className={styles.main}>
      <div className={styles.wrapper}>
        <h1>404</h1>
        <p>
          Sorry, we couldn’t find the page you’re looking for.
        </p>
      </div>
      <Link href="#" to="/">
        Go to the home page
      </Link>
    </div>
  )
}
