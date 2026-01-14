import { useEffect } from 'react'
import { useFormsStore } from '../store/forms'
import { usePreferencesStore } from '../store/preferences'
import { useTopLevelCategoriesStore } from '../store/useTopLevelCategoriesStore'
import ContextualColMenu from './ContextualColMenu'
import ContextLinkMenu from './ContextualMenu'
import AddDesktopForm from './Forms/AddDesktopForm'
import AddLinkForm from './Forms/AddLinkForm'
import DeleteColConfirmForm from './Forms/DeleteColConfirmForm'
import DeleteDesktopConfirmForm from './Forms/DeleteDesktopConfirmForm'
import DeleteLinkForm from './Forms/DeleteLinkForm'
import EditLinkForm from './Forms/EditLinkForm'
import MoveOtherDeskForm from './Forms/MoveOtherDeskForm'
import Search from './Search'

export default function FormsContainer () {
  const linkContextMenuVisible = useFormsStore(state => state.linkContextMenuVisible)
  const setContextMenuVisible = useFormsStore(state => state.setContextMenuVisible)
  const points = useFormsStore(state => state.points)
  const setPoints = useFormsStore(state => state.setPoints)
  const activeLink = useFormsStore(state => state.activeLink)
  const activeElement = useFormsStore(state => state.activeElement)
  const moveFormVisible = useFormsStore(state => state.moveFormVisible)
  const setMoveFormVisible = useFormsStore(state => state.setMoveFormVisible)
  const columnContextMenuVisible = useFormsStore(state => state.columnContextMenuVisible)
  const setColumnContextMenuVisible = useFormsStore(state => state.setColumnContextMenuVisible)
  const activeColumn = useFormsStore(state => state.activeColumn)
  const topLevelCategoriesStore = useTopLevelCategoriesStore(state => state.topLevelCategoriesStore)
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
        <EditLinkForm />
        <DeleteLinkForm params={links} />
        <MoveOtherDeskForm
            moveFormVisible={moveFormVisible}
            setMoveFormVisible={setMoveFormVisible}
            params={links}
        />
        <AddLinkForm params={activeColumn} />
        <DeleteColConfirmForm params={activeColumn} />
        <AddDesktopForm />
        <DeleteDesktopConfirmForm />
        <ContextLinkMenu
          visible={linkContextMenuVisible}
          setVisible={setContextMenuVisible}
          points={points}
          setPoints={setPoints}
          params={links}
          setMoveFormVisible={setMoveFormVisible}
        />
        <ContextualColMenu
          visible={columnContextMenuVisible}
          points={points}
          setPoints={setPoints}
          params={activeColumn}
          desktops={topLevelCategoriesStore}
        />
        <Search />
        </>
  )
}
