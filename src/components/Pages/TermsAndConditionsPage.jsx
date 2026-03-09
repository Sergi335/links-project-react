import { useTranslation } from 'react-i18next'
import { HomeFooter, HomeNav } from './HomePage'
import styles from './TermsAndConditionsPage.module.css'

export default function TermsAndConditions () {
  const { t } = useTranslation('legal')
  const sections = t('terms.sections', { returnObjects: true })

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      margin: '0 auto',
      alignItems: 'center',
      width: '100%'
    }}>
      <HomeNav />
      <main className={styles.container}>
        <h1>{t('terms.title')}</h1>

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
