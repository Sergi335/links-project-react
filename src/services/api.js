import { useSessionStore } from '../store/session'

/**
 * Custom fetch wrapper to handle CSRF token renewal and automatic retries.
 * @param {string} url - The URL to fetch.
 * @param {object} options - Fetch options.
 * @returns {Promise<any>} - The response data.
 */

const buildFetchOptions = (options = {}, csrfToken = useSessionStore.getState().csfrtoken || '') => ({
  ...options,
  headers: {
    ...options.headers,
    'x-csrf-token': csrfToken
  },
  credentials: 'include'
})

const ensureSuccessfulResponse = async (url, options, response) => {
  if (response.ok) return response

  let errorData
  try {
    errorData = await response.clone().json()
  } catch (e) {
    throw response
  }

  if (errorData && errorData.csrfError === true) {
    console.warn('CSRF Error detected, renewing token and retrying...')
    const newToken = await useSessionStore.getState().fetchCsrfToken()

    if (!newToken) {
      throw new Error('Failed to renew CSRF token')
    }

    const retryResponse = await fetch(url, buildFetchOptions(options, newToken))
    if (!retryResponse.ok) {
      let retryError
      try {
        retryError = await retryResponse.clone().json()
      } catch (e) {
        throw retryResponse
      }
      throw retryError || retryResponse
    }

    return retryResponse
  }

  throw errorData || response
}

export const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, buildFetchOptions(options))
  const validatedResponse = await ensureSuccessfulResponse(url, options, response)
  return await validatedResponse.json()
}

const createStreamAccumulator = ({ onChunk }) => {
  let fullText = ''
  let finalPayload = null

  const appendChunk = (chunk, payload = null) => {
    if (!chunk) return
    fullText += chunk
    onChunk?.(fullText, chunk, { ...(payload || {}), isStreaming: true })
  }

  const handlePayload = (payload) => {
    if (payload == null) return

    if (typeof payload === 'string') {
      const trimmedPayload = payload.trim()
      if (!trimmedPayload || trimmedPayload === '[DONE]') return

      try {
        handlePayload(JSON.parse(trimmedPayload))
        return
      } catch {
        appendChunk(payload)
        return
      }
    }

    if (typeof payload !== 'object') return

    if (payload.error) {
      throw new Error(payload.error?.message || payload.error || 'Streaming error')
    }

    const chunk =
      payload.delta ??
      payload.token ??
      payload.chunk ??
      payload.content ??
      payload.text ??
      payload.answerChunk ??
      payload.summaryChunk ??
      payload.message?.content

    if (typeof chunk === 'string') {
      appendChunk(chunk, payload)
    }

    if (
      payload.done ||
      payload.type === 'done' ||
      payload.summary ||
      payload.answer ||
      payload.history ||
      payload.chatHistory
    ) {
      finalPayload = payload
    }
  }

  return {
    appendChunk,
    handlePayload,
    getResult: () => ({
      fullText,
      finalPayload
    })
  }
}

export const apiStream = async (url, options = {}, { onChunk } = {}) => {
  const initialResponse = await fetch(url, buildFetchOptions(options))
  const response = await ensureSuccessfulResponse(url, options, initialResponse)

  if (!response.body) {
    throw new Error('Streaming response body is not available')
  }

  const contentType = response.headers.get('content-type') || ''
  const isSSE = contentType.includes('text/event-stream')
  const isJson = contentType.includes('application/json')

  if (isJson) {
    const jsonData = await response.json()
    const payload = jsonData?.data ?? jsonData
    const fullText =
      payload?.summary ??
      payload?.answer ??
      payload?.content ??
      payload?.text ??
      ''

    if (fullText) {
      onChunk?.(fullText, fullText, payload)
    }

    return {
      success: true,
      data: {
        ...payload,
        isStreaming: false,
        text: fullText
      }
    }
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  const accumulator = createStreamAccumulator({ onChunk })
  let sseBuffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const decodedChunk = decoder.decode(value, { stream: true })

    if (!isSSE) {
      accumulator.appendChunk(decodedChunk)
      continue
    }

    sseBuffer += decodedChunk
    const events = sseBuffer.split('\n\n')
    sseBuffer = events.pop() || ''

    for (const event of events) {
      const lines = event
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean)

      for (const line of lines) {
        if (!line.startsWith('data:')) continue
        accumulator.handlePayload(line.slice(5).trimStart())
      }
    }
  }

  if (isSSE && sseBuffer.trim()) {
    const lines = sseBuffer
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)

    for (const line of lines) {
      if (!line.startsWith('data:')) continue
      accumulator.handlePayload(line.slice(5).trimStart())
    }
  }

  const { fullText, finalPayload } = accumulator.getResult()

  return {
    success: true,
    data: {
      ...(finalPayload || {}),
      isStreaming: true,
      text: fullText
    }
  }
}
