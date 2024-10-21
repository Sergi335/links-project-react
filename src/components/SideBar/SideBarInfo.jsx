import { useEffect, useState } from 'react'
import { saludo } from '../../services/functions'
import { useSessionStore } from '../../store/session'
import Clock from '../Clock'
import styles from './SideInfo.module.css'

export default function SideBarInfo () {
  const [salut, setSalut] = useState('')
  const user = useSessionStore(state => state.user)

  // TODO: No se actualiza con el cambio de hora, puede ser de noche y decirte buenos días
  useEffect(() => {
    setSalut(saludo(''))
  }, [])

  return (
        <section className={styles.deskInfos}>
            <div className={styles.deskInfos_info}>
                <p className={styles.saludo}>{salut}</p>
                <Clock />
            </div>
            <p className={styles.deskInfos_user}>{user.realName}</p>
        </section>
  )
}
