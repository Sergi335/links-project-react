import { useEffect, useState } from 'react'
import { checkUrlMatch } from '../services/functions'
import styles from './VideoPlayer.module.css'

export default function VideoPlayer ({ src, width, height }) {
  console.log('🚀 ~ VideoPlayer ~ src:', src)
  const [isVideo, setIsVideo] = useState(false)
  useEffect(() => {
    if (src !== '' && src !== undefined) {
      setIsVideo(checkUrlMatch(src))
    }
  }, [src])

  return (
    <>
      {
        isVideo && <iframe style={{ border: 'none' }} className={styles.video_player_iframe} src={checkUrlMatch(src)} width={width} height={height}></iframe>
      }
    </>
  )
}
