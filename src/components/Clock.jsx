import { useState, useEffect } from 'react'
import styles from './Clock.module.css'
export default function Clock () {
  const [seconds, setSeconds] = useState(new Date().getSeconds())
  const [minutes, setMinutes] = useState(new Date().getMinutes())
  const [hours, setHours] = useState(new Date().getHours())

  useEffect(() => {
    const intervalId = setInterval(() => {
      const date = new Date()
      setSeconds(date.getSeconds())
      setMinutes(date.getMinutes())
      setHours(date.getHours())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <p className={styles.reloj}>
      {`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
    </p>
  )
}
