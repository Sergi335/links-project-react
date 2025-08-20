import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { updateLink } from '../../services/dbQueries'
import { handleResponseErrors } from '../../services/functions'
import { useGlobalStore } from '../../store/global'
import styles from './article.module.css'

const ArticleRenderer = () => {
  const [article, setArticle] = useState(null)
  const globalArticles = useGlobalStore(state => state.globalArticles)
  const { id } = useParams()

  useEffect(() => {
    setArticle(globalArticles)
    // if (article !== undefined) {
    //   //console.log('🚀 ~ ArticleRenderer ~ globalArticles:', JSON.parse(article?.content))
    // }
  }, [globalArticles])
  // console.log('🚀 ~ ArticleRenderer ~ article:', article)
  if (!article) {
    return <div className="article-loading">Cargando artículo...</div>
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

// const extractContentBody = (html) => {
//   const contentMatch = html.match(/<div[^>]*class="[^"]*page[^"]*"[^>]*>([\s\S]*?)<\/div>/)
//   if (contentMatch && contentMatch[1]) {
//     // Limpiar el contenido para eliminar elementos no deseados
//     let cleanedContent = contentMatch[1]
//       .replace(/<div[^>]*class="[^"]*page[^"]*"[^>]*>/g, '')
//       .replace(/<div[^>]*id="[^"]*readability-page-[^"]*"[^>]*>/g, '')

//     // Eliminar secciones específicas que no queremos mostrar dos veces
//     cleanedContent = cleanedContent
//       .replace(/<figure>[\s\S]*?<\/figure>/, '') // Eliminar figura (ya la mostramos arriba)
//       .replace(/<div[^>]*class="[^"]*article-header[^"]*"[^>]*>[\s\S]*?<\/div>/, '')
//       .replace(/<div[^>]*class="[^"]*author-section[^"]*"[^>]*>[\s\S]*?<\/div>/, '')

//     return cleanedContent
//   }
//   return html
// }

const extractAuthorSection = (html) => {
  const authorMatch = html.match(/<div[^>]*class="[^"]*author-section[^"]*"[^>]*>[\s\S]*?<\/div>/)
  return authorMatch ? authorMatch[0] : null
}

export default ArticleRenderer
