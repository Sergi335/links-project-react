import { Link } from 'react-router-dom'
import { useTime } from '../../hooks/useTime'
import { useSessionStore } from '../../store/session'
import styles from './SideBar.module.css'
import SideBarInfoClock from './SideBarInfoClock'

export default function SideBarInfo () {
  const user = useSessionStore(state => state.user)
  const { saludo, hours, minutes } = useTime()

  return (
    <section className={styles.sidebar_info}>
      <div className={styles.sidebar_info_meteo_info}>
        <SideBarInfoClock hours={hours} minutes={minutes} />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="uiIcon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" /><path d="M13 14l-2 4l3 0l-2 4" /></svg>
      </div>
      <Link to={'/profile'} className={styles.settings_image_link}><img src={user.profileImage ? user.profileImage : '/img/avatar.svg' } alt={user.realName}/></Link>
      <div className={styles.sidebar_info_wrapper}>
        <p>{saludo}</p>
        <p className={styles.sidebar_info_user}>{user.realName}</p>
      </div>
    </section>
  )
}
