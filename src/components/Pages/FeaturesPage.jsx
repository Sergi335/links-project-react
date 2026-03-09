import styles from './FeaturesPage.module.css'
import { HomeFooter, HomeNav } from './HomePage'

export default function FeaturesPage () {
  const features = [
    {
      id: 1,
      title: 'Image Galleries',
      text: 'Create visual collections for your saved images. Organize them by themes, projects, or inspiration boards and browse everything in a clean gallery view.',
      placeholder: 'All-in-one Dashboard',
      image: 'img/img8.png'
    },
    {
      id: 2,
      title: 'AI-Powered Summaries',
      text: "Don't have time to watch the whole video? Let our advanced AI generate concise summaries of YouTube videos, so you can grasp the key points in seconds.",
      placeholder: 'AI Summary Demo',
      image: 'img/img5.png'
    },
    {
      id: 3,
      title: 'Notes',
      text: 'Write quick notes while you browse and keep your ideas connected to each saved link. Capture key points, reminders, and thoughts in one place.',
      placeholder: 'Smart Search UI',
      image: 'img/img3.png'
    },
    {
      id: 4,
      title: 'Read Articles',
      text: 'Save articles to read later in a distraction-free format. Focus on the content, highlight what matters, and return to your reading list anytime.',
      placeholder: 'Rich Cards Preview',
      image: 'img/img4.png'
    },
    {
      id: 5,
      title: 'Watch Videos',
      text: 'Keep your video resources organized and ready to play whenever you need them. Build playlists for learning, work, or entertainment without losing track.',
      placeholder: 'Security Shield',
      image: 'img/img6.png'
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
              {/* <div className={styles.placeholderImage}>
                {feature.placeholder} (Image Placeholder)
              </div> */}
              <img src={feature.image} alt={feature.title} />
              {/* Users can replace the div above with <img src="..." alt="..." className={styles.placeholderImage} /> */}
            </div>
          </section>
        ))}
      </main>

      <HomeFooter />
    </div>
  )
}
