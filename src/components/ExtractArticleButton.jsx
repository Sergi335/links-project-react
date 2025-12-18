import { toast } from 'react-toastify'
import { constants } from '../services/constants'
import { useGlobalStore } from '../store/global'
export default function ExtractArticleButton ({ linkId }) {
  const setGlobalArticles = useGlobalStore(state => state.setGlobalArticles)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const handleExtractArticle = () => {
    fetch(`${constants.BASE_API_URL}/links/${linkId}/extract`, {
      method: 'POST',
      ...constants.FETCH_OPTIONS
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        // console.log('🚀 ~ handleExtractArticle ~ data:', data)
        if (Array.isArray(data.data) && data.data.length > 0) {
          setGlobalArticles(data.data[0].extractedArticle)
          const newState = [...globalLinks]
          const index = newState.findIndex(link => link._id === linkId)
          if (index !== -1) {
            newState[index] = { ...newState[index], extractedArticle: data.data[0].extractedArticle }
            setGlobalLinks(newState)
          }
        } else {
          setGlobalArticles(data.data)
        }
      })
      .catch(error => {
        console.error('Error fetching article:', error)
        toast.error('Error fetching article')
      })
  }
  return (
    <button onClick={handleExtractArticle}>
      Extract Article
    </button>
  )
}
