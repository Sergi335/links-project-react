import { useEffect, useState } from 'react'
import { checkUrlMatch } from '../services/functions'

export default function VideoPlayer ({ src, width, height }) {
  const [isVideo, setIsVideo] = useState(false)
  useEffect(() => {
    if (src) {
      setIsVideo(checkUrlMatch(src))
    }
  }, [src])

  return (
    <>
      {
        isVideo && (<iframe src={checkUrlMatch(src)} width={width} height={height}></iframe>)
      }
    </>
  )
}
