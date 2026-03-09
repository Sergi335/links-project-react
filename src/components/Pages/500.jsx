import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styles from './404.module.css'

export default function InternalError () {
  const { t } = useTranslation(['common', 'errors'])

  return (
    <div className={styles.main}>
      <div className={styles.wrapper}>
        <h1>500</h1>
        <p>{t('errors:500.message')}</p>
        <Link to={-1}>
          {t('common:actions.goBack')}
        </Link>
      </div>
    </div>
  )
}
