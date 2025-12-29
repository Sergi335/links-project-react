import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'react-toastify'
import { chatWithVideo, generateSummary, updateLink } from '../../services/dbQueries'
import { useGlobalStore } from '../../store/global'
import styles from './LinkDetailsTabs.module.css'

export default function LinkDetailsSummary ({ data }) {
  const [loading, setLoading] = useState(false)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const [chatMessage, setChatMessage] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  // Si no hay historial en la respuesta, lo inicializamos vacío
  // Nota: data.chatHistory debe venir del backend si queremos persistencia
  // Por ahora lo manejamos localmente si no existe
  const [localChatHistory, setLocalChatHistory] = useState(data.chatHistory || [])

  // Sincronizar historial si cambia el link (data)
  useEffect(() => {
    if (data.chatHistory) {
      setLocalChatHistory(data.chatHistory)
    }
  }, [data._id, data.chatHistory])

  const handleGenerateSummary = async () => {
    setLoading(true)
    const result = await generateSummary({ linkId: data._id })
    setLoading(false)

    if (result.success) {
      // Extraer el resumen manejando diferentes posibles estructuras de datos
      const summaryContent = result.data?.summary ||
                            (Array.isArray(result.data) ? result.data[0]?.summary : null) ||
                            (typeof result.data === 'string' ? result.data : null)

      if (!summaryContent) {
        toast.error('No se pudo extraer el contenido del resumen')
        return
      }

      // Actualizar el store global para reflejar el nuevo resumen
      // Usamos useGlobalStore.getState() para asegurar que tenemos el estado más reciente
      const currentLinks = useGlobalStore.getState().globalLinks
      const elementIndex = currentLinks.findIndex(link => link._id === data._id)

      if (elementIndex !== -1) {
        const newState = [...currentLinks]
        newState[elementIndex] = { ...newState[elementIndex], summary: summaryContent }
        setGlobalLinks(newState)
        toast.success('Resumen generado correctamente')
      }
    } else {
      toast.error(result.message)
    }
  }

  const handleDeleteSummary = async () => {
    if (!window.confirm('¿Estás seguro de que quieres borrar el resumen?')) return

    setLoading(true)
    try {
      const result = await updateLink({
        items: [{
          id: data._id,
          summary: null
        }]
      })

      if (result.success) {
        // Actualizar el store global
        const currentLinks = useGlobalStore.getState().globalLinks
        const elementIndex = currentLinks.findIndex(link => link._id === data._id)

        if (elementIndex !== -1) {
          const newState = [...currentLinks]
          newState[elementIndex] = { ...newState[elementIndex], summary: null }
          setGlobalLinks(newState)
          toast.success('Resumen borrado correctamente')
        }
      } else {
        toast.error('Error al borrar el resumen')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al borrar el resumen')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!chatMessage.trim()) return

    const newMessage = chatMessage
    setChatMessage('')
    setChatLoading(true)

    // Añadir mensaje del usuario optimísticamente
    const newHistory = [...localChatHistory, { role: 'user', content: newMessage }]
    setLocalChatHistory(newHistory)

    const result = await chatWithVideo({ linkId: data._id, message: newMessage })
    setChatLoading(false)

    if (result.success) {
      // Actualizar con la respuesta del modelo
      // Asumimos que el backend devuelve el objeto history completo o la respuesta
      // Ajustar según contrato: data.data.history
      if (result.data.history) {
        setLocalChatHistory(result.data.history)
      } else if (result.data.answer) {
        setLocalChatHistory([...newHistory, { role: 'model', content: result.data.answer }])
      }
    } else {
      toast.error(result.message)
      // Rollback si falla (opcional)
    }
  }

  // Asignamos el summary desde el store si existe el link, para que los cambios se vean al instante
  // Si el link existe en el store, su estado es la fuente de verdad (incluso si summary es null)
  const linkInStore = globalLinks.find(link => link._id === data._id)
  const summary = linkInStore ? linkInStore.summary : data.summary

  return (
    <div className={styles.summaryContainer}>
      {/* Sección Resumen */}
      <div className={styles.summaryBlock}>
        <div className={styles.summaryHeader}>
          <h3>Resumen del Video</h3>
          {summary && (
            <button
              className={styles.deleteButton}
              onClick={handleDeleteSummary}
              disabled={loading}
              title="Borrar resumen"
            >
              Borrar
            </button>
          )}
        </div>
        {summary
          ? (
          <div className={styles.markdownContent}>
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
            )
          : (
          <div className={styles.emptyState}>
            <p>No hay resumen disponible para este video.</p>
            <button
              className={styles.generateButton}
              onClick={handleGenerateSummary}
              disabled={loading}
            >
              {loading ? 'Generando...' : 'Generar Resumen con IA'}
            </button>
          </div>
            )
        }
      </div>

      {/* Sección Chat (Solo visible si hay resumen o si se decide mostrar siempre) */}
      <div className={styles.chatBlock}>
        <h3>Chat con el Video</h3>
        <div className={styles.chatHistory}>
            {localChatHistory.map((msg, index) => (
                <div key={index} className={`${styles.chatMessage} ${msg.role === 'user' ? styles.userMessage : styles.modelMessage}`}>
                    <strong>{msg.role === 'user' ? 'Tú' : 'IA'}:</strong>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
            ))}
            {chatLoading && <p className={styles.typingIndicator}>Escribiendo...</p>}
        </div>
        <form onSubmit={handleSendMessage} className={styles.chatInputForm}>
            <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Pregunta algo sobre el video..."
                disabled={chatLoading}
            />
            <button className="button" type="submit" disabled={chatLoading || !chatMessage.trim()}>Enviar</button>
        </form>
      </div>
    </div>
  )
}
