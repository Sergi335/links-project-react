import { useState, useEffect } from 'react'
import styles from './Clock.module.css'
export default function Clock () {
  const [seconds, setSeconds] = useState('')
  const [minutes, setMinutes] = useState('')
  const [hours, setHours] = useState('')
  useEffect(() => {
    const getTime = () => {
      const date = new Date()
      const secs = date.getSeconds()
      const mins = date.getMinutes()
      const hrs = date.getHours()
      setSeconds(secs)
      setMinutes(mins)
      setHours(hrs)
    }
    setInterval(() => {
      getTime()
    }, 1000)
  })
  return (
        <p className={styles.reloj}>{`${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</p>
  )
}
