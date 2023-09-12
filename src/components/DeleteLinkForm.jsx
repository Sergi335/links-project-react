import { useEffect, useRef } from 'react'
import styles from './DeleteLinkForm.module.css'
export default function DeleteLinkForm ({ deleteFormVisible, setDeleteFormVisible, params, idpanel, desktopLinks, setDesktopLinks }) {
  const visibleClassName = deleteFormVisible ? styles.flex : styles.hidden
  const formRef = useRef()
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target !== formRef.current && event.target.nodeName !== 'P' && !formRef.current.contains(event.target)) {
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
    console.log('handle click called')
    const body = {
      linkId: params._id,
      idpanel
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
        console.log(data)
        setDeleteFormVisible(false)
        const newList = desktopLinks.filter(link => link._id !== params._id)
        setDesktopLinks(newList)
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
