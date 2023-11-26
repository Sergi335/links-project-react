import { useEffect, useRef } from 'react'
import { useLinksStore } from '../store/links'
import { useParams } from 'react-router-dom'
import { usePreferencesStore } from '../store/preferences'
import styles from './DeleteLinkForm.module.css'

export default function DeleteLinkForm ({ deleteFormVisible, setDeleteFormVisible, params }) {
  const setLinksStore = useLinksStore(state => state.setLinksStore)
  const linksStore = useLinksStore(state => state.linksStore)
  const { desktopName } = useParams()
  const visibleClassName = deleteFormVisible ? styles.flex : styles.hidden
  const formRef = useRef()
  const activeLocalStorage = usePreferencesStore(state => state.activeLocalStorage)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target !== formRef.current && event.target.nodeName !== 'SPAN' && !formRef.current.contains(event.target)) {
        setDeleteFormVisible(false)
      }
    }
    window.addEventListener('click', handleClickOutside)
    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])
  const handleClick = (event) => {
    event.preventDefault()
    const body = {
      linkId: params._id,
      idpanel: params.idpanel
    }
    fetch('http://localhost:3003/api/links', {
      method: 'DELETE',
      headers: {
        'Content-type': 'Application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        setDeleteFormVisible(false)
        const newList = [...linksStore].filter(link => link._id !== params._id)
        setLinksStore(newList)
        activeLocalStorage ?? localStorage.setItem(`${desktopName}links`, JSON.stringify(newList.toSorted((a, b) => (a.orden - b.orden))))
      })
      .catch(err => {
        console.log(err)
      })
  }
  return (
      <form ref={formRef} className={`deskForm ${visibleClassName}`} id="deleteLinkForm">
        <h2>Seguro que quieres borrar este Link?</h2>
        <button onClick={handleClick} id="confDeletelinkSubmit" type="submit">Si</button>
        <button onClick={() => { setDeleteFormVisible(false) }}id="noDeletelinkSubmit" type="submit">No</button>
        <p id="deleteLinkError"></p>
      </form>
  )
}
