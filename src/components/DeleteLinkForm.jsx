import { useEffect, useRef } from 'react'
import styles from './DeleteLinkForm.module.css'
// import { useNavStore } from '../store/session'
export default function DeleteLinkForm ({ deleteFormVisible, setDeleteFormVisible, params, idpanel, linkRef }) {
  const visibleClassName = deleteFormVisible ? styles.flex : styles.hidden
  const formRef = useRef()
  //   const setLinks = useNavStore(state => state.setLinks)
  //   const links = useNavStore(state => state.links)
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
        linkRef.current.remove()
        // eliminarElemento(params)
      })
      .catch(err => {
        console.log(err)
      })
  }
  //   const eliminarElemento = (params) => {
  //     const nuevosElementos = links.filter((link) => link._id !== params._id)
  //     setLinks(nuevosElementos)
  //   }
  return (
        <form ref={formRef} className={`deskForm ${visibleClassName}`} id="deleteLinkForm">
            <h2>Seguro que quieres borrar este Link?</h2>
            <button onClick={handleClick} id="confDeletelinkSubmit" type="submit">Si</button>
            <button onClick={() => { setDeleteFormVisible(false) }}id="noDeletelinkSubmit" type="submit">No</button>
            <p id="deleteLinkError"></p>
        </form>
  )
}
