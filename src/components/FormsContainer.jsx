import { useEffect } from 'react'
import EditLinkForm from './EditLinkForm'
import DeleteLinkForm from './DeleteLinkForm'
import MoveOtherDeskForm from './MoveOtherDeskForm'
import ContextLinkMenu from './ContextualMenu'
import { useFormsStore } from '../store/forms'

export default function FormsContainer () {
  const linkContextMenuVisible = useFormsStore(state => state.linkContextMenuVisible)
  const setContextMenuVisible = useFormsStore(state => state.setContextMenuVisible)
  const points = useFormsStore(state => state.points)
  const editFormVisible = useFormsStore(state => state.editFormVisible)
  const setEditFormVisible = useFormsStore(state => state.setEditFormVisible)
  const activeLink = useFormsStore(state => state.activeLink)
  const activeElement = useFormsStore(state => state.activeElement)
  const deleteFormVisible = useFormsStore(state => state.deleteFormVisible)
  const setDeleteFormVisible = useFormsStore(state => state.setDeleteFormVisible)
  const moveFormVisible = useFormsStore(state => state.moveFormVisible)
  const setMoveFormVisible = useFormsStore(state => state.setMoveFormVisible)

  // Ocultar context menu
  useEffect(() => {
    const handleClick = (event) => {
      if (event.target.parentNode.nodeName === 'A') return
      const id = event.target.parentNode.id
      const element = document.getElementById('editLinkForm')
      const ids = ['contextLinkMenu', 'editLinkForm']
      if (ids.includes(id) || element?.contains(event.target)) return
      setContextMenuVisible(false)
    }
    const handleContextOutside = (event) => {
      if (activeElement === null) return
      if (!activeElement.contains(event.target)) {
        setContextMenuVisible(false)
      }
    }
    window.addEventListener('contextmenu', handleContextOutside)
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('contextmenu', handleContextOutside)
      window.removeEventListener('click', handleClick)
    }
  }, [activeElement])
  return (
        <>
          {
            linkContextMenuVisible
              ? <ContextLinkMenu
                  visible={linkContextMenuVisible}
                  setVisible={setContextMenuVisible}
                  points={points}
                  params={activeLink}
                  setEditFormVisible={setEditFormVisible}
                  setDeleteFormVisible={setDeleteFormVisible}
                  setMoveFormVisible={setMoveFormVisible}
                />
              : null
          }
          {
            editFormVisible
              ? <EditLinkForm
                    formVisible={editFormVisible}
                    setFormVisible={setEditFormVisible}
                    params={activeLink}
                />
              : null
          }
          {
            deleteFormVisible
              ? <DeleteLinkForm
                  deleteFormVisible={deleteFormVisible}
                  setDeleteFormVisible={setDeleteFormVisible}
                  params={activeLink}
                />
              : null
          }
          {
            moveFormVisible
              ? <MoveOtherDeskForm
                  moveFormVisible={moveFormVisible}
                  setMoveFormVisible={setMoveFormVisible}
                  params={activeLink}
                />
              : null
          }
        </>
  )
}
