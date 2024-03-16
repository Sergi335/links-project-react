export function useTitle ({ title }) {
  document.title = title ? `${title} - Zenmarks` : ''
}
