// import { useTime } from '../../hooks/useTime'
import { useSessionStore } from '../../store/session'
import UserAvatar from './UserAvatar.jsx'
// import Clock from './Clock'
import styles from './Header.module.css'
import UserInfoMenu from './UserInfoMenu.jsx'
// import WeatherComponent from './WeatherComponent'

export default function UserInfo () {
  const user = useSessionStore(state => state.user)
  // const { hours, minutes } = useTime()
  // const [visible, setVisible] = useState(false)
  // const isProd = import.meta.env.MODE === 'production'
  return (
      <div className={styles.header_info_user_group}>
        <div className={styles.header_info_meteo_info}>
          {/* <Clock hours={hours} minutes={minutes} /> */}
          {/* {isProd && <WeatherComponent />} */}
        </div>
        <UserAvatar imageKey={user?.profileImage} className={styles.header_image_link} />
        <UserInfoMenu />
      </div>
  )
}
