import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, deleteUser } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../config/firebaseConfig'
import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '../store/session'
import { constants } from '../services/constants'

export default function useGoogleAuth () {
  initializeApp(firebaseConfig)
  const auth = getAuth()
  const navigate = useNavigate()
  const setUser = useSessionStore(state => state.setUser)

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
  const getCookie = (name) => {
    const value = '; ' + document.cookie
    const parts = value.split('; ' + name + '=')
    if (parts.length === 2) return parts.pop().split(';').shift()
  }
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result)
        // console.log(credential)
        // const token = credential.accessToken
        // console.log(token)
        // The signed-in user info.
        // console.log(credential)
        const googleUser = result.user
        console.log(googleUser)
        const csrfToken = getCookie('csrfToken')
        // setUser(googleUser.displayName)
        // checkToken(googleUser.auth.currentUser.accessToken, googleUser.auth.currentUser.reloadUserInfo)
        return postIdTokenToSessionLogin({ url: `${constants.BASE_API_URL}/auth/googlelogin`, idToken: googleUser.auth.currentUser.accessToken, csrfToken, uid: googleUser.uid, email: googleUser.email })
      // ...
      })
      .then(() => {
        console.log('redirect')
        navigate('/desktop/inicio')
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
      const csrfToken = getCookie('csrfToken')
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
        const csrfToken = getCookie('csrfToken')
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
        // error.innerHTML = e.message
      })
  }
  const handleRegisterWithMail = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = form.get('email')
    const password = form.get('password')
    const nickname = form.get('name')

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        // console.log(user)
        getAuth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
          // Send token to your backend via HTTPS
          // ...
          // console.log(idToken)
          const csrfToken = getCookie('csrfToken')
          return postIdTokenToSessionLogin({ url: `${constants.BASE_API_URL}/auth/register`, idToken, csrfToken, uid: user.uid, nickname }
          )
            .then(data => {
              console.log(data)
              // navigate('/desktop/start')
              window.location.href = '/desktop/start'
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
    deleteUser(user).then(() => {
      return 'Usuario eliminado'
    }).catch((error) => {
      console.log(error)
    })
  }
  return { handleGoogleLogin, handleGoogleLogOut, handleLoginWithMail, handleRegisterWithMail, handleDeleteUser }
}
