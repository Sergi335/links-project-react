import { useEffect, useState } from 'react'
import { formatDate, getUrlStatus } from '../../services/functions'
import { CheckIcon, CloseIcon } from '../Icons/icons'
import styles from './LinkDetails.module.css'

export default function LinkDetailsHeader ({ data, context }) {
  const [urlStatus, setUrlStatus] = useState()
  const [badgeClass, setBadgeClass] = useState()
  // Checa el estado de la url en cada cambio de link
  useEffect(() => {
    const checkUrlStatus = async (url) => {
      const status = await getUrlStatus(url)
      if (status) {
        setUrlStatus(<CheckIcon className={styles.badgeIcon}/>)
        setBadgeClass(`${styles.badgeSuccess}`)
      } else {
        setUrlStatus(<CloseIcon className={styles.badgeIcon}/>)
        setBadgeClass(`${styles.badgeDanger}`)
      }
    }
    checkUrlStatus(data?.URL)
  }, [data])
  return (
        <header className={styles.header}>
          <h3>Detalles del Link</h3>
          {
            context !== 'singlecol' && <a href={data?.URL} target='_blank' rel="noreferrer">{data?.name}</a>
          }
          {
            context !== 'singlecol' && <p><strong>Panel:</strong> <span>{data?.panel}</span></p>
          }
          <p><strong>Activo:</strong> <span className={badgeClass}>{urlStatus || 'comprobando...' }</span></p>
          <p><strong>Fecha de creación: </strong><span>{formatDate(data?.createdAt)}</span></p>
        </header>
  )
}
