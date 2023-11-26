import styles from './ProfilePage.module.css'
import { useSessionStore } from '../../store/session'
import { AddImageIcon, BrokenLinksIcon, CloseIcon, DuplicatesIcon, KeyIcon, UploadIcon } from '../Icons/icons'
import { formatDate } from '../../services/functions'
import { useEffect, useRef, useState } from 'react'
import { uploadProfileImg, editUserAditionalInfo, findDuplicates, getAllLinks } from '../../services/dbQueries'
import { toast } from 'react-toastify'
import { constants } from '../../services/constants'

export function UserPreferences () {
  return (
    <div className={`${styles.tabcontentRow} ${styles.preferences}`} id="preferences">
      <button id="closeAccount">
        Cerrar Cuenta
      </button>
      <div className={styles.profileDeleteConfirm}>
        <p>Seguro que quieres eliminar tu perfil? Esto borrará todos tus datos</p>
        <p>Esta operación no se puede deshacer</p>
        <button id="confirm">Confirmar </button>
        <button id="cancel">Cancelar</button>
      </div>
    </div>
  )
}
export function UserSecurity () {
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
  }
  return (
    <>
      <div className={styles.password}>
        <h3>Seguridad </h3>
        <KeyIcon />
        <p>Cambiar contraseña</p>
        <form onSubmit={handleChangePassword} className={styles.flexForm}>
          <input type="password" disabled="true" value="password"/>
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
          <button id="backup">Crear Copia </button>
          <button id="download">Descargar</button>
        </div>
        <p id="errorMessage"> </p>
        <p id="successMessage"></p>
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

      // Reseteamos el circulo
      if ($ppc.classList.contains('gt50')) {
        $ppc.classList.remove('gt50')
      }
      $ppc.dataset.percent = 0
      $fill.style.transform = 'rotate(0deg)'
      result.innerHTML = 0 + '%'

      const newLinks = [...links].slice(0, 150)

      const porcentajePorPaso = 100 / newLinks.length
      let count = 0
      const downLinks = await Promise.all(newLinks.map(async (link) => {
        const response = await fetch(`${constants.BASE_API_URL}/linkStatus?url=${link.URL}`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          }
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
    createChart()
  }, [links])

  function progressCircle () {
    const result = chartPercentRef.current
    const $ppc = chartRef.current
    const $fill = chartFillRef.current
    const percent = parseInt($ppc.dataset.percent)
    const deg = 360 * percent / 100

    if (percent > 50) {
      $ppc.classList.add('gt50')
    }
    $fill.style.transform = `rotate(${deg}deg)`
    result.innerHTML = percent + '%'
  }
  return (
    <>
    {
    links.length > 0
      ? (
      <div ref={chartRef} className="progressPieChart" data-percent="0">
        <div className="ppcProgress">
          <div ref={chartFillRef} className="ppcProgressFill"></div>
        </div>
        <div className="ppcPercents">
          <div className="pccPercentsWrapper">
            <span ref={chartPercentRef}>0%</span>
          </div>
        </div>
      </div>)
      : null
      }
      {
        brokenLinks.length > 0 && (<div className={styles.resultsHeader}>
                        <p id="counter">Links Caídos: {brokenLinks.length}</p>
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
                <p>Escritorio: {link.link.escritorio}</p>
                <p>Panel: {link.link.panel}</p>
                <p>url: {link.link.URL}</p>
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

  const handleFindDuplicates = async (e) => {
    const response = await findDuplicates()
    setDuplicates(response)
  }
  const handleFindBrokenLinks = async (e) => {
    const response = await getAllLinks()
    if (Array.isArray(response)) {
      setLinks(response)
    } else {
      toast('Error al obtener los links')
    }
  }

  return (
        <>
          <div className="statsInfo">
            <h2>Estadísticas</h2>
            <p>Escritorios: 15</p>
            <p>Paneles: 116</p>
            <p>Links: 1298</p>
          </div>
          <div className="statsControls">
            <div className="groupControl">
              <h3>Encontrar Duplicados</h3>
              <button id="duplicates" onClick={handleFindDuplicates}>
                <DuplicatesIcon />
                Buscar
              </button>
            </div>
            <div className="groupControl">
              <h3>Encontrar Links Caidos</h3>
              <button id="brokenLinks" onClick={handleFindBrokenLinks}>
                <BrokenLinksIcon />
                Buscar
              </button>
            </div>
          </div>
          <div className="results">
            {
              duplicates.length > 0 && (
                <div className={styles.resultsHeader}>
                  <p id="counter">Duplicados: {duplicates.length}</p><button onClick={() => setDuplicates([])}><CloseIcon/></button>
                </div>
              )
            }

            <PieChart links={links} setLinks={setLinks}/>
          </div>

          <div className={styles.duplicatesResult}>
            {
              duplicates && duplicates.map((duplicate) => {
                return (
                  <>
                    <div key={duplicate._id} className={styles.link}>
                      <a target="_blank" href={duplicate.URL} rel="noreferrer">
                        <img src={duplicate.imgURL}/>{duplicate.name}
                      </a>
                      <p>Escritorio: {duplicate.escritorio}</p>
                      <p>Panel: {duplicate.panel}</p>
                      <p>url: {duplicate.URL}</p>
                    </div>
                  </>
                )
              })
            }
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

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)
    console.log(data)
    const response = editUserAditionalInfo(data)
    console.log(response)
    const newUserState = { ...user, ...data }
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
    <div className={styles.info}><h2>Información</h2>
      <div className={styles.wrapper}>
        <div className={styles.aditionalInfo}>
          <div className={styles.profileImage}>
            <img id="preview-image" src={user.profileImage} onError={(e) => { e.target.onerror = null; e.target.src = '/img/avatar.svg' }}/>
            <button className={styles.upFile}>
              <label htmlFor="image-input">
                <AddImageIcon />
                Subir Imagen
              </label>
              <input className={styles.imageInput} type="file" accept="image/*" name="image-input" onChange={handleUploadImageInputChange}/>
            </button>
            {
              fileToUpload && (<div><button className={styles.upFile} onClick={handleUploadImage}>Guardar</button>
              <button className={styles.upFile} onClick={handleCancelUploadImage}>Cancelar</button></div>)
            }
            {
              fileToUploadLoading && (<div className={styles.loading}><div className={styles.spinner}>Cargando ...</div></div>)
            }
          </div>
          <div className={styles.otherInfo}>
            <form id="otherInfoForm" onSubmit={handlePersonalInfoSubmit}>
              <label htmlFor="realName">Nombre: </label>
              <input type="text" name="realName" defaultValue={user.realName}/>
              <label htmlFor="website">Sitio Web:</label>
              <input type="text" name="website" defaultValue={user.website || ''} placeholder='www.mywebsite.com'/>
              <label htmlFor="aboutMe">Sobre mí:</label>
              <textarea name="aboutMe" cols="30" rows="10" defaultValue={user.aboutMe || ''}/>
              <button id="editOtherInfo" type="submit">Guardar</button>
            </form>
          </div>
        </div>
        <div className={styles.userInfo}>
          <p>{user.name || 'SergioSR'}</p>
          <p>{user.email}</p>
          <p><span>Miembro desde: </span>{formatDate(user.createdAt)}</p>
        </div>
      </div>
    </div>
  )
}
export default function ProfilePage () {
  return (
    <>
        <div className={styles.profileTitle}>
          <h2>Perfil de usuario</h2>
        </div>
        <div className={styles.tabcontent} id="info">
          <UserInfo />
          <div className={styles.statistics}>
          <UserStats />
          </div>
        </div>
        <div className={styles.tabcontentRow} id="security">
          <UserSecurity />
        </div>
        <div className={styles.tabcontent} id="info">
          <UserPreferences />
        </div>
    </>
  )
}
