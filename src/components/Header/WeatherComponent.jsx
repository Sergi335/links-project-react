import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import { useEffect, useState } from 'react'
import styles from './Header.module.css'

export default function WeatherComponent () {
  const [temperatura, setTemperatura] = useState(null)
  const [icono, setIcono] = useState(null)

  useEffect(() => {
    const obtenerDatosClima = async () => {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY
      const ciudad = 'Alicante' // Reemplaza con la ciudad deseada
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&lang=es&appid=${apiKey}`
      // console.log('Actualizando datos meteorológicos...')

      try {
        const respuesta = await fetch(url)
        const datos = await respuesta.json()
        setTemperatura(datos.main.temp)

        const estadoClima = datos.weather[0].main
        let claseIcono

        switch (estadoClima) {
          case 'Clear':
            claseIcono = 'ti ti-sun' // Sol
            break
          case 'Clouds':
            claseIcono = 'ti ti-cloud' // Nube
            break
          case 'Rain':
            claseIcono = 'ti ti-cloud-rain' // Lluvia
            break
          case 'Snow':
            claseIcono = 'ti ti-snowflake' // Nieve
            break
          case 'Thunderstorm':
            claseIcono = 'ti ti-cloud-storm' // Tormenta
            break
          default:
            claseIcono = 'ti ti-cloud-rainbow' // Otro
        }

        setIcono(claseIcono)
      } catch (error) {
        console.error('Error al obtener los datos del clima:', error)
      }
    }

    obtenerDatosClima()
    // Configuramos el intervalo para actualizar cada hora (3600000 ms)
    const intervalo = setInterval(obtenerDatosClima, 900000)

    // Limpiamos el intervalo al desmontar el componente
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div>
      {temperatura !== null && icono
        ? (
        <div className={styles.weather}>
          <p><i className={icono}></i></p>
          <p>{temperatura}°C</p>
        </div>
          )
        : (
        <p>Cargando...</p>
          )}
    </div>
  )
}
