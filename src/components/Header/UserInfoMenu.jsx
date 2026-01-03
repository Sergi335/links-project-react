import { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useGoogleAuth from '../../hooks/useGoogleAuth'
import useHideForms from '../../hooks/useHideForms'
import { useTime } from '../../hooks/useTime'
import { useSessionStore } from '../../store/session'
import styles from './Header.module.css'

export default function UserInfoMenu ({ visible, setVisible }) {
  const user = useSessionStore(state => state.user)
  const formRef = useRef(null)
  const { saludo } = useTime()
  const navigate = useNavigate()
  const location = useLocation()
  useHideForms({ form: formRef.current, setFormVisible: setVisible })
  const { handleGoogleLogOut } = useGoogleAuth()
  const handleNavigateProfile = () => {
    setVisible(false)
    navigate('/app/profile')
  }

  return (
    <div ref={formRef} className={styles.header_info_user_menu} style={{ display: visible ? 'flex' : 'none' }}>
        <div className={styles.header_info_wrapper}>
            <p>{saludo}</p>
            <p className={styles.header_info_user}>{user?.realName}</p>
        </div>
        {
          location.pathname !== '/app/profile' &&
          <button onClick={handleNavigateProfile} className={styles.header_info_user_menu_item}>
              Profile
          </button>
        }
        <button onClick={handleGoogleLogOut} className={styles.header_info_user_menu_item}>
            Logout
        </button>
    </div>
  )
}
