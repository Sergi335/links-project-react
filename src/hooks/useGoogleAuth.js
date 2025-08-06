import { initializeApp } from 'firebase/app'
import { EmailAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, deleteUser, getAuth, reauthenticateWithCredential, reauthenticateWithPopup, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updatePassword } from 'firebase/auth'
import { toast } from 'react-toastify'
import { firebaseConfig } from '../config/firebaseConfig'
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
  const rootPath = import.meta.env.VITE_ROOT_PATH
  const basePath = import.meta.env.VITE_BASE_PATH

  const postIdTokenToSessionLogin = function ({ url, idToken, csrfToken, uid, nickname, email }) {
    // POST to session login endpoint.
    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      ...constants.FETCH_OPTIONS,
      body: JSON.stringify({ idToken, csrfToken, uid, nickname, email })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data._id) {
          setUser(data)
        }
      })
      .catch((error) => {
        toast.error('Error al iniciar sesión, servidor no disponible en estos momentos', { toastId: 'login-error' })
        console.error('Error in postIdTokenToSessionLogin:', error)
        setLoginLoading(false)
      }) // Control de errores
  }

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then((result) => {
        setLoginLoading(true)
        // This gives you a Google Access Token. You can use it to access the Google API.
        console.log(result)
        const googleUser = result.user
        return postIdTokenToSessionLogin({ url: `${constants.BASE_API_URL}/auth/googlelogin`, idToken: googleUser.auth.currentUser.accessToken, csrfToken, uid: googleUser.uid, email: googleUser.email })
      })
      .then(() => {
        // Pedir todos es innecesario?
        fetch(`${constants.BASE_API_URL}/categories/toplevel`, {
          method: 'GET',
          credentials: 'include',
          ...constants.FETCH_OPTIONS
        })
          .then(res => res.json())
          .then(desks => {
            const { data } = desks
            const firstDesktop = data.filter(desktop => desktop.order === 0)
            const firstDesktopSlug = firstDesktop[0]?.slug
            if (firstDesktopSlug) {
              setLoginLoading(false)
              window.location.href = `${rootPath}${basePath}/${firstDesktopSlug}` // --> si esto te redirige el login ha sido correcto en Firebase
            } // else? --> no hay desktops
          })
      })
      .catch((error) => {
        const errorCode = error.code
        console.log(errorCode)
        const errorMessage = error.message
        console.log(errorMessage)
      })
  }

  const handleGoogleLogOut = () => {
    if (getAuth().currentUser !== null && getAuth().currentUser !== undefined) {
      getAuth().currentUser.getIdToken(true)
        .then(async (idToken) => {
          sendLogoutSignal({ idToken, csrfToken })
            .then(res => {
              res.json()
              if (res.status === 200) {
                console.log(res)
                setUser(null)
                setCsfrtoken('')
                auth.signOut()
                window.location.href = '/'
              } // else?
            })
        }).catch((error) => {
          setUser(null)
          setCsfrtoken('')
          console.log(error)
          window.location.href = '/'
        })
    } else {
      window.location.href = '/'
    }
  }
  // TODO
  const handleLoginWithMail = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = form.get('email')
    const password = form.get('password')
    // As httpOnly cookies are to be used, do not persist any state client side.
    // setPersistence(auth, inMemoryPersistence)

    // When the user signs in with email and password.
    signInWithEmailAndPassword(auth, email, password).then(({ user }) => {
      // Get the user's ID token as it is needed to exchange for a session cookie.
      return user.getIdToken().then(idToken => {
        // Session login endpoint is queried and the session cookie is set.
        // CSRF protection should be taken into account.
        // const csrfToken = getCookie('csrfToken')
        return postIdTokenToSessionLogin({ url: `${constants.BASE_API_URL}/auth/login`, idToken, csrfToken, uid: user.uid, email: user.email })
      })
    }).then(() => {
      fetch(`${constants.BASE_API_URL}/desktops`, {
        method: 'GET',
        credentials: 'include',
        ...constants.FETCH_OPTIONS
      })
        .then(res => res.json())
        .then(desks => {
          const { data } = desks
          const firstDesktop = data[0].name
          // navigate(`/desktop/${firstDesktop}`)
          window.location.href = `${rootPath}${basePath}/${firstDesktop}` // --> si esto te redirige el login ha sido correcto en Firebase
        })
    })
      .catch((e) => {
        console.log(e)
        // Ver los tipos de errores en la documentación
        toast.error('Usuario o contraseña incorrectos')
      })
  }
  // TODO
  const handleRegisterWithMail = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = form.get('email')
    const password = form.get('password')
    const nickname = form.get('name')
    setRegisterLoading(true)

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        // console.log(user)
        getAuth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
          // Send token to your backend via HTTPS
          // ...
          // console.log(idToken)
          // const csrfToken = getCookie('csrfToken')
          return postIdTokenToSessionLogin({ url: `${constants.BASE_API_URL}/auth/register`, idToken, csrfToken, uid: user.uid, nickname }
          )
            .then(data => {
              console.log(data)
              setRegisterLoading(false)
              // redirect(`${rootPath}${basePath}/start`)
              // window.location.href = '/desktop/start' // -> esto esta mal? en realidad si por si cambia algun dia
            })
        }).catch(function (error) {
          // Handle error
          console.log(error)
        })
        // ...
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage)
        // ..
      })
  }
  // TODO
  const handleDeleteUser = () => {
    const user = auth.currentUser
    return deleteUser(user).then(() => {
      return 'Usuario eliminado'
    }).catch((error) => {
      console.log(error)
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
      console.log(errorCode, errorMessage)
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
      console.log(errorCode, errorMessage)
      return { status: 'error', error: { code: errorCode, message: errorMessage } }
    }
  }
  // TODO
  const handleReauthenticate = async (password) => {
    const user = auth.currentUser
    console.log(user.providerData)

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
        console.log(errorCode, errorMessage)
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
        console.log(errorCode, errorMessage)
        return { status: 'error', error: { code: errorCode, message: errorMessage } }
      })
  }
  return { handleGoogleLogin, handleGoogleLogOut, handleLoginWithMail, handleRegisterWithMail, handleDeleteUser, handleResetPasswordWithEmail, handleChangeFirebasePassword, handleReauthenticate, handleReauthenticateWithGoogle }
}
