import { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useGoogleAuth from '../../hooks/useGoogleAuth'
import { useTime } from '../../hooks/useTime'
import { useSessionStore } from '../../store/session'
import styles from './Header.module.css'

export default function UserInfoMenu ({ visible, setVisible }) {
  const user = useSessionStore(state => state.user)
  const formRef = useRef(null)
  const { saludo } = useTime()
  const navigate = useNavigate()
  const location = useLocation()

  // Solo usamos el hook si se proporciona setVisible,
  // pero con el Popover API nativo (popover="auto") no es necesario
  // useHideForms({ form: formRef.current, setFormVisible: setVisible })

  const { handleGoogleLogOut } = useGoogleAuth()
  const handleNavigateProfile = () => {
    if (formRef.current?.hidePopover) {
      formRef.current.hidePopover()
    }
    if (setVisible) setVisible(false)
    navigate('/app/profile')
  }

  const handleLogOut = () => {
    if (formRef.current?.hidePopover) {
      formRef.current.hidePopover()
    }
    if (setVisible) setVisible(false)
    handleGoogleLogOut()
  }

  return (
    // eslint-disable-next-line react/no-unknown-property
    <div popover="" id='user-info-menu' ref={formRef} className={styles.header_info_user_menu}>
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
        <button onClick={handleLogOut} className={styles.header_info_user_menu_item}>
            Logout
        </button>
    </div>
  )
}
