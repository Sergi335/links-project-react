import { initializeApp } from 'firebase/app'
import { EmailAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, deleteUser, getAuth, reauthenticateWithCredential, reauthenticateWithPopup, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updatePassword } from 'firebase/auth'
import { redirect, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { firebaseConfig } from '../config/firebaseConfig'
import { constants } from '../services/constants'
import { useGlobalStore } from '../store/global'
import { useSessionStore } from '../store/session'

export default function useGoogleAuth () {
  initializeApp(firebaseConfig)
  const auth = getAuth()
  const navigate = useNavigate()
  const setUser = useSessionStore(state => state.setUser)
  const csrfToken = useSessionStore(state => state.csfrtoken)
  // const globalLoading = useGlobalStore(state => state.globalLoading)
  // const setGlobalLoading = useGlobalStore(state => state.setGlobalLoading)
  const setRegisterLoading = useGlobalStore(state => state.setRegisterLoading)
  const setLoginLoading = useGlobalStore(state => state.setLoginLoading)

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
        } else {
          setUser(data.data)
        } // Estamos devolviendo el password!!!
      }) // Control de errores
  }
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then((result) => {
        setLoginLoading(true)
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result)
        // console.log(credential)
        // const token = credential.accessToken
        // console.log(token)
        // The signed-in user info.
        // console.log(credential)
        const googleUser = result.user
        // console.log(googleUser)
        // console.log('🚀 ~ .then ~ csrfToken:', csrfToken)
        // setUser(googleUser.displayName)
        // checkToken(googleUser.auth.currentUser.accessToken, googleUser.auth.currentUser.reloadUserInfo)
        return postIdTokenToSessionLogin({ url: `${constants.BASE_API_URL}/auth/googlelogin`, idToken: googleUser.auth.currentUser.accessToken, csrfToken, uid: googleUser.uid, email: googleUser.email })
      // ...
      })
      .then(() => {
        // console.log('redirect')
        // navigate('/desktop/inicio')
        fetch(`${constants.BASE_API_URL}/desktops`, {
          method: 'GET',
          credentials: 'include',
          ...constants.FETCH_OPTIONS
        })
          .then(res => res.json())
          .then(desks => {
            const { data } = desks
            const firstDesktop = data[0]?.name || 'start'
            // navigate(`/desktop/${firstDesktop}`)
            setLoginLoading(false)
            // window.location.href = `/desktop/${firstDesktop}` // --> si esto te redirige el login ha sido correcto en Firebase
            redirect(`/desktop/${firstDesktop}`)
          })
      })
      .catch((error) => {
      // Handle Errors here.
        const errorCode = error.code
        console.log(errorCode)
        const errorMessage = error.message
        console.log(errorMessage)
        // The email of the user's account used.
        const email = error.customData.email
        console.log(email)
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error)
        console.log(credential)
      // ...
      })
  }
  const handleGoogleLogOut = () => {
    getAuth().currentUser.getIdToken(/* forceRefresh */ true).then(async function (idToken) {
      // const csrfToken = getCookie('csrfToken')
      const body = { idToken, csrfToken }
      return fetch(`${constants.BASE_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        ...constants.FETCH_OPTIONS,
        body: JSON.stringify(body)
      })
        .then(res => {
          res.json()
          console.log(res)
        })
        .then(data => {
          console.log(data)
        })
        .then(() => {
          setUser(null)
          auth.signOut()
          return navigate('/')
        })
        .then(() => {
          // Sign-out successful.
          console.log('logout client')
        })
    }).catch((error) => {
      // An error happened.
      setUser(null)
      console.log(error)
    })
  }
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
          window.location.href = `/desktop/${firstDesktop}` // --> si esto te redirige el login ha sido correcto en Firebase
        })
    })
      .catch((e) => {
        console.log(e)
        // Ver los tipos de errores en la documentación
        toast.error('Usuario o contraseña incorrectos')
      })
  }
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
              redirect('/desktop/start')
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
  const handleDeleteUser = () => {
    const user = auth.currentUser
    return deleteUser(user).then(() => {
      return 'Usuario eliminado'
    }).catch((error) => {
      console.log(error)
      return ({ error: error.message, code: error.code })
    })
  }
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
