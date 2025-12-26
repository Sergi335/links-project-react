import { Link } from 'react-router-dom'
import { useTime } from '../../hooks/useTime'
import { useSessionStore } from '../../store/session'
import UserAvatar from '../UserAvatar.jsx'
import Clock from './Clock'
import styles from './Header.module.css'
import WeatherComponent from './WeatherComponent'

export default function UserInfo () {
  const user = useSessionStore(state => state.user)
  const { saludo, hours, minutes } = useTime()
  const isProd = import.meta.env.MODE === 'production'
  return (
   <div className={styles.header_info_user_group}>
        <div className={styles.header_info_meteo_info}>
          <Clock hours={hours} minutes={minutes} />
          {isProd && <WeatherComponent />}
        </div>
        <Link to={'/app/profile'} className={styles.header_image_link}>
        <UserAvatar imageKey={user?.profileImage} />
        </Link>
        <div className={styles.header_info_wrapper}>
          <p>{saludo}</p>
          <p className={styles.header_info_user}>{user?.realName}</p>
        </div>
      </div>
  )
}
