import { useEffect, useRef, useState } from 'react'
import styles from './MoveOtherDeskForm.module.css'
import FolderIcon from './Icons/folder'
import { useLinksStore } from '../store/links'
import { useParams } from 'react-router-dom'

export default function MoveOtherDeskForm ({ moveFormVisible, setMoveFormVisible, params }) {
  const [escritorios, setEscritorios] = useState([])
  const [columnas, setColumnas] = useState([])
  const visibleClass = moveFormVisible ? styles.flex : styles.hidden
  const moveFormRef = useRef()
  const setLinksStore = useLinksStore(state => state.setLinksStore)
  const linksStore = useLinksStore(state => state.linksStore)
  const { desktopName } = useParams()
  useEffect(() => {
    const getEscritorios = async () => {
      fetch('http://localhost:3003/api/escritorios', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'x-justlinks-user': 'SergioSR',
          'x-justlinks-token': 'otroheader'
        }
      })
        .then(res => res.json())
        .then(data => {
          setEscritorios(data)
        })
        .catch(err => {
          console.log(err)
        })
    }
    getEscritorios()
  }, [])
  useEffect(() => {
    const getColumnas = async () => {
      fetch('http://localhost:3003/api/columnasAll', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'x-justlinks-user': 'SergioSR',
          'x-justlinks-token': 'otroheader'
        }
      })
        .then(res => res.json())
        .then(data => {
          setColumnas(data)
        })
        .catch(err => {
          console.log(err)
        })
    }
    getColumnas()
  }, [])
  useEffect(() => {
    const handleClickOutside = (event) => {
      // console.log(event.target)
      if (event.target !== moveFormRef.current && event.target.nodeName !== 'LI' && !moveFormRef.current.contains(event.target)) {
        setMoveFormVisible(false)
      }
    }
    window.addEventListener('contextmenu', handleClickOutside)
    window.addEventListener('click', handleClickOutside)
    return () => {
      window.removeEventListener('contextmenu', handleClickOutside)
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])
  const handleClick = (event) => {
    // console.log(event.currentTarget)
    // console.log(event.currentTarget.childNodes[2])
    const panel = event.currentTarget.childNodes[2]
    if (event.target !== event.currentTarget) {
      event.stopPropagation()
      return
    }
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px'
    }
  }
  const selectDest = (event) => {
    console.log(event.currentTarget)
    event.target.classList.add('selected')
    const destinations = document.querySelectorAll('.destination')
    destinations.forEach((destination) => {
      if (destination === event.target) {
        destination.style.backgroundColor = '#ccc'
        destination.classList.add('selected')
      } else {
        destination.style.backgroundColor = ''
        destination.classList.remove('selected')
      }
    })
    // console.log('🚀 ~ file: MoveOtherDeskForm.jsx:82 ~ selectDest ~ destinations:', destinations)
  }
  const handleMove = () => {
    const columnSelected = document.querySelector('.selected')
    // const element = document.getElementById(params._id)
    const body = {
      id: params._id,
      idpanelOrigen: params.idpanel,
      fields: {
        idpanel: columnSelected.id,
        panel: columnSelected.innerText,
        name: params.name,
        orden: params.orden,
        escritorio: columnSelected.attributes[1].nodeValue
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
        const updatedDesktopLinks = linksStore.map(link => {
          if (link._id === params._id) {
            // Modifica la propiedad del elemento encontrado
            return { ...link, idpanel: columnSelected.id }
          }
          return link
        })
        setLinksStore(updatedDesktopLinks)
        localStorage.setItem(`${desktopName}links`, JSON.stringify(updatedDesktopLinks.toSorted((a, b) => (a.orden - b.orden))))
        // Modificar el localstorage de destino
      })
      .catch(err => {
        console.log(err)
      })
  }
  return (
    <div ref={moveFormRef} id="menuMoveTo" className={visibleClass + ' ' + styles.menuMoveTo}>
        <ul className={styles.destDeskMoveTo}>
        {
            escritorios
              ? escritorios.map(desk => desk.name !== params.escritorio
                ? (
                <li key={desk._id} onClick={handleClick} className={styles.accordion} id={desk.name}>
                    <FolderIcon />
                    {desk.displayName}
                        <ul>

                            {
                                columnas
                                  ? columnas.map(col => (
                                    col.escritorio === desk.name
                                      ? <li key={col._id} id={col._id} data-db={col.escritorio} className='destination' onClick={selectDest}>{col.name}</li>
                                      : null
                                  ))
                                  : null

                            }

                        </ul>
                </li>
                  )
                : null)
              : null
        }
        </ul>
        <div id="moveToControls">
            <button id="acceptMove" onClick={handleMove}>Aceptar </button>
            <button onClick={() => { setMoveFormVisible(false) }} id="cancelMove">Cancelar</button>
        </div>
    </div>
  )
}
