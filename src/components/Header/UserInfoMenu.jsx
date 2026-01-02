import { useRef } from 'react'
import { Link } from 'react-router-dom'
import useGoogleAuth from '../../hooks/useGoogleAuth'
import useHideForms from '../../hooks/useHideForms'
import { useTime } from '../../hooks/useTime'
import { useSessionStore } from '../../store/session'
import styles from './Header.module.css'

export default function UserInfoMenu ({ visible, setVisible }) {
  const user = useSessionStore(state => state.user)
  const formRef = useRef(null)
  const { saludo } = useTime()
  useHideForms({ form: formRef.current, setFormVisible: setVisible })
  const { handleGoogleLogOut } = useGoogleAuth()

  return (
    <div ref={formRef} className={styles.header_info_user_menu} style={{ display: visible ? 'flex' : 'none' }}>
        <div className={styles.header_info_wrapper}>
            <p>{saludo}</p>
            <p className={styles.header_info_user}>{user?.realName}</p>
        </div>
        <Link to={'/app/profile'} className={styles.header_info_user_menu_item}>
            Profile
        </Link>
        <button onClick={handleGoogleLogOut} className={styles.header_info_user_menu_item}>
            Logout
        </button>
    </div>
  )
}
