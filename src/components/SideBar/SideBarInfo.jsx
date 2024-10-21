import { useTime } from '../../hooks/useTime'
import { useSessionStore } from '../../store/session'
import SideBarInfoClock from './SideBarInfoClock'
import styles from './SideInfo.module.css'

export default function SideBarInfo () {
  const user = useSessionStore(state => state.user)
  const { saludo } = useTime()

  return (
        <section className={styles.deskInfos}>
            <div className={styles.deskInfos_info}>
              <p className={styles.saludo}>{saludo}</p>
              <SideBarInfoClock />
            </div>
            <p className={styles.deskInfos_user}>{user.realName}</p>
        </section>
  )
}
