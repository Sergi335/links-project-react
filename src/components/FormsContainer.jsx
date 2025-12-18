import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useFormsStore } from '../store/forms'
import { usePreferencesStore } from '../store/preferences'
import { useTopLevelCategoriesStore } from '../store/useTopLevelCategoriesStore'
import ContextualColMenu from './ContextualColMenu'
import ContextLinkMenu from './ContextualMenu'
import AddDesktopForm from './Forms/AddDesktopForm'
import AddLinkForm from './Forms/AddLinkForm'
import DeleteColConfirmForm from './Forms/DeleteColConfirmForm'
import DeleteConfirmForm from './Forms/DeleteConfirmForm'
import DeleteLinkForm from './Forms/DeleteLinkForm'
import EditLinkForm from './Forms/EditLinkForm'
import MoveOtherDeskForm from './Forms/MoveOtherDeskForm'
import Search from './Search'

export default function FormsContainer () {
  const { desktopName } = useParams()
  const linkContextMenuVisible = useFormsStore(state => state.linkContextMenuVisible)
  const setContextMenuVisible = useFormsStore(state => state.setContextMenuVisible)
  const points = useFormsStore(state => state.points)
  const setPoints = useFormsStore(state => state.setPoints)
  const editFormVisible = useFormsStore(state => state.editFormVisible)
  const setEditFormVisible = useFormsStore(state => state.setEditFormVisible)
  const activeLink = useFormsStore(state => state.activeLink)
  const activeElement = useFormsStore(state => state.activeElement)
  const deleteFormVisible = useFormsStore(state => state.deleteFormVisible)
  const setDeleteFormVisible = useFormsStore(state => state.setDeleteFormVisible)
  const deleteColFormVisible = useFormsStore(state => state.deleteColFormVisible)
  const setDeleteColFormVisible = useFormsStore(state => state.setDeleteColFormVisible)
  const moveFormVisible = useFormsStore(state => state.moveFormVisible)
  const setMoveFormVisible = useFormsStore(state => state.setMoveFormVisible)
  const addLinkFormVisible = useFormsStore(state => state.addLinkFormVisible)
  const setAddLinkFormVisible = useFormsStore(state => state.setAddLinkFormVisible)
  const columnContextMenuVisible = useFormsStore(state => state.columnContextMenuVisible)
  const setColumnContextMenuVisible = useFormsStore(state => state.setColumnContextMenuVisible)
  const activeColumn = useFormsStore(state => state.activeColumn)
  const topLevelCategoriesStore = useTopLevelCategoriesStore(state => state.topLevelCategoriesStore)
  const addDeskFormVisible = useFormsStore(state => state.addDeskFormVisible)
  const deleteConfFormVisible = useFormsStore(state => state.deleteConfFormVisible)
  const setDeleteConfFormVisible = useFormsStore(state => state.setDeleteConfFormVisible)
  const selectedLinks = usePreferencesStore(state => state.selectedLinks)
  const links = selectedLinks.length > 0 ? selectedLinks : activeLink

  // Ocultar context menus
  useEffect(() => {
    const handleClick = (event) => {
      if (event.target.parentNode?.nodeName === 'A') return
      const id = event.target.parentNode?.id
      const element = document.getElementById('editLinkForm')
      const ids = ['contextLinkMenu', 'editLinkForm']
      if (ids.includes(id) || element?.contains(event.target)) return
      setContextMenuVisible(false)
      setColumnContextMenuVisible(false)
    }
    const handleContextLinkOutside = (event) => {
      if (activeElement === null) return
      if (!activeElement.contains(event.target)) {
        setContextMenuVisible(false)
      }
    }
    const handleContextColOutside = (event) => {
      if (event.target.parentNode.nodeName !== 'DIV') {
        setColumnContextMenuVisible(false)
      }
    }
    window.addEventListener('contextmenu', handleContextColOutside)
    window.addEventListener('contextmenu', handleContextLinkOutside)
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('contextmenu', handleContextColOutside)
      window.removeEventListener('contextmenu', handleContextLinkOutside)
      window.removeEventListener('click', handleClick)
    }
  }, [activeElement])

  return (
        <>
        <EditLinkForm
            formVisible={editFormVisible}
            setFormVisible={setEditFormVisible}
        />
        <DeleteLinkForm
            deleteFormVisible={deleteFormVisible}
            setDeleteFormVisible={setDeleteFormVisible}
            params={links}
        />
        <MoveOtherDeskForm
            moveFormVisible={moveFormVisible}
            setMoveFormVisible={setMoveFormVisible}
            params={links}
        />
        <AddLinkForm
            setFormVisible={setAddLinkFormVisible}
            params={activeColumn}
            desktopName={desktopName}
            formVisible={addLinkFormVisible}
        />
         <DeleteColConfirmForm
            visible={deleteColFormVisible}
            setVisible={setDeleteColFormVisible}
            itemType='columna'
            params={activeColumn}
        />
        <AddDesktopForm
            visible={addDeskFormVisible}
        />
        <DeleteConfirmForm
            visible={deleteConfFormVisible}
            setVisible={setDeleteConfFormVisible}
            itemType='escritorio'
        />
          {
            linkContextMenuVisible
              ? <ContextLinkMenu
                  visible={linkContextMenuVisible}
                  setVisible={setContextMenuVisible}
                  points={points}
                  setPoints={setPoints}
                  params={links}
                  setEditFormVisible={setEditFormVisible}
                  setDeleteFormVisible={setDeleteFormVisible}
                  setMoveFormVisible={setMoveFormVisible}
                />
              : null
          }
          {
            columnContextMenuVisible
              ? <ContextualColMenu
                  visible={columnContextMenuVisible}
                  points={points}
                  setPoints={setPoints}
                  params={activeColumn}
                  desktops={topLevelCategoriesStore}
                  setAddLinkFormVisible={setAddLinkFormVisible}
                />
              : null
          }
          <Search />
        </>
  )
}
