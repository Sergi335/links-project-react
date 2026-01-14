import { useEffect, useState } from 'react'
import { checkUrlMatch } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
import MaximizeVideoIcon from '../Icons/maximizevideoicon'
import MinimizeVideoIcon from '../Icons/minimizevideoicon'
import styles from './VideoPlayer.module.css'

export default function VideoPlayer ({ src, width, height }) {
  const [isVideo, setIsVideo] = useState(false)
  const setTabsVisible = useGlobalStore(state => state.setTabsVisible)
  const tabsVisible = useGlobalStore(state => state.tabsVisible)
  const handleHideTabs = () => {
    document.startViewTransition(() => {
      setTabsVisible(!tabsVisible)
    })
  }
  useEffect(() => {
    if (src !== '' && src !== undefined) {
      setIsVideo(checkUrlMatch(src))
    }
  }, [src])

  useEffect(() => {
    console.log(src)
    if (src !== undefined && src !== '' && src.startsWith('http')) {
      const url = new URL(src)
      if (url.hostname === 'prothots.com') {
        console.log('Es un video de prothots.com')
        fetch(src)
          .then(response => response.text())
          .then(html => {
            console.log(html)
          })
      }
    }
  }, [src])

  return (
    <>
      {
        isVideo
          ? (
          <>
            <iframe
              style={{ border: 'none' }}
              className={styles.video_player_iframe}
              src={checkUrlMatch(src)} width={width}
              height={height}>
            </iframe>
            <button style={{ marginTop: '7px', marginLeft: '16px' }} className='button_small' onClick={handleHideTabs}>
              {tabsVisible
                ? (<MaximizeVideoIcon />)
                : (<MinimizeVideoIcon />)
              }
            </button>
          </>
            )
          : <>
            <div className={styles.video_player_placeholder}></div>
            {
              !tabsVisible && (
                  <button style={{ marginTop: '7px', marginLeft: '16px' }} className='button_small' onClick={handleHideTabs}>
                    <MaximizeVideoIcon />
                  </button>
              )
            }
            </>
      }
    </>
  )
}
