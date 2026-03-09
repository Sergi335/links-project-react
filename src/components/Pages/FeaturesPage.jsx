import { useTranslation } from 'react-i18next'
import styles from './FeaturesPage.module.css'
import { HomeFooter, HomeNav } from './HomePage'

export default function FeaturesPage () {
  const { t } = useTranslation('features')
  const features = t('items', { returnObjects: true })
  const featureImages = ['img/img8.webp', 'img/img5.webp', 'img/img3.webp', 'img/img4.webp', 'img/img6.webp']

  return (
    <div className={styles.pageContainer}>
      <HomeNav />
      {/* Spacer for fixed nav if needed, or just normal flow. HomeNav seems relative/sticky based on HomePage styles but we will check. */}
      {/* Assuming HomeNav is just a block, we can just place it. */}

      <main className={styles.mainContent}>
        {features.map((feature) => (
          <section key={feature.id} className={styles.featureSection}>
            <div className={styles.textContent}>
              <h2>{feature.title}</h2>
              <p>{feature.text}</p>
            </div>
            <div className={styles.imageContent}>
              {/* <div className={styles.placeholderImage}>
                {feature.placeholder} (Image Placeholder)
              </div> */}
              <img src={featureImages[feature.id - 1]} alt={feature.title} />
              {/* Users can replace the div above with <img src="..." alt="..." className={styles.placeholderImage} /> */}
            </div>
          </section>
        ))}
      </main>

      <HomeFooter />
    </div>
  )
}
