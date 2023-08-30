import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../config/firebaseConfig'
import { useNavigate } from 'react-router-dom'
import { useSessionStore } from '../store/session'

export default function useGoogleAuth () {
  initializeApp(firebaseConfig)
  const auth = getAuth()
  const provider = new GoogleAuthProvider()
  const navigate = useNavigate()
  const user = useSessionStore(state => state.user)
  const setUser = useSessionStore(state => state.setUser)

  const handleGoogleLogin = () => {
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
        checkToken(googleUser.auth.currentUser.accessToken, googleUser.auth.currentUser.reloadUserInfo)
      // ...
      }).catch((error) => {
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
    document.cookie = 'reactToken='
    document.cookie = 'reactUser='
    document.cookie = 'authMethod='
    setUser(null)
    auth.signOut()
    return navigate('/')
  }
  const checkToken = async (token, userInfo) => {
    const body = { method: 'google', data: { idToken: token, userInfo } }
    fetch('http://localhost:3003/session', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        setUser(userInfo.displayName)
        console.log(data)
        console.log(user)
        document.cookie = `reactToken=${token}`
        document.cookie = `reactUser=${userInfo.displayName}`
        document.cookie = 'authMethod=google'
        navigate('/desktop/inicio')
      })
      .catch(error => {
        console.log(error)
      })
  }
  return { handleGoogleLogin, handleGoogleLogOut }
}
