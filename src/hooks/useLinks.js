import { useReducer } from 'react'
import { useGlobalStore } from '../store/global'

const initialState = useGlobalStore(state => state.globalLinks)

function reducer (state = initialState, action) {
  switch (action.type) {
    case 'add':
      return [...state, action.payload]
    case 'remove':
      return state.filter(link => link._id !== action.payload)
    case 'update':
      return state.map(link => link._id === action.payload._id ? action.payload : link)
    default:
      return state
  }
}

export function useLinks () {
  const [state, dispatch] = useReducer(reducer, initialState)

  return {
    state,
    dispatch
  }
}
