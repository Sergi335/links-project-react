import { Link } from 'react-router-dom'
import styles from './404.module.css'

export default function InternalError () {
  return (
    <div className={styles.main}>
      <div className={styles.wrapper}>
        <h1>500</h1>
        <p>
          Oops something went wrong, please try again later.
        </p>
      </div>
      <Link to={-1}>
        Go Back
      </Link>
    </div>
  )
}
