import { useState } from 'react'
import ArticleRenderer from '../Pages/article'
import LinkDetailsGallery from './LinkDetailsGallery'
import Editor from './LinkDetailsNotes'
import LinkDetailsSummary from './LinkDetailsSummary'
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
  },
  {
    id: 'summary',
    name: 'Summary'
  }
]

export default function LinkDetailsTabs ({ data }) {
//   console.log('🚀 ~ LinkDetailsTabs ~ data:', data)
  const [activeSection, setActiveSection] = useState(sections[0].id)

  return (
        <div className={styles.link_details_tabs_container}>

                <div className={styles.link_details_tabs}>
                {
                    sections.map(section => {
                      // Condición para mostrar "Summary" solo si es video
                    //   if (section.id === 'summary' && data.type !== 'video') return null
                      return (
                        <button
                            key={section.id}
                            className={`${activeSection === section.id ? styles.active : ''} ${styles.link_details_tab}`}
                            onClick={() => setActiveSection(section.id)}
                        >
                            {section.name}
                        </button>
                      )
                    })
                }
            </div>
            <div className={styles.link_details_content}>
                {
                    activeSection === 'images' && (
                        <div>
                            <LinkDetailsGallery data={data}/>
                        </div>
                    )
                }
                {
                    activeSection === 'notes' && (
                        <div>
                            <Editor data={data} />
                        </div>
                    )
                }
                {
                    activeSection === 'article' && (
                        <div>
                            {/* {data.extractedArticle === undefined && <ExtractArticleButton linkId={data._id} />} */}
                            <ArticleRenderer data={data} />
                        </div>
                    )
                }
                {
                    activeSection === 'summary' && (
                        <div>
                            <LinkDetailsSummary data={data} />
                        </div>
                    )
                }
            </div>

        </div>
  )
}
