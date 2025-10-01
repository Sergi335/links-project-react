import { useState } from 'react'
import { useGlobalStore } from '../../store/global'
import ExtractArticleButton from '../ExtractArticleButton'
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
//   console.log('🚀 ~ LinkDetailsTabs ~ data:', data)
  const [activeSection, setActiveSection] = useState(sections[0].id)
  const setTabsVisible = useGlobalStore(state => state.setTabsVisible)
  const tabsVisible = useGlobalStore(state => state.tabsVisible)

  const handleHideTabs = () => {
    document.startViewTransition(() => {
      setTabsVisible(!tabsVisible)
    })
  }

  return (
        <div className={styles.link_details_tabs_container}>
            <div>
                <button onClick={handleHideTabs}>
                    {'<-'}
                </button>
            </div>
            <div>
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
                            <LinkDetailsGallery data={data}/>
                        </div>
                    )
                }
                {
                    activeSection === 'notes' && (
                        <div>
                            <h2>Notes</h2>
                            <Editor data={data} />
                        </div>
                    )
                }
                {
                    activeSection === 'article' && (
                        <div>
                            {data.extractedArticle === undefined && <ExtractArticleButton linkId={data._id} />}
                            <ArticleRenderer data={data} />
                        </div>
                    )
                }
            </div>
            </div>
        </div>
  )
}
