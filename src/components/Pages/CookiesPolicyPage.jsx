import { useTranslation } from 'react-i18next'
import styles from './CookiesPolicyPage.module.css'
import { HomeFooter, HomeNav } from './HomePage'

export default function CookiesPolicy () {
  const { t } = useTranslation('legal')
  const sections = t('cookies.sections', { returnObjects: true })

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      margin: '0 auto',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'space-between'
    }}>
      <HomeNav />
      <main className={styles.container}>
        <h1>{t('cookies.title')}</h1>

        {sections.map((section, index) => (
          <section key={index}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}
            {section.list && (
              <ul>
                {section.list.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </main>
      <HomeFooter />
    </div>
  )
}
