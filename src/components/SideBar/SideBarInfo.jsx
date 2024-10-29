import { useTime } from '../../hooks/useTime'
import { useSessionStore } from '../../store/session'
import styles from './SideBar.module.css'
import SideBarInfoClock from './SideBarInfoClock'

export default function SideBarInfo () {
  const user = useSessionStore(state => state.user)
  const { saludo, hours, minutes } = useTime()

  return (
        <section className={styles.sidebar_info}>
            <div className={styles.sidebar_info_wrapper}>
              <p>{saludo}</p>
              <SideBarInfoClock hours={hours} minutes={minutes} />
            </div>
            <p className={styles.sidebar_info_user}>{user.realName}</p>
        </section>
  )
}
