import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'react-toastify'
import { chatWithVideo, deleteAIChat, deleteAISummary, generateSummary, getLinkById } from '../../services/dbQueries'
import { useGlobalStore } from '../../store/global'
import styles from './LinkDetailsTabs.module.css'

export default function LinkDetailsSummary ({ data }) {
  const summaryLoadingMessages = [
    'Generando resumen...',
    'Esto tardara un poco, estamos trabajando en ello...',
    'Analizando el contenido para darte un buen resumen...',
    'Casi listo, preparando la respuesta...'
  ]
  const [loading, setLoading] = useState(false)
  const summaryContentRef = useRef(null)
  const chatHistoryRef = useRef(null)
  const summaryTypingFrameRef = useRef(null)
  const chatTypingFrameRef = useRef(null)
  const chatScrollFrameRef = useRef(null)
  const isChatStreamingRef = useRef(false)
  const shouldStickChatToBottomRef = useRef(true)
  const globalLinks = useGlobalStore(state => state.globalLinks)
  const setGlobalLinks = useGlobalStore(state => state.setGlobalLinks)
  const [chatMessage, setChatMessage] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [streamingSummary, setStreamingSummary] = useState('')
  const [displayedSummary, setDisplayedSummary] = useState('')
  const [animateSummary, setAnimateSummary] = useState(false)
  const [summaryLoadingMessageIndex, setSummaryLoadingMessageIndex] = useState(0)

  // Si no hay historial en la respuesta, lo inicializamos vacio
  const [localChatHistory, setLocalChatHistory] = useState(data?.chatHistory || [])

  const animateTyping = ({ frameRef, currentText, nextText, setText, baseStep = 2, fastStep = 8 }) => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current)
    }

    if (!nextText) {
      setText('')
      return
    }

    if (nextText.length <= currentText.length) {
      setText(nextText)
      return
    }

    let typedText = currentText

    const tick = () => {
      if (typedText.length >= nextText.length) {
        setText(nextText)
        return
      }

      const remaining = nextText.length - typedText.length
      const step = remaining > 80 ? fastStep : baseStep
      typedText = nextText.slice(0, typedText.length + step)
      setText(typedText)

      if (typedText.length < nextText.length) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
  }

  const updateLinkInStore = (updater) => {
    const currentLinks = useGlobalStore.getState().globalLinks
    const elementIndex = currentLinks.findIndex(link => link?._id === data?._id)
    if (elementIndex === -1) return null

    const currentLink = currentLinks[elementIndex]
    const updatedLink = typeof updater === 'function' ? updater(currentLink) : { ...currentLink, ...updater }
    const newState = [...currentLinks]
    newState[elementIndex] = updatedLink
    setGlobalLinks(newState)
    return updatedLink
  }

  const scrollChatToBottom = ({ force = false } = {}) => {
    const container = chatHistoryRef.current
    if (!container) return
    if (!force && !shouldStickChatToBottomRef.current) return

    if (chatScrollFrameRef.current) {
      cancelAnimationFrame(chatScrollFrameRef.current)
    }

    chatScrollFrameRef.current = requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight
    })
  }

  const handleChatScroll = () => {
    const container = chatHistoryRef.current
    if (!container) return

    const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    shouldStickChatToBottomRef.current = distanceToBottom < 48
  }

  useEffect(() => {
    if (isChatStreamingRef.current) return

    const currentGlobalLinks = useGlobalStore.getState().globalLinks
    if (data?.chatHistory && data.chatHistory.length > 0) {
      setLocalChatHistory(data.chatHistory)
    } else {
      const linkInStore = currentGlobalLinks.find(link => link?._id === data?._id)
      if (linkInStore?.chatHistory) {
        setLocalChatHistory(linkInStore.chatHistory)
      } else {
        const fetchFullLink = async () => {
          try {
            const result = await getLinkById({ id: data?._id })
            if (result.success && result.data?.chatHistory) {
              setLocalChatHistory(result.data.chatHistory)
              updateLinkInStore(link => ({ ...link, chatHistory: result.data.chatHistory }))
            }
          } catch (error) {
            console.error('Error fetching full link details:', error)
          }
        }

        if (data?._id) {
          fetchFullLink()
        }
      }
    }
  }, [data?._id, data?.chatHistory])

  useEffect(() => {
    return () => {
      if (summaryTypingFrameRef.current) cancelAnimationFrame(summaryTypingFrameRef.current)
      if (chatTypingFrameRef.current) cancelAnimationFrame(chatTypingFrameRef.current)
      if (chatScrollFrameRef.current) cancelAnimationFrame(chatScrollFrameRef.current)
    }
  }, [])

  useEffect(() => {
    if (!loading) {
      setSummaryLoadingMessageIndex(0)
      return
    }

    const intervalId = window.setInterval(() => {
      setSummaryLoadingMessageIndex(prev => (prev + 1) % summaryLoadingMessages.length)
    }, 8400)

    return () => window.clearInterval(intervalId)
  }, [loading])

  const handleGenerateSummary = async () => {
    setLoading(true)
    setStreamingSummary('')
    let hasStartedTyping = false

    const previousSummary = globalLinks.find(link => link?._id === data?._id)?.summary ?? data?.summary ?? null

    const result = await generateSummary({
      linkId: data?._id,
      onChunk: (fullText, chunk, meta) => {
        const isStreaming = meta?.isStreaming === true
        setAnimateSummary(isStreaming)
        if (!hasStartedTyping && fullText) {
          hasStartedTyping = true
          setLoading(false)
        }
        setStreamingSummary(fullText)
        if (!isStreaming) {
          setDisplayedSummary(fullText)
        }
        updateLinkInStore(link => ({ ...link, summary: fullText }))
      }
    })

    if (result.success) {
      const summaryContent = result.data?.summary ||
        (Array.isArray(result.data) ? result.data[0]?.summary : null) ||
        (typeof result.data === 'string' ? result.data : null) ||
        ''

      if (!summaryContent) {
        updateLinkInStore(link => ({ ...link, summary: previousSummary }))
        setDisplayedSummary(previousSummary || '')
        toast.error('No se pudo extraer el contenido del resumen')
      } else {
        setAnimateSummary(result.data?.isStreaming === true)
        if (result.data?.isStreaming !== true) {
          setDisplayedSummary(summaryContent)
        }
        updateLinkInStore(link => ({ ...link, summary: summaryContent }))
        toast.success('Resumen generado correctamente')
      }
    } else {
      updateLinkInStore(link => ({ ...link, summary: previousSummary }))
      setDisplayedSummary(previousSummary || '')
      toast.error(result.message)
    }

    if (!hasStartedTyping) {
      setLoading(false)
    }
    setStreamingSummary('')
  }

  const handleDeleteSummary = async () => {
    if (!window.confirm('Estas seguro de que quieres borrar el resumen?')) return

    setLoading(true)
    try {
      const result = await deleteAISummary(data?._id)

      if (result.success) {
        setStreamingSummary('')
        updateLinkInStore(link => ({ ...link, summary: null }))
        toast.success('Resumen borrado correctamente')
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

  const getSummaryPlainText = (content) => {
    if (!content) return ''

    return content
      .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, ''))
      .replace(/`([^`]+)`/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/^>\s?/gm, '')
      .replace(/^#{1,6}\s*/gm, '')
      .replace(/^\s*[-*+]\s+/gm, '- ')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  const handleCopySummary = async () => {
    if (!summary) return

    try {
      await navigator.clipboard.writeText(getSummaryPlainText(summary))
      toast.success('Resumen copiado al portapapeles')
    } catch (error) {
      console.error(error)
      toast.error('No se pudo copiar el resumen')
    }
  }

  const handlePrintSummary = () => {
    if (!summaryContentRef.current) return

    const printWindow = window.open('', '_blank', 'width=900,height=700')

    if (!printWindow) {
      toast.error('No se pudo abrir la ventana de impresion')
      return
    }

    const summaryHtml = summaryContentRef.current.innerHTML

    printWindow.document.write(`
      <html>
        <head>
          <title>Resumen del Video</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 32px;
              color: #111827;
              line-height: 1.5;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
            }
            p, ul, ol {
              margin-bottom: 1rem;
            }
            ul, ol {
              padding-left: 1.5rem;
            }
          </style>
        </head>
        <body>
          <h1>Resumen del Video</h1>
          ${summaryHtml}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  const handleDeleteChat = async () => {
    if (!window.confirm('Estas seguro de que quieres borrar el historial del chat?')) return

    setChatLoading(true)
    try {
      const result = await deleteAIChat(data?._id)

      if (result.success) {
        setLocalChatHistory([])
        updateLinkInStore(link => ({ ...link, chatHistory: [] }))
        toast.success('Chat borrado correctamente')
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

    const timestamp = new Date().toLocaleString()
    const assistantTimestamp = new Date().toLocaleString()
    const assistantMessageId = `stream-${Date.now()}`
    const optimisticHistory = [
      ...localChatHistory,
      { role: 'user', content: newMessage, timestamp },
      { id: assistantMessageId, role: 'model', content: '', timestamp: assistantTimestamp, streaming: true }
    ]

    isChatStreamingRef.current = true
    shouldStickChatToBottomRef.current = true
    setLocalChatHistory(optimisticHistory)
    updateLinkInStore(link => ({ ...link, chatHistory: optimisticHistory }))
    scrollChatToBottom({ force: true })

    const result = await chatWithVideo({
      linkId: data?._id,
      message: newMessage,
      onChunk: (fullText, chunk, meta) => {
        if (meta?.isStreaming !== true) {
          const nonStreamHistory = optimisticHistory.map(msg => (
            msg.id === assistantMessageId
              ? { ...msg, content: fullText, streaming: false }
              : msg
          ))
          setLocalChatHistory(nonStreamHistory)
          updateLinkInStore(link => ({ ...link, chatHistory: nonStreamHistory }))
          scrollChatToBottom()
          return
        }

        setLocalChatHistory(currentHistory => {
          const existingMessage = currentHistory.find(msg => msg.id === assistantMessageId)
          const currentDisplayedText = existingMessage?.content || ''

          animateTyping({
            frameRef: chatTypingFrameRef,
            currentText: currentDisplayedText,
            nextText: fullText,
            setText: (typedText) => {
              setLocalChatHistory(latestHistory => {
                const streamedHistory = latestHistory.map(msg => (
                  msg.id === assistantMessageId
                    ? { ...msg, content: typedText, streaming: typedText.length < fullText.length }
                    : msg
                ))
                scrollChatToBottom()
                return streamedHistory
              })
            }
          })

          return currentHistory
        })
      }
    })

    if (result.success) {
      let updatedHistory = []

      if (result.data?.history) {
        updatedHistory = result.data.history.map(msg => ({
          ...msg,
          timestamp: msg?.timestamp || new Date().toLocaleString()
        }))
      } else if (result.data?.answer) {
        updatedHistory = optimisticHistory.map(msg => (
          msg.id === assistantMessageId
            ? { ...msg, content: result.data.answer, streaming: false }
            : msg
        ))
      }

      if (updatedHistory.length > 0) {
        setLocalChatHistory(updatedHistory)
        updateLinkInStore(link => ({ ...link, chatHistory: updatedHistory }))
        scrollChatToBottom()
      }
    } else {
      const rolledBackHistory = optimisticHistory.filter(msg => msg.id !== assistantMessageId)
      setLocalChatHistory(rolledBackHistory)
      updateLinkInStore(link => ({ ...link, chatHistory: rolledBackHistory }))
      toast.error(result.message)
    }

    isChatStreamingRef.current = false
    setChatLoading(false)
  }

  const linkInStore = globalLinks.find(link => link?._id === data?._id)
  const summary = streamingSummary || (linkInStore ? linkInStore.summary : data?.summary)

  useEffect(() => {
    if (!animateSummary) {
      setDisplayedSummary(summary || '')
      return
    }

    animateTyping({
      frameRef: summaryTypingFrameRef,
      currentText: displayedSummary,
      nextText: summary || '',
      setText: setDisplayedSummary
    })
  }, [summary, animateSummary])

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.scrollableContent} style={summary ? { justifyContent: 'start' } : {}}>
        <div className={styles.summaryBlock}>
          <div className={styles.summaryHeader}>
            {summary && (
              <>
                <h3>Resumen del Video</h3>
                <div className={styles.summaryActions}>
                  <button
                    className={styles.secondaryActionButton}
                    onClick={handleCopySummary}
                    disabled={loading || !summary}
                    title="Copiar resumen"
                    type="button"
                  >
                    Copiar
                  </button>
                  <button
                    className={styles.secondaryActionButton}
                    onClick={handlePrintSummary}
                    disabled={loading || !summary}
                    title="Imprimir resumen"
                    type="button"
                  >
                    Imprimir
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={handleDeleteSummary}
                    disabled={loading}
                    title="Borrar resumen"
                    type="button"
                  >
                    Borrar
                  </button>
                </div>
              </>
            )}
          </div>
          {summary
            ? (
            <>
              {loading && (
                <div className={styles.summaryLoadingState}>
                  <span className={styles.loader}></span>
                  <p className={styles.typingIndicator}>{summaryLoadingMessages[summaryLoadingMessageIndex]}</p>
                </div>
              )}
              <div ref={summaryContentRef} className={styles.markdownContent}>
                <ReactMarkdown>{displayedSummary}</ReactMarkdown>
              </div>
            </>
              )
            : (
            <div className={styles.emptyState} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              {loading && (
                <div className={styles.summaryLoadingState}>
                  <span className={styles.loader}></span>
                  <p className={styles.typingIndicator}>{summaryLoadingMessages[summaryLoadingMessageIndex]}</p>
                </div>
              )}
              <button
                className={styles.generateButton}
                onClick={handleGenerateSummary}
                disabled={loading}
              >
                {loading ? 'Generando...' : 'Generar Resumen con IA'}
              </button>
            </div>
              )}
        </div>

        <div className={styles.chatBlock}>
          <div className={styles.summaryHeader}>
            {localChatHistory.length > 0 && (
            <>
            <h3>Chat con el Video</h3>
              <button
                className={styles.deleteButton}
                onClick={handleDeleteChat}
                disabled={chatLoading}
                title="Borrar historial de chat"
              >
                Borrar Chat
              </button>
            </>
            )}
          </div>
          <div ref={chatHistoryRef} className={styles.chatHistory} onScroll={handleChatScroll}>
            {localChatHistory?.map((msg, index) => (
              <div key={msg?.id || index} className={`${styles.chatMessage} ${msg?.role === 'user' ? styles.userMessage : styles.modelMessage}`}>
                <div className={styles.chatMessageHeader}>
                  <strong>{msg?.role === 'user' ? 'Tu' : 'IA'}:</strong>
                  {msg?.timestamp && <span className={styles.timestamp}>{msg.timestamp}</span>}
                </div>
                <ReactMarkdown>{msg?.content}</ReactMarkdown>
              </div>
            ))}
            {chatLoading && <p className={styles.typingIndicator}>Pensando...</p>}
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
