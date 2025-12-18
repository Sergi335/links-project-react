import { useEffect, useState } from 'react'
import { checkUrlMatch } from '../services/functions'
import { useGlobalStore } from '../store/global'
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

  return (
    <>
      {
        isVideo
          ? (
          <>
          <iframe style={{ border: 'none' }} className={styles.video_player_iframe} src={checkUrlMatch(src)} width={width} height={height}></iframe>
          <button style={{ marginTop: '7px' }} className='button_small' onClick={handleHideTabs}>
          {tabsVisible
            ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-rectangle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /></svg>
              )
            : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-box-align-top-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19 11.01h-5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1z" /><path d="M20 15.01v-.01" /><path d="M20 20.01v-.01" /><path d="M15 20.01v-.01" /><path d="M9 20.01v-.01" /><path d="M9 4.01v-.01" /><path d="M4 20.01v-.01" /><path d="M4 15.01v-.01" /><path d="M4 9.01v-.01" /><path d="M4 4.01v-.01" /></svg>
              )
        }
        </button>
        </>
            )
          : <div className={styles.video_player_placeholder}></div>
      }
    </>
  )
}
