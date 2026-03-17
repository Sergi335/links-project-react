import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useGoogleAuth from '../../hooks/useGoogleAuth'
import { useTitle } from '../../hooks/useTitle'
import { constants } from '../../services/constants'
import { createPortalSession, deleteAccount, editUserAditionalInfo, findDuplicateLinks, getAllLinks, getSignedUrl, getSubscriptionStatus, uploadProfileImg } from '../../services/dbQueries'
import { formatDate, handleResponseErrors } from '../../services/functions'
import { useBrokenLinksCheckStore } from '../../store/brokenLinksCheck'
import { useGlobalStore } from '../../store/global'
import { useSessionStore } from '../../store/session'
import { useTopLevelCategoriesStore } from '../../store/useTopLevelCategoriesStore'
import UserAvatar from '../Header/UserAvatar.jsx'
import { AddImageIcon, BrokenLinksIcon, CloseIcon, DuplicatesIcon, EditIcon, EyeIcon, EyeOffIcon, UploadIcon } from '../Icons/icons'
import styles from './ProfilePage.module.css'

export function ConfirmPasswordForm ({ handleReauth, setReauthVisible }) {
  const { t } = useTranslation('profile')
  return (
        <form onSubmit={handleReauth} className={`${styles.changePasswordDialog} deskForm`}>
          <p>{t('reauthForm.currentPassword')}</p>
          <input type="text" id="currentPassword" name='currentPassword' className={styles.textSecurity}/>
          <div className={styles.flexButtons}>
            <button id="changePasswordSubmit" type='submit'>{t('common.send')}</button>
            <button id="changePasswordCancel" onClick={() => setReauthVisible(false)}>{t('common.cancel')}</button>
          </div>
        </form>
  )
}
export function UserPreferences ({ user, setUser }) {
  const { t } = useTranslation('profile')
  console.log(user)
  // const [visible, setVisible] = useState(false)
  const deleteAccountRef = useRef(null)
  const [reauthVisible, setReauthVisible] = useState(false)
  const [bookmarksLoading, setBookmarksLoading] = useState(false)
  const { handleDeleteUser, handleReauthenticate, handleReauthenticateWithGoogle } = useGoogleAuth()

  const handleReauth = async (e) => {
    e.preventDefault()
    const deleteLoading = toast.loading(t('toasts.deleteLoading'))
    const form = e.currentTarget
    const password = form.currentPassword.value
    const reAuthResponse = await handleReauthenticate(password)

    const { hasError, message } = handleResponseErrors(reAuthResponse)
    if (hasError) {
      toast.update(deleteLoading, { render: message.code === 'auth/wrong-password' ? t('toasts.wrongPassword') : t('toasts.requestErrorRetryLater'), type: 'error', isLoading: false, autoClose: 3000 })
      return
    }
    setReauthVisible(false)
    await handleDeleteUser()
    setTimeout(() => {
      toast.update(deleteLoading, { render: t('toasts.deleteSuccess'), type: 'success', isLoading: false, autoClose: 3000 })
      setUser(null)
    }, 2000)
  }
  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    const deleteLoading = toast.loading(t('toasts.deleteLoading'))
    const response = await deleteAccount({ email: user.email })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast.update(deleteLoading, { render: message, type: 'error', isLoading: false, autoClose: 3000 })
      return
    }
    // Esto puede dar error de reauth pero si lo ponemos primero da error del middleware de sesion, el orden debe ser este
    const googleResponse = await handleDeleteUser()
    if (googleResponse.code === 'auth/requires-recent-login') {
      if (user.signMethod === 'google') {
        // setVisible(false)
        deleteAccountRef.current.hidePopover()
        toast.update(deleteLoading, { render: t('toasts.reauthRequiredDelete'), type: 'error', isLoading: false, autoClose: 3000 })
        const response = await handleReauthenticateWithGoogle()
        const { hasError, message } = handleResponseErrors(response)
        if (hasError) {
          console.log(message)
          toast.update(deleteLoading, { render: t('toasts.reauthGoogleError'), type: 'error', isLoading: false, autoClose: 3000 })
          return
        }
        await handleDeleteUser()
        setTimeout(() => {
          toast.update(deleteLoading, { render: t('toasts.deleteSuccess'), type: 'success', isLoading: false, autoClose: 3000 })
          setUser(null)
        }, 2000)
        return
      }
      // setVisible(false)
      deleteAccountRef.current.hidePopover()
      toast.update(deleteLoading, { render: t('toasts.reauthRequiredDelete'), type: 'error', isLoading: false, autoClose: 3000 })
      setReauthVisible(true)
      return
    }
    setTimeout(() => {
      toast.update(deleteLoading, { render: t('toasts.deleteSuccess'), type: 'success', isLoading: false, autoClose: 3000 })
      setUser(null)
    }, 2000)
  }

  const handleUploadBookmarks = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.html')) {
      toast.error(t('toasts.invalidHtml'))
      return
    }

    const formData = new FormData()
    formData.append('bookmarks', file)

    setBookmarksLoading(true)
    const importToast = toast.loading(t('toasts.importLoading'))

    try {
      const response = await fetch(`${constants.BASE_API_URL}/storage/import-bookmarks`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'x-justlinks-user': 'SergioSR',
          'x-justlinks-token': 'otroheader'
        },
        body: formData
      })

      const data = await response.json()
      const { hasError, message } = handleResponseErrors(data)

      if (hasError) {
        toast.update(importToast, { render: message, type: 'error', isLoading: false, autoClose: 3000 })
        return
      }

      toast.update(importToast, {
        render: t('toasts.importSuccess', { count: data.imported || 0 }),
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })

      // Recargar la página para reflejar los cambios
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Error importing bookmarks:', error)
      toast.update(importToast, { render: t('toasts.importError'), type: 'error', isLoading: false, autoClose: 3000 })
    } finally {
      setBookmarksLoading(false)
      // Limpiar el input file
      const fileInput = document.getElementById('bookmarksFile')
      if (fileInput) fileInput.value = ''
    }
  }

  return (
    <>
    {/* <h3>{t('tabs.preferences')}</h3> */}
    <div className={`${styles.preferences}`} id="preferences">
      <div className={styles.importSection}>
        <h3>{t('preferences.import.title')}</h3>
        <p>{t('preferences.import.description')}</p>
        <form onChange={handleUploadBookmarks}>
          <button className={styles.upFile} disabled={bookmarksLoading}>
            <label htmlFor="bookmarksFile">
              <UploadIcon />
              {t('preferences.import.uploadHtml')}
            </label>
            <input
              id="bookmarksFile"
              className={styles.upFileInput}
              type="file"
              name="bookmarksFile"
              accept=".html"
              disabled={bookmarksLoading}
            />
          </button>
        </form>
        {bookmarksLoading && <span className={styles.loader}></span>}
      </div>
      <div className={styles.closeAccount}>
      <h3>{t('preferences.deleteAccount.title')}</h3>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <button id="closeAccount" popovertarget="deleteAccount">
        {t('preferences.deleteAccount.button')}
      </button>
      </div>

            {/* eslint-disable-next-line react/no-unknown-property */}
            <div ref={deleteAccountRef} popover='' id='deleteAccount'>
              <form action="" className='deskForm'>
              <p>{t('preferences.deleteAccount.confirmText')}</p>
              <p>{t('preferences.deleteAccount.warning')}</p>
              <div className='button_group'>
                <button type="button" id="confirm" onClick={handleDeleteAccount}>{t('common.confirm')}</button>
                {/* eslint-disable-next-line react/no-unknown-property */}
                <button type="button" id="cancel" popovertarget="deleteAccount" popovertargetaction="hide">{t('common.cancel')}</button>
              </div>
              </form>
            </div>

      {
        reauthVisible && <ConfirmPasswordForm handleReauth={handleReauth} setReauthVisible={setReauthVisible}/>
      }
    </div>
    </>
  )
}

export function UserSubscription ({ user }) {
  const { t } = useTranslation('profile')
  const navigate = useNavigate()
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH
  const [subscription, setSubscription] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await getSubscriptionStatus()
        console.log('Subscription response:', response)
        if (!response.hasError) {
          setSubscription(response)
        }
      } catch (error) {
        console.error('Error fetching subscription:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSubscription()
  }, [])

  const handleManageSubscription = async () => {
    setPortalLoading(true)
    try {
      const response = await createPortalSession({
        returnUrl: `${window.location.origin}${rootPath}${basePath}/profile`
      })
      if (response.hasError) {
        toast.error(response.message)
        return
      }
      window.location.href = response.url
    } catch (error) {
      toast.error(t('toasts.billingPortalError'))
    } finally {
      // setPortalLoading(false)
    }
  }

  const handleUpgrade = () => {
    navigate(`${rootPath}pricing`)
  }

  const getPlanBadgeClass = (plan) => {
    switch (plan) {
      case 'PRO': return styles.proBadge
      case 'ENTERPRISE': return styles.enterpriseBadge
      default: return styles.freeBadge
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return t('subscription.status.active')
      case 'canceled': return t('subscription.status.canceled')
      case 'past_due': return t('subscription.status.past_due')
      case 'trialing': return t('subscription.status.trialing')
      default: return status || t('subscription.status.default')
    }
  }

  const SubscriptionSkeleton = () => (
    <>
      <div className={`${styles.subscriptionInfo} ${styles.subscriptionSkeleton}`} aria-hidden="true">
        <div className={styles.planRow}>
          <span className={`${styles.skeletonBlock} ${styles.skeletonLabel}`}></span>
          <span className={`${styles.skeletonBlock} ${styles.skeletonBadge}`}></span>
        </div>
        <div className={styles.planRow}>
          <span className={`${styles.skeletonBlock} ${styles.skeletonLabel}`}></span>
          <span className={`${styles.skeletonBlock} ${styles.skeletonStatus}`}></span>
        </div>
        <div className={styles.limitsInfo}>
          <p><span className={`${styles.skeletonBlock} ${styles.skeletonLine}`}></span></p>
          <p><span className={`${styles.skeletonBlock} ${styles.skeletonLine}`}></span></p>
          <p><span className={`${styles.skeletonBlock} ${styles.skeletonLineShort}`}></span></p>
        </div>
      </div>

      <div className={styles.subscriptionActions} aria-hidden="true">
        <span className={`${styles.skeletonBlock} ${styles.skeletonButton}`}></span>
      </div>
    </>
  )

  return (
    <>
      <h3>{t('subscription.title')}</h3>
      <div className={styles.subscriptionSection}>
        {isLoading
          ? (
          <SubscriptionSkeleton />
            )
          : (
          <>
            <div className={styles.subscriptionInfo}>
              <div className={styles.planRow}>
                <span>{t('subscription.planCurrent')}</span>
                <span className={`${styles.planBadge} ${getPlanBadgeClass(subscription?.plan)}`}>
                  {subscription?.plan || 'FREE'}
                </span>
              </div>
              <div className={styles.planRow}>
                <span>{t('subscription.statusLabel')}</span>
                <span className={styles.statusText}>{getStatusText(subscription?.status)}</span>
              </div>
              {subscription?.limits && (
                <div className={styles.limitsInfo}>
                  <p><strong>{t('subscription.storage')}</strong> {t('subscription.storageUsage', { used: (subscription.limits.storageMB - subscription.remainingQuota).toFixed(2), total: subscription.limits.storageMB })}</p>
                  <p><strong>{t('subscription.aiCalls')}</strong> {subscription.limits.llmCallsPerMonth === -1 ? t('subscription.aiCallsUnlimited') : t('subscription.aiCallsUsage', { used: subscription.llmCallsThisMonth, total: subscription.limits.llmCallsPerMonth })}</p>
                  {/* <p><strong>{t('subscription.lastRenewal')}</strong> {subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString(i18n.language) : ''}</p> */}
                </div>
              )}
            </div>

            <div className={styles.subscriptionActions}>
              {subscription?.plan === 'FREE'
                ? (
                <button className={styles.upgradeBtn} onClick={handleUpgrade}>
                  Mejorar plan
                </button>
                  )
                : (
                <button
                  className={styles.manageBtn}
                  onClick={handleManageSubscription}
                  // disabled={portalLoading}
                >
                  {portalLoading ? 'Abriendo...' : 'Gestionar suscripción'}
                </button>
                  )}
            </div>
          </>
            )}
      </div>
    </>
  )
}

export function UserSecurity ({ user, setUser }) {
  const { t } = useTranslation('profile')
  const [changePasswordStep, setChangePasswordStep] = useState(0) // 0: no visible, 1: current password, 2: new password
  const [backupLoading, setBackupLoading] = useState(false)
  const [confirmRestoreVisible, setConfirmRestoreVisible] = useState(false)
  const [pendingFile, setPendingFile] = useState(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentPasswordCache, setCurrentPasswordCache] = useState('') // Guardar contraseña actual para reauth posterior
  const { handleChangeFirebasePassword, handleReauthenticate } = useGoogleAuth()
  const popoverRef = useRef()
  const newPopoverRef = useRef()

  useEffect(() => {
    if (changePasswordStep === 2 && newPopoverRef.current) {
      newPopoverRef.current.showPopover()
    }
  }, [changePasswordStep])

  const handleChangePassword = () => {
    setChangePasswordStep(1) // Mostrar formulario de contraseña actual
  }

  const handleCurrentPasswordSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const currentPassword = form.currentPassword.value

    if (!currentPassword) {
      toast.error(t('toasts.enterCurrentPassword'))
      return
    }

    const reAuthResponse = await handleReauthenticate(currentPassword)

    if (reAuthResponse.status === 'success') {
      setCurrentPasswordCache(currentPassword) // Guardar para reauth posterior
      setChangePasswordStep(2) // Pasar al formulario de nueva contraseña
      toast.success(t('toasts.passwordVerified'))
    } else {
      if (reAuthResponse.error.code === 'auth/wrong-password') {
        toast.error(t('toasts.wrongPassword'))
      } else {
        toast.error(t('toasts.passwordVerifyError'))
      }
    }
  }

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const newPassword = form.newPassword.value
    const confirmPassword = form.confirmPassword.value

    if (!newPassword || !confirmPassword) {
      toast.error(t('toasts.completeAllFields'))
      return
    }

    if (newPassword.length < 6) {
      toast.error(t('toasts.passwordMinLength'))
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error(t('toasts.passwordMismatch'))
      return
    }

    // Reautenticar justo antes de cambiar la contraseña para asegurar que es reciente
    const reAuthResponse = await handleReauthenticate(currentPasswordCache)

    if (reAuthResponse.status !== 'success') {
      toast.error(t('toasts.authErrorRetry'))
      setChangePasswordStep(1) // Volver al paso 1
      setCurrentPasswordCache('') // Limpiar caché
      return
    }

    // Ahora sí cambiar la contraseña inmediatamente después del reauth
    const response = await handleChangeFirebasePassword(newPassword)
    if (response.status === 'success') {
      toast.success(t('toasts.passwordChanged'))
      setChangePasswordStep(0)
      setCurrentPasswordCache('') // Limpiar caché de contraseña
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    } else {
      if (response.error.code === 'auth/weak-password') {
        toast.error(t('toasts.passwordMinLength'))
      } else if (response.error.code === 'auth/requires-recent-login') {
        toast.error(t('toasts.sessionExpired'))
        setChangePasswordStep(1) // Volver a pedir contraseña actual
        setCurrentPasswordCache('') // Limpiar caché
      } else {
        toast.error(t('toasts.changePasswordError'))
      }
    }
  }

  const handleCancelChangePassword = () => {
    setChangePasswordStep(0)
    setCurrentPasswordCache('') // Limpiar caché de contraseña
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }

  const handleCreateBackup = (e) => {
    setBackupLoading(true)
    fetch(`${constants.BASE_API_URL}/storage/backup`, {
      method: 'POST',
      ...constants.FETCH_OPTIONS
    })
      .then(res => res.json())
      .then(async data => {
        console.log(data)
        const { hasError, message } = handleResponseErrors(data)
        if (hasError) {
          toast(message)
          setBackupLoading(false)
          return
        }
        const updateUserResponse = await editUserAditionalInfo({ email: user.email, fields: { lastBackupUrl: data.data.key } })
        // const { resultadoDb } = data
        setUser(updateUserResponse.data)
        toast(t('toasts.backupCreated'))
        setBackupLoading(false)
      })
  }
  const handleDownloadBackup = async (e) => {
    const url = await getSignedUrl(user.lastBackupUrl, true)

    window.open(url, '_blank')
  }
  const handleUploadBackup = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Guardar el archivo y mostrar confirmación
    setPendingFile(file)
    setConfirmRestoreVisible(true)
  }

  const handleConfirmRestore = () => {
    if (!pendingFile) return

    const formData = new FormData()
    formData.append('backup', pendingFile)

    setConfirmRestoreVisible(false)
    const restoreToast = toast.loading(t('toasts.restoringBackup'))

    fetch(`${constants.BASE_API_URL}/storage/restorebackup`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'x-justlinks-user': 'SergioSR',
        'x-justlinks-token': 'otroheader'
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        const { hasError, message } = handleResponseErrors(data)
        if (hasError) {
          toast.update(restoreToast, { render: message, type: 'error', isLoading: false, autoClose: 3000 })
          return
        }
        toast.update(restoreToast, { render: t('toasts.backupRestored'), type: 'success', isLoading: false, autoClose: 2000 })
        // Recargar la página para reflejar los cambios
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })
      .catch(error => {
        console.error('Error restoring backup:', error)
        toast.update(restoreToast, { render: t('toasts.backupRestoreError'), type: 'error', isLoading: false, autoClose: 3000 })
      })
      .finally(() => {
        setPendingFile(null)
        // Limpiar el input file
        const fileInput = document.getElementById('upFile')
        if (fileInput) fileInput.value = ''
      })
  }

  const handleCancelRestore = () => {
    setConfirmRestoreVisible(false)
    setPendingFile(null)
    // Limpiar el input file
    const fileInput = document.getElementById('upFile')
    if (fileInput) fileInput.value = ''
  }
  return (
    <div className={styles.securityWrapper}>
      {
        user.signMethod !== 'google' && (<div className={styles.password}>
          <h3>{t('security.changePassword.title')}</h3>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <button id="changePassword" onClick={handleChangePassword} type="submit" popovertarget="currentPasswordPopover" popovertargetaction="show">{t('security.changePassword.button')}</button>
          {
            changePasswordStep === 1 && (
              // eslint-disable-next-line react/no-unknown-property
              <div popover="" id="currentPasswordPopover" ref={popoverRef}>
                <form onSubmit={handleCurrentPasswordSubmit} className={`${styles.changePasswordDialog} deskForm`}>
                  <p>{t('security.changePassword.confirmCurrent')}</p>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      name='currentPassword'
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className={styles.togglePasswordButton}
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <div className={styles.flexButtons}>
                    <button id="currentPasswordSubmit" type='submit'>{t('common.next')}</button>
                    {/* eslint-disable-next-line react/no-unknown-property */}
                    <button id="currentPasswordCancel" type="button" onClick={handleCancelChangePassword} popovertarget="currentPasswordPopover" popovertargetaction="hide">{t('common.cancel')}</button>
                  </div>
                </form>
              </div>
            )
          }
          {
            changePasswordStep === 2 && (
              // eslint-disable-next-line react/no-unknown-property
              <div popover="" id="newPasswordPopover" ref={newPopoverRef}>
                <form onSubmit={handleNewPasswordSubmit} className={`${styles.changePasswordDialog} deskForm`}>
                  <p>{t('security.changePassword.newPasswordPrompt')}</p>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      name='newPassword'
                      placeholder={t('security.changePassword.newPasswordPlaceholder')}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className={styles.togglePasswordButton}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name='confirmPassword'
                      placeholder={t('security.changePassword.confirmNewPasswordPlaceholder')}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className={styles.togglePasswordButton}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <div className={styles.flexButtons}>
                    <button id="newPasswordSubmit" type='submit'>{t('security.changePassword.submit')}</button>
                    <button id="newPasswordCancel" type="button" onClick={handleCancelChangePassword}>{t('common.cancel')}</button>
                  </div>
                </form>
              </div>

            )
          }
        </div>)
      }
      <div className={styles.backup}>
        <div>
          <h3>{t('security.backup.title')}</h3>
          <div className={styles.backupControls}>
            <button id="backup" onClick={handleCreateBackup}>{t('security.backup.create')}</button>
            {
              user.lastBackupUrl && <button id="download" onClick={handleDownloadBackup}>{t('common.download')}</button>
            }
          </div>
          {
            backupLoading && (<span className={styles.loader}></span>)
          }
          <p id="errorMessage"> </p>
          <p id="successMessage"></p>
        </div>
        <form onChange={handleUploadBackup}>
          <p>{t('security.backup.restore')}</p>
          <button className={styles.upFile}>
            <label htmlFor="upFile">
              <UploadIcon />
              {t('common.uploadFile')}
            </label>
            <input id="upFile" className={styles.upFileInput} type="file" name="upFile"/>
          </button>
          <p id="errorUpMessage"> </p>
          <p id="successUpMessage"></p>
        </form>
        {
          confirmRestoreVisible && (
            <div className='deskForm'>
              <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>¿Seguro que quieres restaurar esta copia de seguridad?</p>
              <p style={{ marginBottom: '0.5rem' }}>Todos tus datos actuales serán borrados.</p>
              <p style={{ color: '#ff6b6b', marginBottom: '1.5rem' }}><strong>¡Importante!</strong> Los archivos de imágenes no serán restaurados.</p>
              <div className='button_group'>
                <button id="confirmRestore" onClick={handleConfirmRestore}>Sí, restaurar</button>
                <button id="cancelRestore" onClick={handleCancelRestore}>{t('security.backup.confirmNo')}</button>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}
export function PieChart ({ getCategoryName }) {
  const { t } = useTranslation('profile')
  const brokenLinks = useBrokenLinksCheckStore(state => state.brokenLinks)
  const isChecking = useBrokenLinksCheckStore(state => state.status === 'checking')
  const progress = useBrokenLinksCheckStore(state => state.progress)
  const currentLinkName = useBrokenLinksCheckStore(state => state.currentLinkName)
  const cancelScan = useBrokenLinksCheckStore(state => state.cancelScan)
  const clearBrokenLinks = useBrokenLinksCheckStore(state => state.clearBrokenLinks)
  const normalizedProgress = parseInt(progress, 10) || 0
  const progressDegrees = 360 * normalizedProgress / 100

  const handleCancel = () => {
    cancelScan()
    toast(t('toasts.operationCanceled'))
  }
  return (
    <>
    {
    (isChecking || normalizedProgress > 0)
      ? (
      <>
      <div
        className={`${styles.progressPieChart} ${normalizedProgress > 50 ? styles.gt50 : ''}`}
        data-percent={normalizedProgress}
      >
        <div className={styles.ppcProgress}>
          <div
            className={styles.ppcProgressFill}
            style={{ transform: `rotate(${progressDegrees}deg)` }}
          ></div>
        </div>
        <div className={styles.ppcPercents}>
          <div className={styles.pccPercentsWrapper}>
            <span>{normalizedProgress}%</span>
          </div>
        </div>
      </div>
      <p id='currentLink' className={styles.currentLink}>
        {currentLinkName ? t('toasts.checkingLink', { name: currentLinkName }) : ''}
      </p>
      {isChecking && (
        <button onClick={handleCancel} className={styles.cancelButton}>
          {t('common.cancel')}
        </button>
      )}
      </>)
      : null
      }
      {
        brokenLinks.length > 0 && (<div className={styles.resultsHeader}>
                        <p id="counter"><span className={styles.bold}>{t('stats.brokenLinksCount')}</span> {brokenLinks.length}</p>
                        <button onClick={clearBrokenLinks}><CloseIcon/></button>
                        </div>)
      }
      <div id="brokenLinksResult" className={styles.brokenLinksResult}>
        {
          brokenLinks && brokenLinks.map((link, index) => {
            return (
              <div key={link.link._id + index} className={styles.link}>
                <a target="_blank" href={link.link.url} rel="noreferrer">
                  <img src={link.link.imgUrl}/>{link.link.name}
                </a>
                {/* <p><span className={styles.bold}>Escritorio:</span> {link.link.escritorio}</p> */}
                <p><span className={styles.bold}>{t('stats.panel')}</span> {getCategoryName(link.link.categoryId)}</p>
                <p><span className={styles.bold}>{t('stats.url')}</span> {link.link.url}</p>
              </div>
            )
          })
        }
      </div>
      </>
  )
}
export function UserStats ({ user }) {
  const { t } = useTranslation('profile')
  const [duplicates, setDuplicates] = useState([])
  const [duplicatesLoading, setDuplicatesLoading] = useState(false)
  const brokenLinksStatus = useBrokenLinksCheckStore(state => state.status)
  const startBrokenLinksScan = useBrokenLinksCheckStore(state => state.startScan)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const topLevelCategoriesStore = useTopLevelCategoriesStore(state => state.topLevelCategoriesStore)

  const getCategoryName = (categoryId) => {
    const category = globalColumns.find(cat => cat._id === categoryId)
    return category ? category.name : t('common.unknown')
  }
  // TODO Errores
  const handleFindDuplicates = async (e) => {
    setDuplicatesLoading(true)
    const response = await findDuplicateLinks()
    if (response.data.length === 0) {
      toast.success(t('toasts.noDuplicates'))
    }
    setDuplicates(response.data)
    setDuplicatesLoading(false)
  }
  const handleFindBrokenLinks = async (e) => {
    if (brokenLinksStatus === 'checking') return

    const response = await getAllLinks()
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
      return
    }
    const { data } = response
    const result = await startBrokenLinksScan(data)
    if (result.completed && result.brokenLinks.length === 0) {
      toast.success(t('toasts.noBrokenLinks'))
    }
  }

  return (
        <>
          {/* <h3>Estadísticas</h3> */}
          <div className={styles.statsInfo}>
            <table>
              <tbody>
                <tr>
                  <th>{t('stats.desktops')}</th>
                  <th>{t('stats.panels')}</th>
                  <th>{t('stats.links')}</th>
                </tr>
                <tr>
                  <td>{topLevelCategoriesStore.length}</td>
                  <td>{globalColumns.length}</td>
                  <td>{globalLinks.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.statsControls}>
            <div className={styles.groupControl}>
              <h3>{t('stats.findDuplicates')}</h3>
              <button id="duplicates" onClick={handleFindDuplicates}>
                <DuplicatesIcon />
                {t('common.search')}
              </button>
            </div>
            <div className={styles.groupControl}>
              <h3>{t('stats.findBrokenLinks')}</h3>
              <button id="brokenLinks" onClick={handleFindBrokenLinks} disabled={brokenLinksStatus === 'checking'}>
                <BrokenLinksIcon />
                {t('common.search')}
              </button>
            </div>
          </div>
          <div className={styles.results}>
            {
              duplicates.length > 0 && (
                <div className={styles.resultsHeader}>
                  <p id="counter"><span className={styles.bold}>{t('stats.duplicatesCount')} </span>{duplicates.length}</p><button onClick={() => setDuplicates([])}><CloseIcon/></button>
                </div>
              )
            }

            <PieChart getCategoryName={getCategoryName}/>
            {

              duplicatesLoading && (<span className={styles.loader}></span>)

            }
          <div className={styles.duplicatesResult}>
            {
              !duplicatesLoading && duplicates && duplicates.map((duplicate, index) => {
                return (
                  <>
                    <div key={duplicate._id + index} className={styles.link}>
                      <a target="_blank" href={duplicate.url} rel="noreferrer">
                        <img src={duplicate.imgUrl}/>{duplicate.name}
                      </a>
                      {/* <p><span className={styles.bold}>Escritorio:</span> {duplicate.escritorio}</p> */}
                      <p><span className={styles.bold}>{t('stats.panel')}</span> {getCategoryName(duplicate.categoryId)}</p>
                      <p><span className={styles.bold}>{t('stats.url')}</span> {duplicate.url}</p>
                    </div>
                  </>
                )
              })
            }
          </div>
        </div>

    </>
  )
}
export function UserInfo ({ user, setUser }) {
  const { t } = useTranslation('profile')
  const [fileToUpload, setFileToUpload] = useState()
  const [fileToUploadLoading, setFileToUploadLoading] = useState(false)
  const [editName, setEditName] = useState(false)
  const [editWebsite, setEditWebsite] = useState(false)
  const [editAboutMe, setEditAboutMe] = useState(false)
  // console.log(user)

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault()
    setEditName(false)
    setEditWebsite(false)
    setEditAboutMe(false)
    const form = e.target
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)
    // console.log(data)
    const response = await editUserAditionalInfo({ email: user.email, fields: { ...data } })
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
    } else {
      // console.log(response)
      const newUserState = { ...response.data }
      setUser(newUserState)
      toast(t('toasts.infoUpdated'))
    }
  }
  const handleUploadImageInputChange = async (e) => {
    const file = e.target.files[0]
    // console.log(file.size)
    if (file.size > 2e+6) {
      toast.error(t('toasts.imageTooLarge'))
      return
    }
    const previewImage = document.getElementById('preview-image')
    const imageUrl = URL.createObjectURL(file)
    previewImage.src = imageUrl
    setFileToUpload(file)
  }
  const handleUploadImage = async (e) => {
    setFileToUploadLoading(true)
    const response = await uploadProfileImg(fileToUpload)

    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast.error(message)
      setFileToUploadLoading(false)
    } else {
      setFileToUpload(null)
      const newUserState = { ...user, profileImage: response.data.key }
      setUser(newUserState)
      setFileToUploadLoading(false)
      toast(t('toasts.imageChanged'))
    }
  }
  const handleCancelUploadImage = async (e) => {
    const previewImage = document.getElementById('preview-image')
    previewImage.src = await getSignedUrl(user.profileImage)
    setFileToUpload(null)
  }
  const handleEditInfo = (e) => {
    if (e.currentTarget.id === 'editName' || (e.currentTarget.id === 'editName' && e.target.tagName === 'STRONG')) {
      setEditName(true)
      setEditWebsite(false)
      setEditAboutMe(false)
    }
    if (e.currentTarget.id === 'editWeb' || (e.currentTarget.id === 'editWeb' && e.target.tagName === 'STRONG')) {
      setEditWebsite(true)
      setEditName(false)
      setEditAboutMe(false)
    }
    if (e.currentTarget.id === 'editAbout' || (e.currentTarget.id === 'editAbout' && e.target.tagName === 'STRONG')) {
      setEditAboutMe(true)
      setEditName(false)
      setEditWebsite(false)
    }
  }
  // useEffect(() => {
  //   document.addEventListener('click', handleClickOutside)
  //   return () => document.removeEventListener('click', handleClickOutside)
  // }, [])
  return (
    <div className={styles.info}>
      <div className={styles.wrapper}>
        {/* <h3>Información Básica</h3> */}
        <div className={styles.aditionalInfo}>
          <div className={styles.profileImage}>
            <UserAvatar imageKey={user?.profileImage} id="preview-image" className='uploadForm' />
          </div>
          <div className={styles.uploadImageTooltip}>
            <p>{t('userInfo.uploadProfileImage')}</p>
            <p>{t('userInfo.recommendedSize')}</p>
            <p>{t('userInfo.maxSize')}</p>
            {
              !fileToUploadLoading && (
                <button className={styles.upFile}>
                  <label htmlFor="image-input">
                    <AddImageIcon />
                    {t('userInfo.uploadImage')}
                  </label>
                  <input className={styles.imageInput} type="file" accept="image/*" name="image-input" id='image-input' onChange={handleUploadImageInputChange}/>
                </button>
              )
            }
            {
              fileToUpload && !fileToUploadLoading && (<div><button className={styles.upFile} onClick={handleUploadImage}>{t('common.save')}</button>
              <button className={styles.upFile} onClick={handleCancelUploadImage}>{t('common.cancel')}</button></div>)
            }
            {
              fileToUploadLoading && (<span className={styles.loader}></span>)
            }
          </div>
        </div>
      </div>
        <div className={styles.userInfo}>
          <div className={styles.otherInfo}>
            <form id="otherInfoForm" onSubmit={handlePersonalInfoSubmit}>
              <div className={styles.rowGroup}>
                {
                  editName
                    ? <><label htmlFor="realName">{t('userInfo.fullName')}: </label><input type="text" name="realName" defaultValue={user.realName || ''} placeholder='John Doe'/><button id="editOtherInfo" type="submit">{t('common.save')}</button><button id="cancelEditOtherInfo" onClick={() => setEditName(false)}>{t('common.cancel')}</button></>
                    : <><p id='editName' onClick={handleEditInfo}><strong>{t('userInfo.fullName')}</strong>:&nbsp;&nbsp;{user.realName || t('userInfo.fallbackUser')}</p><EditIcon className={`uiIcon ${styles.display}`}/></>
                }
              </div>
              <div className={styles.rowGroup}>
                {
                  editWebsite
                    ? <><label htmlFor="website">{t('userInfo.website')}: </label><input type="text" name="website" defaultValue={user.website || ''} placeholder='www.mywebsite.com'/><button id="editOtherInfo" type="submit">{t('common.save')}</button><button id="cancelEditOtherInfo" onClick={() => setEditWebsite(false)}>{t('common.cancel')}</button></>
                    : <><p id='editWeb' onClick={handleEditInfo}><strong>{t('userInfo.website')}</strong>:&nbsp;&nbsp;{user.website || t('userInfo.fallbackWebsite')}</p><EditIcon className={`uiIcon ${styles.display}`}/></>
                }
              </div>
              <div className={styles.rowGroup}>
                {
                  editAboutMe
                    ? <><label htmlFor="aboutMe">{t('userInfo.aboutMe')}:</label><textarea name="aboutMe" cols="30" rows="10" defaultValue={user.aboutMe || ''} placeholder={t('userInfo.fallbackAbout')}/><button id="editOtherInfo" type="submit">{t('common.save')}</button><button id="cancelEditOtherInfo" onClick={() => setEditAboutMe(false)}>{t('common.cancel')}</button></>
                    : <><p id='editAbout' onClick={handleEditInfo}><strong>{t('userInfo.aboutMe')}</strong>:&nbsp;&nbsp;{user.aboutMe || t('userInfo.fallbackAbout')}</p><EditIcon className={`uiIcon ${styles.display}`}/></>
                }
              </div>
            <p className={styles.dateJoin}><strong>{t('userInfo.memberSince')}&nbsp;&nbsp; </strong>{formatDate(user.createdAt)}</p>
            </form>
          </div>

      </div>
    </div>
  )
}
export function ProfileHeader ({ user }) {
  const { t } = useTranslation('profile')
  return (
    <header className={styles.infoHeader}>
      <h3>{t('header.title')}</h3>
      <p>{user.realName} <span className={styles.about}>{user.aboutMe ? user.aboutMe : t('header.fallbackAbout')}</span></p>
      <p>{user.email}</p>
    </header>
  )
}
export default function ProfilePage () {
  const { t } = useTranslation('profile')
  const user = useSessionStore(state => state.user)
  console.log(user)

  const setUser = useSessionStore(state => state.setUser)
  const infoRef = useRef()
  const statsRef = useRef()
  const secRef = useRef()
  const prefRef = useRef()
  useTitle({ title: t('pageTitle', { name: user.realName }) })
  useEffect(() => {
    openTab('info', 'infoTab')
  }, [])
  const openTab = (tabName, tabId) => {
    const tabcontent = [infoRef.current, statsRef.current, secRef.current, prefRef.current]
    const tablinks = document.getElementsByClassName('buttonlink')
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none'
    }
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(` ${styles.active}`, '')
    }
    document.getElementById(tabName).style.display = 'flex'
    document.getElementById(tabId).className += ` ${styles.active}`
  }
  return (
    <main className={styles.profileWrapper}>
      <ProfileHeader user={user}/>
      <section className={styles.buttons}>
        <button className={`${styles.tablinks} buttonlink`} id="infoTab" onClick={() => { openTab('info', 'infoTab') }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ color: '#3c9aed', paddingTop: '1px' }} className="uiIcon-button" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
          {t('tabs.info')}
        </button>
        <button className={`${styles.tablinks} buttonlink`} id="statsTab" onClick={() => { openTab('stats', 'statsTab') }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(48 179 82)', paddingTop: '1px' }} className="uiIcon-button" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 3.2a9 9 0 1 0 10.8 10.8a1 1 0 0 0 -1 -1h-6.8a2 2 0 0 1 -2 -2v-7a.9 .9 0 0 0 -1 -.8" /><path d="M15 3.5a9 9 0 0 1 5.5 5.5h-4.5a1 1 0 0 1 -1 -1v-4.5" /></svg>
          {t('tabs.stats')}
        </button>
        <button className={`${styles.tablinks} buttonlink`} id="securityTab" onClick={() => { openTab('security', 'securityTab') }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(184 111 48)', paddingTop: '1px' }} className="uiIcon-button" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" /><path d="M12 11m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 12l0 2.5" /></svg>
          {t('tabs.security')}
        </button>
        <button className={`${styles.tablinks} buttonlink`} id="preferencesTab" onClick={() => { openTab('preferences', 'preferencesTab') }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(184 48 48)', paddingTop: '1px' }} className="uiIcon-button" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" /><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>
          {t('tabs.preferences')}
        </button>
      </section>
      <section className={styles.content}>
        <div ref={infoRef} className={styles.tabcontent} id="info">
          <UserInfo user={user} setUser={setUser}/>
          <UserSubscription user={user}/>
        </div>
        <div ref={statsRef} className={`${styles.statistics} ${styles.tabcontent}`} id="stats">
          <UserStats user={user}/>
        </div>
        <div ref={secRef} className={styles.tabcontent} id="security">
          <UserSecurity user={user} setUser={setUser}/>
        </div>
        <div ref={prefRef} className={styles.tabcontent} id="preferences">
          <UserPreferences user={user} setUser={setUser}/>
        </div>
      </section>
    </main>
  )
}
