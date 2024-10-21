import { useTime } from '../../hooks/useTime'
import styles from './SideInfo.module.css'
export default function SideBarInfoClock () {
  const { hours, minutes } = useTime()

  return (
    <p className={styles.reloj}>
      {/* {`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`} */}
      {`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`}
    </p>
  )
}
