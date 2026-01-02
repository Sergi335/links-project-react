import LogoDisplay from './LogoDisplay'
import MultiLevelDragDrop from './newSideBarNav'
import { ResizableContainer } from './ResizableContainer'
import styles from './SideBar.module.css'

export default function SideBar () {
  return (
    <ResizableContainer id='sidebar' initialWidth={260} minWidth={30} maxWidth={400}>
      <aside className={`${styles.sidebar} resize-drag`}>
        <div className={`${styles.sidebar_wrapper} sidebar_wrapper_gc`}>
          <LogoDisplay />
          <MultiLevelDragDrop />
        </div>
      </aside>
    </ResizableContainer>
  )
}
