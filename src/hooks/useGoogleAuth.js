import { initializeApp } from 'firebase/app'
import { EmailAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, deleteUser, getAuth, reauthenticateWithCredential, reauthenticateWithPopup, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updatePassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { firebaseConfig } from '../config/firebaseConfig'
import { apiFetch } from '../services/api'
import { constants } from '../services/constants'
import { sendLogoutSignal } from '../services/dbQueries'
import { useGlobalStore } from '../store/global'
import { useSessionStore } from '../store/session'

export default function useGoogleAuth () {
  initializeApp(firebaseConfig)
  const auth = getAuth()
  const setUser = useSessionStore(state => state.setUser)
  const csrfToken = useSessionStore(state => state.csfrtoken)
  const setCsfrtoken = useSessionStore(state => state.setCsfrtoken)
  const setRegisterLoading = useGlobalStore(state => state.setRegisterLoading)
  const setLoginLoading = useGlobalStore(state => state.setLoginLoading)
  const fetchCsrfToken = useSessionStore(state => state.fetchCsrfToken)
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH
  const navigate = useNavigate()

  const postIdTokenToSessionLogin = function ({ url, idToken, csrfToken, uid, nickname, email }) {
    // POST to session login endpoint.
    return apiFetch(url, {
      method: 'POST',
      credentials: 'include',
      ...constants.FETCH_OPTIONS,
      body: JSON.stringify({ idToken, csrfToken, uid, nickname, email })
    })
      .then(async (data) => {
        // Guardar usuario si existe
        if (data._id) {
          setUser(data)
        }
        // Esperar a que la cookie de sesión esté disponible y pedir el nuevo token CSRF
        try {
          const result = await apiFetch(`${constants.BASE_API_URL}/csrf-token`, {
            method: 'GET',
            credentials: 'include'
          })
          if (result.csrfToken) {
            setCsfrtoken(result.csrfToken)
            localStorage.setItem('csrfToken', JSON.stringify(result.csrfToken))
          }
        } catch (e) {
          console.error('Error sincronizando CSRF tras login:', e)
        }
      })
      .catch((error) => {
        toast.error('Error al iniciar sesión, servidor no disponible en estos momentos', { toastId: 'login-error' })
        console.error('Error in postIdTokenToSessionLogin:', error)
      }) // Control de errores
  }

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({
      prompt: 'select_account'
    })
    signInWithPopup(auth, provider)
      .then(async (result) => {
        setLoginLoading(true)
        // This gives you a Google Access Token. You can use it to access the Google API.
        // console.log(result)
        const googleUser = result.user
        const idToken = await googleUser.getIdToken()
        return postIdTokenToSessionLogin(
          {
            url: `${constants.BASE_API_URL}/auth/googlelogin`,
            idToken,
            csrfToken,
            uid: googleUser.uid,
            email: googleUser.email
          })
      })
      .then(() => {
        // Pedir todos es innecesario?
        apiFetch(`${constants.BASE_API_URL}/categories/toplevel`, {
          method: 'GET',
          credentials: 'include',
          ...constants.FETCH_OPTIONS
        })
          .then(desks => {
            const { data } = desks
            const firstDesktop = data.filter(desktop => desktop.order === 0)
            const firstDesktopSlug = firstDesktop[0]?.slug
            if (firstDesktopSlug) {
              setLoginLoading(false)
              navigate(`${rootPath}${basePath}/${firstDesktopSlug}`) // --> si esto te redirige el login ha sido correcto en Firebase
            } // else? --> no hay desktops
          })
      })
      .catch((error) => {
        setLoginLoading(false)
        const errorCode = error.code
        console.log(errorCode)
        const errorMessage = error.message
        console.log(errorMessage)
      })
  }

  const handleGoogleLogOut = async () => {
    if (getAuth().currentUser !== null && getAuth().currentUser !== undefined) {
      try {
        const idToken = await getAuth().currentUser.getIdToken(true)
        const res = await sendLogoutSignal({ idToken, csrfToken })
        await res.json()
        if (res.status === 200) {
          setUser(null)
          setCsfrtoken('')
          auth.signOut()
          await fetchCsrfToken()
          navigate('/')
        } else {
          toast.error('Error al cerrar sesión, inténtalo de nuevo más tarde', { toastId: 'logout-error' })
          setUser(null)
          setCsfrtoken('')
          auth.signOut()
          await fetchCsrfToken()
          navigate('/')
        }
      } catch (error) {
        setUser(null)
        setCsfrtoken('')
        console.log(error)
        await fetchCsrfToken()
        navigate('/')
      }
    } else {
      await fetchCsrfToken()
      navigate('/')
    }
  }
  // TODO
  const handleLoginWithMail = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    const form = new FormData(e.currentTarget)
    const email = form.get('email')
    const password = form.get('password')

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await user.getIdToken()

      await postIdTokenToSessionLogin({
        url: `${constants.BASE_API_URL}/auth/login`,
        idToken,
        csrfToken,
        uid: user.uid,
        email: user.email
      })

      const desks = await apiFetch(`${constants.BASE_API_URL}/categories/toplevel`, {
        method: 'GET',
        credentials: 'include',
        ...constants.FETCH_OPTIONS
      })

      const { data } = desks
      const firstDesktop = data.filter(desktop => desktop.order === 0)
      const firstDesktopSlug = firstDesktop[0]?.slug
      if (firstDesktopSlug) {
        setLoginLoading(false)
        navigate(`${rootPath}${basePath}/${firstDesktopSlug}`)
      }
    } catch (error) {
      console.error('Error en login:', error)
      setLoginLoading(false)
      toast.error('Usuario o contraseña incorrectos')
    }
  }
  // TODO
  const handleRegisterWithMail = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = form.get('email')
    const password = form.get('password')
    const nickname = form.get('name')
    setRegisterLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const idToken = await user.getIdToken(true)

      await postIdTokenToSessionLogin({
        url: `${constants.BASE_API_URL}/auth/register`,
        idToken,
        csrfToken,
        uid: user.uid,
        nickname,
        email: user.email
      })

      setRegisterLoading(false)
    } catch (error) {
      console.error('Error en registro:', error)
      setRegisterLoading(false)
      const errorMessage = error.message || 'Error desconocido'
      toast.error('Error al registrar usuario: ' + errorMessage)
    }
  }
  // TODO
  const handleDeleteUser = () => {
    const user = auth.currentUser
    return deleteUser(user).then(() => {
      return 'Usuario eliminado'
    }).catch((error) => {
      // console.log(error)
      return ({ error: error.message, code: error.code })
    })
  }
  // TODO
  const handleResetPasswordWithEmail = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { status: 'success' }
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message
      // console.log(errorCode, errorMessage)
      return { status: 'error', error: { code: errorCode, message: errorMessage } }
    }
  }
  // TODO
  const handleChangeFirebasePassword = async (newPassword) => {
    const user = auth.currentUser
    try {
      await updatePassword(user, newPassword)
      return { status: 'success' }
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message
      // console.log(errorCode, errorMessage)
      return { status: 'error', error: { code: errorCode, message: errorMessage } }
    }
  }
  // TODO
  const handleReauthenticate = async (password) => {
    const user = auth.currentUser
    // console.log(user.providerData)

    // TODO(you): prompt the user to re-provide their sign-in credentials
    const credential = EmailAuthProvider.credential(
      user.email,
      password
    )

    return reauthenticateWithCredential(user, credential)
      .then(() => {
        return { status: 'success' }
      }).catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        // console.log(errorCode, errorMessage)
        return { status: 'error', error: { code: errorCode, message: errorMessage } }
      })
  }
  // TODO
  const handleReauthenticateWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const user = auth.currentUser
    return reauthenticateWithPopup(user, provider)
      .then(() => {
        return { status: 'success' }
      }).catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        // console.log(errorCode, errorMessage)
        return { status: 'error', error: { code: errorCode, message: errorMessage } }
      })
  }
  return { handleGoogleLogin, handleGoogleLogOut, handleLoginWithMail, handleRegisterWithMail, handleDeleteUser, handleResetPasswordWithEmail, handleChangeFirebasePassword, handleReauthenticate, handleReauthenticateWithGoogle }
}
