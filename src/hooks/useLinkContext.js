import { useReducer } from 'react'

const initialState = {
  linkContextMenuVisible: false,
  points: { x: 0, y: 0 },
  editFormVisible: false,
  deleteFormVisible: false,
  moveOtherDeskVisible: false
}

function reducer (state, action) {
  const { type } = action

  if (type === 'SHOW_CONTEXT_MENU') {
    return {
      ...state,
      linkContextMenuVisible: action.payload.flag,
      points: { x: action.payload.x, y: action.payload.y }
    }
  }
  if (type === 'SHOW_EDIT_FORM') {
    return {
      ...state,
      editFormVisible: true,
      linkContextMenuVisible: false,
      moveOtherDeskVisible: false,
      deleteFormVisible: false
    }
  }
  if (type === 'SHOW_DELETE_FORM') {
    return {
      ...state,
      deleteFormVisible: true
    }
  }
  if (type === 'SHOW_MOVE_FORM') {
    return {
      ...state,
      moveOtherDeskVisible: true
    }
  }
  if (type === 'HIDE_ALL_FORMS') {
    return {
      ...state,
      linkContextMenuVisible: false,
      moveOtherDeskVisible: false,
      editFormVisible: false,
      deleteFormVisible: false
    }
  }
}

export function useLinkContext () {
  const [{
    linkContextMenuVisible,
    points,
    editFormVisible,
    deleteFormVisible,
    moveOtherDeskVisible

  }, dispatch] = useReducer(reducer, initialState)
  // //console.log(editFormVisible)
  const setContextMenuVisible = (event, flag) => {
    event.preventDefault()
    dispatch({ type: 'SHOW_CONTEXT_MENU', payload: { x: event.pageX, y: event.pageY, flag } })
  }
  const setEditFormVisible = (event) => {
    dispatch({ type: 'SHOW_EDIT_FORM' })
  }
  const hideAllForms = (event) => {
    dispatch({ type: 'HIDE_ALL_FORMS' })
  }

  return {
    linkContextMenuVisible,
    points,
    editFormVisible,
    deleteFormVisible,
    moveOtherDeskVisible,
    setContextMenuVisible,
    hideAllForms,
    setEditFormVisible
  }
}
