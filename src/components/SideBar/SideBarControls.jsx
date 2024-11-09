import useGoogleAuth from '../../hooks/useGoogleAuth'
import { SwitchOffIcon } from '../Icons/icons'
import styles from './SideBar.module.css'

export default function SideBarControls () {
  const { handleGoogleLogOut } = useGoogleAuth()

  return (
        <section className={styles.sidebar_controls}>
          <div className={styles.settings} onClick={handleGoogleLogOut}>
            <SwitchOffIcon />
          </div>
        </section>
  )
}
