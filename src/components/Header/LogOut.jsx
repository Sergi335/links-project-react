import useGoogleAuth from '../../hooks/useGoogleAuth'
import { SwitchOffIcon } from '../Icons/icons'
import styles from './Header.module.css'

export default function LogOut () {
  const { handleGoogleLogOut } = useGoogleAuth()

  return (
        <section className={`${styles.header_controls} ${styles.divider_left} ${styles.flex_center}`}>
          <button className={styles.header_controls_button} onClick={handleGoogleLogOut}>
            <SwitchOffIcon />
          </button>
        </section>
  )
}
