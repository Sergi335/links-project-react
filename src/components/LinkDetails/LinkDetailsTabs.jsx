import { useState } from 'react'
import ArticleRenderer from '../Pages/article'
import LinkDetailsGallery from './LinkDetailsGallery'
import Editor from './LinkDetailsNotes'
import styles from './LinkDetailsTabs.module.css'

const sections = [
  {
    id: 'images',
    name: 'Images'
  },
  {
    id: 'notes',
    name: 'Notes'
  },
  {
    id: 'article',
    name: 'Article'
  }
]

export default function LinkDetailsTabs ({ data }) {
  const [activeSection, setActiveSection] = useState(sections[0].id)

  return (
        <div className={styles.link_details_tabs_container}>
            <div className={styles.link_details_tabs}>
                {
                    sections.map(section => (
                        <button
                            key={section.id}
                            className={`${activeSection === section.id ? styles.active : ''} ${styles.link_details_tab}`}
                            onClick={() => setActiveSection(section.id)}
                        >
                            {section.name}
                        </button>
                    ))
                }
            </div>
            <div className={styles.link_details_content}>
                {
                    activeSection === 'images' && (
                        <div>
                            <h2>Images</h2>
                            <LinkDetailsGallery data={data}/>
                        </div>
                    )
                }
                {
                    activeSection === 'notes' && (
                        <div>
                            <h2>Notes</h2>
                            <Editor />
                        </div>
                    )
                }
                {
                    activeSection === 'article' && (
                        <div>
                            <ArticleRenderer />
                        </div>
                    )
                }
            </div>
        </div>
  )
}
