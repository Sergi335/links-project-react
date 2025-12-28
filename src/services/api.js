import { useSessionStore } from '../store/session'

/**
 * Custom fetch wrapper to handle CSRF token renewal and automatic retries.
 * @param {string} url - The URL to fetch.
 * @param {object} options - Fetch options.
 * @returns {Promise<any>} - The response data.
 */
export const apiFetch = async (url, options = {}) => {
  const fetchWithToken = async () => {
    const fetchOptions = {
      ...options,
      headers: {
        ...options.headers,
        'x-csrf-token': useSessionStore.getState().csfrtoken || ''
      },
      credentials: 'include'
    }

    const response = await fetch(url, fetchOptions)

    // Si no es ok y no es un error de CSRF, lanzamos el error enseguida
    if (!response.ok) {
      // Intentamos parsear el error para ver si es CSRF
      let errorData
      try {
        errorData = await response.clone().json()
      } catch (e) {
        // No es JSON, lanzamos error normal
        throw response
      }

      // Si el backend nos indica que es un error de CSRF
      if (errorData && errorData.csrfError === true) {
        console.warn('CSRF Error detected, renewing token and retrying...')
        const newToken = await useSessionStore.getState().fetchCsrfToken()

        if (newToken) {
          // Reintentamos con el nuevo token
          const retryOptions = {
            ...options,
            headers: {
              ...options.headers,
              'x-csrf-token': newToken
            },
            credentials: 'include'
          }
          const retryResponse = await fetch(url, retryOptions)
          if (!retryResponse.ok) throw retryResponse
          return await retryResponse.json()
        } else {
          throw new Error('Failed to renew CSRF token')
        }
      }

      throw errorData || response
    }

    return await response.json()
  }

  return fetchWithToken()
}
