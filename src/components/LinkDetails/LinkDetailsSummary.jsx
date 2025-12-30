import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'react-toastify'
import { chatWithVideo, generateSummary, deleteAISummary, deleteAIChat, getLinkById } from '../../services/dbQueries'
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
    // Si ya tenemos historial en data, lo usamos
    if (data.chatHistory && data.chatHistory.length > 0) {
      setLocalChatHistory(data.chatHistory)
    } else {
      // Si no hay historial localmente, intentamos obtenerlo del store global
      const linkInStore = globalLinks.find(link => link._id === data._id)
      if (linkInStore?.chatHistory) {
        setLocalChatHistory(linkInStore.chatHistory)
      } else {
        // Si tampoco está en el store, forzamos una recarga de los detalles del link
        // solo si no estamos ya cargando y si es un video (o según sea necesario)
        const fetchFullLink = async () => {
          try {
            const result = await getLinkById({ id: data._id })
            if (result.success && result.data.chatHistory) {
              setLocalChatHistory(result.data.chatHistory)

              // Actualizar el store global para futuras referencias
              const currentLinks = useGlobalStore.getState().globalLinks
              const elementIndex = currentLinks.findIndex(link => link._id === data._id)
              if (elementIndex !== -1) {
                const newState = [...currentLinks]
                newState[elementIndex] = { ...newState[elementIndex], chatHistory: result.data.chatHistory }
                setGlobalLinks(newState)
              }
            }
          } catch (error) {
            console.error('Error fetching full link details:', error)
          }
        }

        if (data._id) {
          fetchFullLink()
        }
      }
    }
  }, [data._id, data.chatHistory, globalLinks])

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
      const result = await deleteAISummary(data._id)

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

  const handleDeleteChat = async () => {
    if (!window.confirm('¿Estás seguro de que quieres borrar el historial del chat?')) return

    setChatLoading(true)
    try {
      const result = await deleteAIChat(data._id)

      if (result.success) {
        setLocalChatHistory([])

        // También actualizar el store global si el historial se guarda allí
        const currentLinks = useGlobalStore.getState().globalLinks
        const elementIndex = currentLinks.findIndex(link => link._id === data._id)

        if (elementIndex !== -1) {
          const newState = [...currentLinks]
          newState[elementIndex] = { ...newState[elementIndex], chatHistory: [] }
          setGlobalLinks(newState)
          toast.success('Chat borrado correctamente')
        }
      } else {
        toast.error('Error al borrar el chat')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al borrar el chat')
    } finally {
      setChatLoading(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!chatMessage.trim()) return

    const newMessage = chatMessage
    setChatMessage('')
    setChatLoading(true)

    // Añadir mensaje del usuario optimísticamente
    const timestamp = new Date().toLocaleString()
    const newHistory = [...localChatHistory, { role: 'user', content: newMessage, timestamp }]
    setLocalChatHistory(newHistory)

    const result = await chatWithVideo({ linkId: data._id, message: newMessage })
    setChatLoading(false)

    if (result.success) {
      // Actualizar con la respuesta del modelo
      // Asumimos que el backend devuelve el objeto history completo o la respuesta
      // Ajustar según contrato: data.data.history
      let updatedHistory = []
      const modelTimestamp = new Date().toLocaleString()
      if (result.data.history) {
        // Asegurarse de que todos los mensajes tengan timestamp si el backend no los provee
        updatedHistory = result.data.history.map(msg => ({
          ...msg,
          timestamp: msg.timestamp || new Date().toLocaleString()
        }))
      } else if (result.data.answer) {
        updatedHistory = [...newHistory, { role: 'model', content: result.data.answer, timestamp: modelTimestamp }]
      }

      if (updatedHistory.length > 0) {
        setLocalChatHistory(updatedHistory)

        // Actualizar el store global
        const currentLinks = useGlobalStore.getState().globalLinks
        const elementIndex = currentLinks.findIndex(link => link._id === data._id)
        if (elementIndex !== -1) {
          const newState = [...currentLinks]
          newState[elementIndex] = { ...newState[elementIndex], chatHistory: updatedHistory }
          setGlobalLinks(newState)
        }
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
      <div className={styles.scrollableContent}>
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

        {/* Sección Chat */}
        <div className={styles.chatBlock}>
          <div className={styles.summaryHeader}>
            <h3>Chat con el Video</h3>
            {localChatHistory.length > 0 && (
              <button
                className={styles.deleteButton}
                onClick={handleDeleteChat}
                disabled={chatLoading}
                title="Borrar historial de chat"
              >
                Borrar Chat
              </button>
            )}
          </div>
          <div className={styles.chatHistory}>
              {localChatHistory.map((msg, index) => (
                  <div key={index} className={`${styles.chatMessage} ${msg.role === 'user' ? styles.userMessage : styles.modelMessage}`}>
                      <div className={styles.chatMessageHeader}>
                        <strong>{msg.role === 'user' ? 'Tú' : 'IA'}:</strong>
                        {msg.timestamp && <span className={styles.timestamp}>{msg.timestamp}</span>}
                      </div>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
              ))}
              {chatLoading && <p className={styles.typingIndicator}>Escribiendo...</p>}
          </div>
        </div>
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
  )
}
