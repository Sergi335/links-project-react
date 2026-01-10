import { useTime } from '../../hooks/useTime'
import Clock from '../Header/Clock'
import styles from '../Header/Header.module.css'
import WeatherComponent from '../Header/WeatherComponent'

export default function WeatherSlider () {
  const { hours, minutes } = useTime()
  const isProd = import.meta.env.MODE === 'production'
  return (
        <div className={styles.weatherSlider}>
            <Clock hours={hours} minutes={minutes} />
            {isProd && <WeatherComponent />}
        </div>
  )
}
