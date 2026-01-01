import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { apiFetch } from '../../services/api'
import { constants } from '../../services/constants'
import { updateLink } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
import styles from './article.module.css'

const ArticleRenderer = ({ data }) => {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(false)
  const globalArticles = useGlobalStore(state => state.globalArticles)
  const setGlobalArticles = useGlobalStore(state => state.setGlobalArticles)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const { id } = useParams()

  useEffect(() => {
    if (data?._id && data?._id === id) {
      setArticle(data.extractedArticle)
    } else {
      setArticle(globalArticles)
    }
  }, [globalArticles, data])

  const handleExtractArticle = async () => {
    try {
      setLoading(true)
      const article = await apiFetch(`${constants.BASE_API_URL}/links/${data._id}/extract`, {
        method: 'POST',
        ...constants.FETCH_OPTIONS
      })

      // console.log('🚀 ~ handleExtractArticle ~ data:', data)
      if (Array.isArray(article.data) && article.data.length > 0) {
        setGlobalArticles(article.data[0].extractedArticle)
        const newState = [...globalLinks]
        const index = newState.findIndex(link => link._id === data._id)
        if (index !== -1) {
          newState[index] = { ...newState[index], extractedArticle: article.data[0].extractedArticle }
          setGlobalLinks(newState)
          setLoading(false)
        }
      } else {
        setGlobalArticles(article.data)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error('Error fetching article:', error)
      toast.error('Error fetching article')
    }
  }
  const handleUpdateLink = async () => {
    try {
      const response = await updateLink({ items: [{ id, extractedArticle: null }] })
      const { hasError, message } = handleResponseErrors(response)
      if (hasError) {
        toast(message)
      }
    } catch (error) {
      console.error('Error updating link:', error)
    }
  }
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span className={styles.loader}></span>
        <span>Extrayendo artículo...</span>
      </div>
    )
  }
  if (!loading && !article) {
    return (
      <button style={{ width: 'fit-content', margin: '0 auto' }} onClick={handleExtractArticle}>Extraer Artículo</button>
    )
  }

  return (
    <article className={styles.articleContainer}>
      {/* Imagen destacada */}
      {article.content && (
        <div className={styles.articleFeaturedImage}>
          <img
            src={extractImageSrc(article.content)}
            alt={article.title}
            className={styles.featuredImage}
          />
        </div>
      )}

      {/* Encabezado del artículo */}
      <header className={styles.articleHeader}>
        <h1 className={styles.articleTitle}>{article.title}</h1>

        <div className={styles.articleMeta}>
          <span className={styles.articleAuthor}>Por {article.byline || 'Autor desconocido'}</span>
          <span className={styles.articleSite}>en {article.siteName || 'Sitio desconocido'}</span>
        </div>
        <button className={styles.articleEditButton} onClick={handleUpdateLink}>
          Eliminar Artículo
        </button>
      </header>

      {/* Contenido principal */}
      <div className={styles.articleContent}>
        {article.content
          ? (
          <div
            className={styles.contentBody}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
            )
          : (
          <p className={styles.articleExcerpt}>{article.excerpt}</p>
            )}
      </div>

      {/* Información del autor - si está disponible en el contenido */}
      {article.content && extractAuthorSection(article.content) && (
        <section className={styles.authorSection}>
          {extractAuthorSection(article.content)}
        </section>
      )}
    </article>
  )
}

// Funciones auxiliares para extraer partes específicas del HTML
const extractImageSrc = (html) => {
  const imgMatch = html.match(/<img[^>]+src="([^">]+)"/)
  return imgMatch ? imgMatch[1] : 'https://via.placeholder.com/800x400?text=Imagen+no+disponible'
}

const extractAuthorSection = (html) => {
  const authorMatch = html.match(/<div[^>]*class="[^"]*author-section[^"]*"[^>]*>[\s\S]*?<\/div>/)
  return authorMatch ? authorMatch[0] : null
}

export default ArticleRenderer
