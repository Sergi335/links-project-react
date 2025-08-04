import { Link } from 'react-router-dom'
import { useTime } from '../../hooks/useTime'
import { useSessionStore } from '../../store/session'
import Clock from './Clock'
import styles from './Header.module.css'

// import WeatherComponent from './WeatherComponent'
export default function UserInfo () {
  const user = useSessionStore(state => state.user)
  const { saludo, hours, minutes } = useTime()
  return (
   <div className={styles.header_info_user_group}>
        <div className={styles.header_info_meteo_info}>
          <Clock hours={hours} minutes={minutes} />
          {/* <WeatherComponent /> */}
        </div>
        <Link to={'/profile'} className={styles.header_image_link}><img src={user?.profileImage ? user?.profileImage : '/img/avatar.svg' } alt={user?.realName}/></Link>
        <div className={styles.header_info_wrapper}>
          <p>{saludo}</p>
          <p className={styles.header_info_user}>{user?.realName}</p>
        </div>
      </div>
  )
}
