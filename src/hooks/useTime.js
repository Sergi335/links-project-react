import { useEffect, useState } from 'react'

export const useTime = () => {
  // const [seconds, setSeconds] = useState(new Date().getSeconds())
  const [minutes, setMinutes] = useState(new Date().getMinutes())
  const [hours, setHours] = useState(new Date().getHours())
  const [saludo, setSaludo] = useState('')

  useEffect(() => {
    const intervalId = setInterval(() => {
      const date = new Date()
      // setSeconds(date.getSeconds())
      setMinutes(date.getMinutes())
      setHours(date.getHours())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (hours >= 7 && hours < 14) {
      setSaludo('Buenos días')
    } else if (hours >= 14 && hours < 20) {
      setSaludo('Buenas tardes')
    } else {
      setSaludo('Buenas noches')
    }
  }, [hours])

  return {
    hours,
    minutes,
    // seconds,
    saludo
  }
}
