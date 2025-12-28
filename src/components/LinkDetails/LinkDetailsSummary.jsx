import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'react-toastify'
import { chatWithVideo, generateSummary } from '../../services/dbQueries'
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

  const handleGenerateSummary = async () => {
    setLoading(true)
    const result = await generateSummary({ linkId: data._id })
    setLoading(false)

    if (result.success) {
      // Actualizar el store global para reflejar el nuevo resumen
      const elementIndex = globalLinks.findIndex(link => link._id === data._id)
      if (elementIndex !== -1) {
        const newState = [...globalLinks]
        newState[elementIndex] = { ...newState[elementIndex], summary: result.data.summary }
        setGlobalLinks(newState)
      }
      toast.success('Resumen generado correctamente')
    } else {
      toast.error(result.message)
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

  return (
    <div className={styles.summaryContainer}>
      {/* Sección Resumen */}
      <div className={styles.summaryBlock}>
        <h3>Resumen del Video</h3>
        {data.summary
          ? (
          <div className={styles.markdownContent}>
            <ReactMarkdown>{data.summary}</ReactMarkdown>
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
            <button type="submit" disabled={chatLoading || !chatMessage.trim()}>Enviar</button>
        </form>
      </div>
    </div>
  )
}
