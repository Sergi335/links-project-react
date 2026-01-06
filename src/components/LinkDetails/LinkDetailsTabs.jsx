import { useEffect, useMemo, useState } from 'react'
import ArticleRenderer from '../Pages/article'
import LinkDetailsGallery from './LinkDetailsGallery'
import Editor from './LinkDetailsNotes'
import LinkDetailsSummary from './LinkDetailsSummary'
import styles from './LinkDetailsTabs.module.css'

// Configuración de secciones por tipo de link
const sectionsByType = {
  video: {
    sections: ['images', 'notes', 'summary'],
    defaultSection: 'summary'
  },
  article: {
    sections: ['images', 'notes', 'article'],
    defaultSection: 'article'
  },
  note: {
    sections: ['images', 'notes'],
    defaultSection: 'notes'
  },
  general: {
    sections: ['images', 'notes'],
    defaultSection: 'images'
  }
}

const allSections = [
  { id: 'images', name: 'Gallery' },
  { id: 'notes', name: 'Notes' },
  { id: 'article', name: 'Article' },
  { id: 'summary', name: 'Summary' }
]

export default function LinkDetailsTabs ({ data }) {
  const linkType = data?.type || 'general'

  // Obtener configuración según el tipo de link
  const { visibleSections, defaultSection } = useMemo(() => {
    const config = sectionsByType[linkType] || sectionsByType.general
    const visible = allSections.filter(s => config.sections.includes(s.id))
    return {
      visibleSections: visible,
      defaultSection: config.defaultSection
    }
  }, [linkType])

  const [activeSection, setActiveSection] = useState(defaultSection)

  // Resetear a la sección por defecto cuando cambia el link
  useEffect(() => {
    setActiveSection(defaultSection)
  }, [data?._id, defaultSection])

  return (
        <div className={styles.link_details_tabs_container}>

                <div className={styles.link_details_tabs}>
                {
                    visibleSections.map(section => {
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
                        <div className={styles.link_details_tabs_notes_wrapper}>
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
