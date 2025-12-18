import { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import styles from '../components/LinkDetails/LinkDetails.module.css'
import useFaviconSelection from '../hooks/useFaviconSelection'
import useHideForms from '../hooks/useHideForms'
import { constants } from '../services/constants'
import { useGlobalStore } from '../store/global'
const FaviconSelector = forwardRef(function FaviconSelector ({ links, setLinks, data, showIcons }, ref) {
  const inputRef = useRef()
  //   const currentImageRef = useRef()
  const deleteButtonRef = useRef()
  const saveButtonRef = useRef()
  const containerRef = useRef()
  const faviconChangerVisible = useGlobalStore(state => state.faviconChangerVisible)
  const setFaviconChangerVisible = useGlobalStore(state => state.setFaviconChangerVisible)
  const faviconChangerVisiblePoints = useGlobalStore(state => state.faviconChangerVisiblePoints)
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  useHideForms({ form: containerRef.current, setFormVisible: setFaviconChangerVisible })
  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
      setContainerHeight(containerRef.current.offsetHeight)
    }
  }, [faviconChangerVisible])
  const {
    handleDeleteLinkIcon,
    handleCreateImageUrlFromFile,
    handleUploadImage,
    handleSetAutoIcon,
    handleSelectIconOnClick,
    icons
  } = useFaviconSelection({
    links,
    setLinks,
    data,
    deleteButtonRef,
    saveButtonRef,
    currentImageRef: ref,
    inputRef
  })
  // Calcula la posición a la izquierda
  const left = faviconChangerVisiblePoints.x - containerWidth - 32
  const top = faviconChangerVisiblePoints.y - (containerHeight / 2)

  return (
        <div ref={containerRef} className={faviconChangerVisible ? `${styles.showIcons} ${styles.imgOptions}` : `${styles.imgOptions}` } style={{ top: `${top}px`, left: `${left}px` }}>
            <div className={styles.imgOptionsWrapper}>
              {
                constants.DEFAULT_LINK_ICONS.map(icon => (<img key={icon.option} id={icon.option} className='default' onClick={handleSelectIconOnClick} src={icon.url} alt={icon.option} />))
              }
              {
                icons?.map(icon => (<img key={icon.nombre} id={icon.nombre} className={icon.clase} onClick={handleSelectIconOnClick} src={icon.url} alt="" />))
              }
            </div>
            <div className={styles.imgOptionsControls}>
              <button className={`${styles.upLinkImage} ${styles.control_button}`}>
                <label htmlFor="upLinkImg">
                <svg className="uiIcon-button" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"></path></svg>
                        Subir Favicon
                  </label>
                <input ref={inputRef} id="upLinkImg" type="file" accept="image/*" onChange={handleCreateImageUrlFromFile}/>
              </button>
              <button className={'button_small'} ref={saveButtonRef} id="saveLinkImage" onClick={handleUploadImage}>Guardar</button>
              <button className={'button_small'} id="option8" onClick={handleSetAutoIcon}>Auto</button>
              <button className={'button_small'} ref={deleteButtonRef} id="deleteLinkImage" onClick={handleDeleteLinkIcon}>Borrar</button>
            </div>
        </div>
  )
})
export default FaviconSelector
