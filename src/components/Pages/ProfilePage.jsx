import styles from './ProfilePage.module.css'
import { useSessionStore } from '../../store/session'
import { AddImageIcon, BrokenLinksIcon, CloseIcon, DuplicatesIcon, KeyIcon, UploadIcon } from '../Icons/icons'
import { formatDate, handleResponseErrors } from '../../services/functions'
import { useEffect, useRef, useState } from 'react'
import { uploadProfileImg, editUserAditionalInfo, getAllLinks, findDuplicateLinks } from '../../services/dbQueries'
import { toast } from 'react-toastify'
import { constants } from '../../services/constants'
import useGoogleAuth from '../../hooks/useGoogleAuth'
import { useGlobalStore } from '../../store/global'
import { useDesktopsStore } from '../../store/desktops'

export function UserPreferences () {
  const [visible, setVisible] = useState(false)
  const setUser = useSessionStore(state => state.setUser)
  const user = useSessionStore(state => state.user)
  const { handleDeleteUser } = useGoogleAuth()
  const handleDeleteAccount = (e) => {
    e.preventDefault()
    console.log('delete account')
    fetch(`${constants.BASE_API_URL}/auth/deleteuser`, {
      method: 'DELETE',
      ...constants.FETCH_OPTIONS,
      body: JSON.stringify({ email: user.email })
    })
      .then(res => res.json())
      .then(data => {
        const { hasError, message } = handleResponseErrors(data)
        if (hasError) {
          toast(message)
          return
        }
        handleDeleteUser()
        toast('Cuenta eliminada con éxito')
        setTimeout(() => {
          setUser(null)
        }, 2000)
      })
  }
  return (
    <div className={`${styles.preferences}`} id="preferences">
      <button id="closeAccount" onClick={() => setVisible(true)}>
        Cerrar Cuenta
      </button>
      {
        visible
          ? (
            <div className='deskForm'>
              <p>Seguro que quieres cerrar tu cuenta? Esto borrará todos tus datos</p>
              <p>Esta operación no se puede deshacer</p>
              <div className='button_group'>
                <button id="confirm" onClick={handleDeleteAccount}>Confirmar</button>
                <button id="cancel" onClick={() => setVisible(false)}>Cancelar</button>
              </div>
            </div>
            )
          : null
      }
    </div>
  )
}
export function UserSecurity () {
  const user = useSessionStore(state => state.user)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const handleChangePassword = (e) => {
    e.preventDefault()
    setPasswordVisible(true)
  }
  const handleChangePasswordSubmit = (e) => {
    e.preventDefault()
    console.log(e.target)
    const form = new FormData(e.target)
    const data = Object.fromEntries(form)
    console.log(data)
    // Tiene que ser en firebase
  }
  const handleCreateBackup = (e) => {
    fetch(`${constants.BASE_API_URL}/storage/backup`, {
      method: 'POST',
      ...constants.FETCH_OPTIONS
    })
      .then(res => res.json())
      .then(data => {
        const { hasError, message } = handleResponseErrors(data)
        if (hasError) {
          toast(message)
          return
        }
        toast('Copia creada con éxito')
      })
  }
  const handleDownloadBackup = (e) => {
    window.open(`${user.lastBackupUrl}`)
  }
  const handleUploadBackup = (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('backup', file)
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
          toast(message)
          return
        }
        toast('Copia subida con éxito')
      })
  }
  return (
    <>
      <div className={styles.password}>
        <h3>Seguridad </h3>
        <KeyIcon />
        <p>Cambiar contraseña</p>
        <form onSubmit={handleChangePassword} className={styles.flexForm}>
          <input type="password" disabled={true} value="password"/>
          <button id="changePassword">Cambiar</button>
        </form>
        {
          passwordVisible
            ? (
              <form onSubmit={handleChangePasswordSubmit} className={styles.changePasswordDialog}>
                <p>Introduzca su antigua contraseña</p>
                <input type="password" id="oldPassword" name='oldPassword'/>
                <p>Introduzca la nueva contraseña</p>
                <input type="password" id="newPassword" name='newPassword'/>
                <div className={styles.flexButtons}>
                  <button id="changePasswordSubmit" type='submit'>Enviar</button>
                  <button id="changePasswordCancel" onClick={() => setPasswordVisible(false)}>Cancelar</button>
                </div>
            </form>
              )
            : null
        }
      </div>
      <div className={styles.backup}>
        <h3>Copia de seguridad de tus datos</h3>
        <div className={styles.backupControls}>
          <button id="backup" onClick={handleCreateBackup}>Crear Copia </button>
          <button id="download" onClick={handleDownloadBackup}>Descargar</button>
        </div>
        <p id="errorMessage"> </p>
        <p id="successMessage"></p>
        <form onChange={handleUploadBackup}>
          <p>Restaurar Copia</p>
          <button className={styles.upFile}>
            <label htmlFor="upFile">
              <UploadIcon />
              Subir Archivo
            </label>
            <input id="upFile" className={styles.upFileInput} type="file" name="upFile"/>
          </button>
          <p id="errorUpMessage"> </p>
          <p id="successUpMessage"></p>
        </form>
      </div>
    </>
  )
}
export function PieChart ({ links, setLinks }) {
  const [brokenLinks, setBrokenLinks] = useState([])
  const chartRef = useRef()
  const chartFillRef = useRef()
  const chartPercentRef = useRef()

  useEffect(() => {
    const createChart = async () => {
      // const counter = document.getElementById('counter')
      const $ppc = chartRef.current
      const $fill = chartFillRef.current
      const result = chartPercentRef.current

      // counter.innerHTML = 'Broken Links:' // -> estado?
      if ($ppc) {
        // Reseteamos el circulo
        if ($ppc?.classList.contains(`${styles.gt50}}`)) {
          $ppc.classList.remove(`${styles.gt50}}`)
        }
        $ppc.dataset.percent = 0
        $fill.style.transform = 'rotate(0deg)'
        result.innerHTML = 0 + '%'

        const newLinks = [...links].slice(0, 150)

        const porcentajePorPaso = 100 / newLinks.length
        let count = 0
        const downLinks = await Promise.all(newLinks.map(async (link) => {
          const response = await fetch(`${constants.BASE_API_URL}/links/status?url=${link.URL}`, {
            method: 'GET',
            ...constants.FETCH_OPTIONS
          })
          const data = await response.json()
          if (data.status !== 'success') {
            count += porcentajePorPaso
            return { data, link }
          }
          count += porcentajePorPaso
          $ppc.dataset.percent = count
          progressCircle()
          return null
        }))

        const filteredLinks = downLinks.filter(link => link !== null)
        setBrokenLinks(filteredLinks)
        // counter.innerHTML = `Broken Links: ${filteredLinks.length}`
        setLinks([])
      }
    }
    createChart()
  }, [links])

  function progressCircle () {
    const result = chartPercentRef.current
    const $ppc = chartRef.current
    const $fill = chartFillRef.current
    const percent = parseInt($ppc.dataset.percent)
    const deg = 360 * percent / 100

    if (percent > 50) {
      $ppc.classList.add(`${styles.gt50}}`)
    }
    $fill.style.transform = `rotate(${deg}deg)`
    result.innerHTML = percent + '%'
  }
  return (
    <>
    {
    links.length > 0
      ? (
      <div ref={chartRef} className={styles.progressPieChart} data-percent="0">
        <div className={styles.ppcProgress}>
          <div ref={chartFillRef} className={styles.ppcProgressFill}></div>
        </div>
        <div className={styles.ppcPercents}>
          <div className={styles.pccPercentsWrapper}>
            <span ref={chartPercentRef}>0%</span>
          </div>
        </div>
      </div>)
      : null
      }
      {
        brokenLinks.length > 0 && (<div className={styles.resultsHeader}>
                        <p id="counter"><span className={styles.bold}>Links Caídos:</span> {brokenLinks.length}</p>
                        <button onClick={() => setBrokenLinks([])}><CloseIcon/></button>
                        </div>)
      }
      <div id="brokenLinksResult" className={styles.brokenLinksResult}>
        {
          brokenLinks && brokenLinks.map(link => {
            return (
              <div key={link.link._id} className={styles.link}>
                <a target="_blank" href={link.link.URL} rel="noreferrer">
                  <img src={link.link.imgURL}/>{link.link.name}
                </a>
                <p><span className={styles.bold}>Escritorio:</span> {link.link.escritorio}</p>
                <p><span className={styles.bold}>Panel:</span> {link.link.panel}</p>
                <p><span className={styles.bold}>url:</span> {link.link.URL}</p>
              </div>
            )
          })
        }
      </div>
      </>
  )
}
export function UserStats () {
  const [duplicates, setDuplicates] = useState([])
  const [links, setLinks] = useState([])
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const globalColumns = useGlobalStore(state => state.globalColumns)
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)

  const handleFindDuplicates = async (e) => {
    const response = await findDuplicateLinks()
    setDuplicates(response)
  }
  const handleFindBrokenLinks = async (e) => {
    const response = await getAllLinks()
    const { hasError, message } = handleResponseErrors(response)
    if (hasError) {
      toast(message)
      return
    }
    const { links } = response
    setLinks(links)
  }

  return (
        <>
          <header className={styles.infoHeader}>
            <p>Estadísticas</p>
          </header>
          <div className={styles.statsInfo}>
            <table>
              <tbody>
                <tr>
                  <th>Escritorios</th>
                  <th>Paneles</th>
                  <th>Links</th>
                </tr>
                <tr>
                  <td>{desktopsStore.length}</td>
                  <td>{globalColumns.length}</td>
                  <td>{globalLinks.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.statsControls}>
            <div className={styles.groupControl}>
              <h3>Encontrar Duplicados</h3>
              <button id="duplicates" onClick={handleFindDuplicates}>
                <DuplicatesIcon />
                Buscar
              </button>
            </div>
            <div className={styles.groupControl}>
              <h3>Encontrar Links Caidos</h3>
              <button id="brokenLinks" onClick={handleFindBrokenLinks}>
                <BrokenLinksIcon />
                Buscar
              </button>
            </div>
          </div>
          <div className={styles.results}>
            {
              duplicates.length > 0 && (
                <div className={styles.resultsHeader}>
                  <p id="counter"><span className={styles.bold}>Duplicados: </span>{duplicates.length}</p><button onClick={() => setDuplicates([])}><CloseIcon/></button>
                </div>
              )
            }

            <PieChart links={links} setLinks={setLinks}/>
          <div className={styles.duplicatesResult}>
            {
              duplicates && duplicates.map((duplicate) => {
                return (
                  <>
                    <div key={duplicate._id} className={styles.link}>
                      <a target="_blank" href={duplicate.URL} rel="noreferrer">
                        <img src={duplicate.imgURL}/>{duplicate.name}
                      </a>
                      <p><span className={styles.bold}>Escritorio:</span> {duplicate.escritorio}</p>
                      <p><span className={styles.bold}>Panel:</span> {duplicate.panel}</p>
                      <p><span className={styles.bold}>url:</span> {duplicate.URL}</p>
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
export function UserInfo () {
  const user = useSessionStore(state => state.user)
  const setUser = useSessionStore(state => state.setUser)
  const [fileToUpload, setFileToUpload] = useState()
  const [fileToUploadLoading, setFileToUploadLoading] = useState(false)
  console.log(user)

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)
    console.log(data)
    const response = await editUserAditionalInfo({ email: user.email, fields: { ...data } })
    console.log(response)
    const newUserState = { ...response.data }
    setUser(newUserState)
  }
  const handleUploadImageInputChange = async (e) => {
    const file = e.target.files[0]
    const previewImage = document.getElementById('preview-image')
    const imageUrl = URL.createObjectURL(file)
    previewImage.src = imageUrl
    setFileToUpload(file)
  }
  const handleUploadImage = async (e) => {
    setFileToUploadLoading(true)
    const response = await uploadProfileImg(fileToUpload)
    if (response.startsWith('https')) {
      setFileToUpload(null)
      setFileToUploadLoading(false)
      toast('Imagen cambiada con éxito')
      // actualizar estado global
      const newUserState = { ...user, profileImage: response }
      setUser(newUserState)
    } else {
      setFileToUploadLoading(false)
      toast('Error al cambiar la imagen')
    }
  }
  const handleCancelUploadImage = (e) => {
    const previewImage = document.getElementById('preview-image')
    previewImage.src = user.profileImage
    setFileToUpload(null)
  }
  return (
    <div className={styles.info}>
      <div className={styles.wrapper}>
        <header className={styles.infoHeader}>
          <p>{user.name} <span className={styles.about}>{user.aboutMe ? user.aboutMe : ''}</span></p>
          <p>{user.email}</p>
        </header>
        <p className={styles.dateJoin}><span>Miembro desde: </span>{formatDate(user.createdAt)}</p>
        <div className={styles.aditionalInfo}>
          <div className={styles.profileImage}>
            <img id="preview-image" src={user.profileImage ? user.profileImage : '/img/avatar.svg'}/>
            {
              !fileToUploadLoading && (
                <button className={styles.upFile}>
                  <label htmlFor="image-input">
                    <AddImageIcon />
                    Subir Imagen
                  </label>
                  <input className={styles.imageInput} type="file" accept="image/*" name="image-input" onChange={handleUploadImageInputChange}/>
                </button>
              )
            }
            {
              fileToUpload && !fileToUploadLoading && (<div><button className={styles.upFile} onClick={handleUploadImage}>Guardar</button>
              <button className={styles.upFile} onClick={handleCancelUploadImage}>Cancelar</button></div>)
            }
            {
              fileToUploadLoading && (<span className={styles.loader}></span>)
            }
          </div>
          <div className={styles.uploadImageTooltip}>
            <p>Sube tu imagen de perfil</p>
            <p>Tamaño recomendado 125x125</p>
            <p>Max. 15MB</p>
          </div>
        </div>
      </div>
        <div className={styles.userInfo}>
          <div className={styles.otherInfo}>
            <form id="otherInfoForm" onSubmit={handlePersonalInfoSubmit}>
              <label htmlFor="realName">Nombre Completo: </label>
              <input type="text" name="realName" defaultValue={user.realName || ''} placeholder='John Doe'/>
              <label htmlFor="website">Sitio Web:</label>
              <input type="text" name="website" defaultValue={user.website || ''} placeholder='www.mywebsite.com'/>
              <label htmlFor="aboutMe">Sobre mí:</label>
              <textarea name="aboutMe" cols="30" rows="10" defaultValue={user.aboutMe || ''} placeholder='My favorite things to do'/>
              <button id="editOtherInfo" type="submit">Guardar</button>
            </form>
          </div>

      </div>
    </div>
  )
}
export default function ProfilePage () {
  const infoRef = useRef()
  const statsRef = useRef()
  const secRef = useRef()
  const prefRef = useRef()
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
      <section className={styles.buttons}>
        <div className={styles.profileTitle}>
          <h2>Perfil de usuario</h2>
        </div>
        <button className={`${styles.tablinks} buttonlink`} id="infoTab" onClick={() => { openTab('info', 'infoTab') }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ color: '#3c9aed', paddingTop: '1px' }} className="uiIcon-button" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>
          Información
        </button>
        <button className={`${styles.tablinks} buttonlink`} id="statsTab" onClick={() => { openTab('stats', 'statsTab') }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(48 179 82)', paddingTop: '1px' }} className="uiIcon-button" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 3.2a9 9 0 1 0 10.8 10.8a1 1 0 0 0 -1 -1h-6.8a2 2 0 0 1 -2 -2v-7a.9 .9 0 0 0 -1 -.8" /><path d="M15 3.5a9 9 0 0 1 5.5 5.5h-4.5a1 1 0 0 1 -1 -1v-4.5" /></svg>
          Estadísticas
        </button>
        <button className={`${styles.tablinks} buttonlink`} id="securityTab" onClick={() => { openTab('security', 'securityTab') }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(184 111 48)', paddingTop: '1px' }} className="uiIcon-button" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" /><path d="M12 11m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 12l0 2.5" /></svg>
          Seguridad
        </button>
        <button className={`${styles.tablinks} buttonlink`} id="preferencesTab" onClick={() => { openTab('preferences', 'preferencesTab') }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(184 48 48)', paddingTop: '1px' }} className="uiIcon-button" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" /><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>
          Preferencias
        </button>
      </section>
      <section className={styles.content}>
        <div ref={infoRef} className={styles.tabcontent} id="info">
          <UserInfo />
        </div>
        <div ref={statsRef} className={`${styles.statistics} ${styles.tabcontent}`} id="stats">
          <UserStats />
        </div>
        <div ref={secRef} className={styles.tabcontent} id="security">
          <UserSecurity />
        </div>
        <div ref={prefRef} className={styles.tabcontent} id="preferences">
          <UserPreferences />
        </div>
      </section>
    </main>
  )
}
