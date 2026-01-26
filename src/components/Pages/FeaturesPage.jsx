import { HomeNav, HomeFooter } from './HomePage'
import styles from './FeaturesPage.module.css'

export default function FeaturesPage () {
  const features = [
    {
      id: 1,
      title: 'Organize Everything in One Place',
      text: 'Stop switching between apps. Keep all your links, articles, videos, and resources in a single, organized space. Categorize with ease and find what you need instantly.',
      placeholder: 'All-in-one Dashboard'
    },
    {
      id: 2,
      title: 'AI-Powered Summaries',
      text: "Don't have time to watch the whole video? Let our advanced AI generate concise summaries of YouTube videos, so you can grasp the key points in seconds.",
      placeholder: 'AI Summary Demo'
    },
    {
      id: 3,
      title: 'Smart Search Capabilities',
      text: 'Rediscover your content with powerful search. Filter by tags, dates, or even content within your saved links. Never lose a valuable resource again.',
      placeholder: 'Smart Search UI'
    },
    {
      id: 4,
      title: 'Visual Link Previews',
      text: 'Say goodbye to text-only lists. Visualize your bookmarks with rich cards that automatically pull images and metadata from the websites you save.',
      placeholder: 'Rich Cards Preview'
    },
    {
      id: 5,
      title: 'Secure & Private',
      text: 'Your data is yours. We prioritize your privacy and security with end-to-end encryption for sensitive data and strict no-tracking policies.',
      placeholder: 'Security Shield'
    }
  ]

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
              <div className={styles.placeholderImage}>
                {feature.placeholder} (Image Placeholder)
              </div>
              {/* Users can replace the div above with <img src="..." alt="..." className={styles.placeholderImage} /> */}
            </div>
          </section>
        ))}
      </main>

      <HomeFooter />
    </div>
  )
}
