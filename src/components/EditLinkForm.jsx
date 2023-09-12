import { useRef, useEffect } from 'react'
import styles from './EditLinkForm.module.css'

export default function EditLinkForm ({ formVisible, setFormVisible, params, setName, setUrl }) {
  const visibleClassName = formVisible ? styles.flex : styles.hidden
  const formRef = useRef()
  const nameRef = useRef()
  const urlRef = useRef()
  const descRef = useRef()
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target !== formRef.current && event.target.nodeName !== 'P' && !formRef.current.contains(event.target)) {
        setFormVisible(false)
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
      id: params._id,
      fields: {
        name: nameRef.current.value,
        URL: urlRef.current.value,
        description: descRef.current.value
      }
    }
    fetch('http://localhost:3003/api/links', {
      method: 'PATCH',
      headers: {
        'Content-type': 'Application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setFormVisible(false)
        // changeNameUi(nameRef.current.value)
        setName(nameRef.current.value)
        setUrl(urlRef.current.value)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
        <form ref={formRef} className={`deskForm ${visibleClassName}`} id="editLinkForm">
            <h2>Edita Link</h2>
            <fieldset>
                <legend>Nombre y URL</legend>
                <label htmlFor="editLinkName">Nombre</label>
                <input ref={nameRef} id="editlinkName" type="text" name="editlinkName" maxLength="35" required="" defaultValue={params.name || ''} />
                <label htmlFor="editLinkURL">URL</label>
                <input ref={urlRef} id="editlinkURL" type="text" name="editlinkURL" defaultValue={params.URL || ''}/>
                <label htmlFor="editLinkDescription">Description</label>
                <input ref={descRef} id="editlinkDescription" type="text" name="editlinkDescription" defaultValue={params.description || ''}/>
                <button onClick={handleClick} id="editlinkSubmit" type="submit">Modificar</button>
                <p id="editLinkError"></p>
            </fieldset>
        </form>
  )
}
