import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import { useEffect, useState } from 'react'
import { editUserAditionalInfo } from '../../services/dbQueries'
import { useSessionStore } from '../../store/session'
import styles from './Header.module.css'

export default function WeatherComponent () {
  const user = useSessionStore(state => state.user)
  const setUser = useSessionStore(state => state.setUser)
  const [temperatura, setTemperatura] = useState(null)
  const [icono, setIcono] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [inputCiudad, setInputCiudad] = useState(user?.weatherCity || 'Alicante')
  const [ciudadActual, setCiudadActual] = useState(user?.weatherCity || 'Alicante')

  useEffect(() => {
    if (user?.weatherCity) {
      setCiudadActual(user.weatherCity)
      setInputCiudad(user.weatherCity)
    }
  }, [user?.weatherCity])

  const obtenerDatosClima = async (ciudad) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    if (!ciudad) return
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&lang=es&appid=${apiKey}`
    // console.log('Actualizando datos meteorológicos...')

    try {
      const respuesta = await fetch(url)
      if (!respuesta.ok) throw new Error('Ciudad no encontrada')
      const datos = await respuesta.json()
      setTemperatura(Math.round(datos.main.temp))

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
        case 'Drizzle':
          claseIcono = 'ti ti-cloud-drizzle' // Llovizna
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

  useEffect(() => {
    obtenerDatosClima(ciudadActual)
    // Configuramos el intervalo para actualizar cada hora (3600000 ms)
    const intervalo = setInterval(() => obtenerDatosClima(ciudadActual), 900000)

    // Limpiamos el intervalo al desmontar el componente
    return () => clearInterval(intervalo)
  }, [ciudadActual])

  const handleUpdateCity = async (e) => {
    e.preventDefault()
    if (!inputCiudad.trim()) return

    try {
      if (user?.email) {
        const response = await editUserAditionalInfo({
          email: user.email,
          fields: { weatherCity: inputCiudad.trim() }
        })
        if (response.data) {
          setUser(response.data)
        }
      }
      setCiudadActual(inputCiudad.trim())
      setMostrarModal(false)
    } catch (error) {
      console.error('Error al guardar la ciudad:', error)
    }
  }

  return (
    <>
      <div onClick={() => setMostrarModal(true)} style={{ display: 'flex', alignItems: 'center' }}>
        {temperatura !== null && icono
          ? (
          <div className={styles.weather} title={`Clima en ${ciudadActual}`}>
            <p><i className={icono}></i></p>
            <p>{temperatura}°C</p>
          </div>
            )
          : (
          <p className={styles.weather}>...</p>
            )}
      </div>

      {mostrarModal && (
        <div className={styles.weatherModalOverlay} onClick={() => setMostrarModal(false)}>
          <div className={styles.weatherModal} onClick={e => e.stopPropagation()}>
            <h4>Cambiar ciudad</h4>
            <form onSubmit={handleUpdateCity}>
              <input
                type="text"
                value={inputCiudad}
                onChange={e => setInputCiudad(e.target.value)}
                placeholder="Ej: Madrid, ES"
                autoFocus
              />
              <div className={styles.modalButtons}>
                <button type="button" className={styles.cancelBtn} onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className={styles.saveBtn}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
