import styles from './SideBar.module.css'
export default function SideBarInfoClock ({ hours, minutes }) {
  return (
    <p className={styles.reloj}>
      {/* {`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`} */}
      {`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`}
    </p>
  )
}
