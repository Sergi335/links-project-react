import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import EditLinkForm from './EditLinkForm'
import DeleteLinkForm from './DeleteLinkForm'
import MoveOtherDeskForm from './MoveOtherDeskForm'
import ContextLinkMenu from './ContextualMenu'
import ContextualColMenu from './ContextualColMenu'
// import CustomizeDesktopPanel from './CustomizeDesktopPanel'
import AddLinkForm from './AddLinkForm'
import DeleteColConfirmForm from './DeleteColConfirmForm'
import { useFormsStore } from '../store/forms'
import { useColumnsStore } from '../store/columns'
import { useDesktopsStore } from '../store/desktops'

export default function FormsContainer () {
  const { desktopName } = useParams()
  const linkContextMenuVisible = useFormsStore(state => state.linkContextMenuVisible)
  const setContextMenuVisible = useFormsStore(state => state.setContextMenuVisible)
  const points = useFormsStore(state => state.points)
  const editFormVisible = useFormsStore(state => state.editFormVisible)
  console.log('🚀 ~ file: FormsContainer.jsx:21 ~ FormsContainer ~ editFormVisible:', editFormVisible)
  const setEditFormVisible = useFormsStore(state => state.setEditFormVisible)
  const activeLink = useFormsStore(state => state.activeLink)
  const activeElement = useFormsStore(state => state.activeElement)
  const deleteFormVisible = useFormsStore(state => state.deleteFormVisible)
  const setDeleteFormVisible = useFormsStore(state => state.setDeleteFormVisible)
  const deleteColFormVisible = useFormsStore(state => state.deleteColFormVisible)
  const setDeleteColFormVisible = useFormsStore(state => state.setDeleteColFormVisible)
  const moveFormVisible = useFormsStore(state => state.moveFormVisible)
  const setMoveFormVisible = useFormsStore(state => state.setMoveFormVisible)
  // const customizePanelVisible = useFormsStore(state => state.customizePanelVisible)
  // const setCustomizePanelVisible = useFormsStore(state => state.setCustomizePanelVisible)
  const addLinkFormVisible = useFormsStore(state => state.addLinkFormVisible)
  const setAddLinkFormVisible = useFormsStore(state => state.setAddLinkFormVisible)
  const columnContextMenuVisible = useFormsStore(state => state.columnContextMenuVisible)
  const setColumnContextMenuVisible = useFormsStore(state => state.setColumnContextMenuVisible)
  const activeColumn = useFormsStore(state => state.activeColumn)
  const columnsStore = useColumnsStore(state => state.columnsStore)
  const setColumnsStore = useColumnsStore(state => state.setColumnsStore)
  const desktopsStore = useDesktopsStore(state => state.desktopsStore)

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
          {/* {
            customizePanelVisible
              ? <CustomizeDesktopPanel
                  customizePanelVisible={customizePanelVisible}
            />
              : null
          } */}
          {
            addLinkFormVisible
              ? <AddLinkForm
                  setFormVisible={setAddLinkFormVisible}
                  params={activeColumn}
                  desktopName={desktopName}
                  />
              : null
          }
          {
            columnContextMenuVisible
              ? <ContextualColMenu
                  visible={columnContextMenuVisible}
                  points={points}
                  params={activeColumn}
                  desktopColumns={columnsStore}
                  setDesktopColumns={setColumnsStore}
                  desktops={desktopsStore}
                  setAddLinkFormVisible={setAddLinkFormVisible}
                  // addLinkFormVisible={addLinkFormVisible}
                  // handleEditable={handleEditable}
                />
              : null
          }
          {
            deleteColFormVisible
              ? <DeleteColConfirmForm
                visible={deleteColFormVisible}
                setVisible={setDeleteColFormVisible}
                itemType='columna'
                params={activeColumn}
              />
              : null
          }
        </>
  )
}
