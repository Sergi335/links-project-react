import { useTime } from '../../hooks/useTime'
import { useSessionStore } from '../../store/session'
import SideBarInfoClock from './SideBarInfoClock'
import styles from './SideInfo.module.css'

export default function SideBarInfo () {
  const user = useSessionStore(state => state.user)
  const { saludo } = useTime()

  return (
        <section className={styles.sidebar_info}>
            <div className={styles.sidebar_info_wrapper}>
              <p>{saludo}</p>
              <SideBarInfoClock />
            </div>
            <p className={styles.sidebar_info_user}>{user.realName}</p>
        </section>
  )
}
