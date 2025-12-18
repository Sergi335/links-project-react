import LogoDisplay from './LogoDisplay'
import MultiLevelDragDrop from './newSideBarNav'
import { ResizableContainer } from './ResizableContainer'
import styles from './SideBar.module.css'
// import SideBarNav from './SideBarNav'

export default function SideBar () {
  return (
    <ResizableContainer initialWidth={260} minWidth={200} maxWidth={400}>
      <aside id='sidebar' className={`${styles.sidebar} pinned resize-drag`}>
        <div className={`${styles.sidebar_wrapper} sidebar_wrapper_gc`}>
          <LogoDisplay />
          {/* <SideBarNav /> */}
          <MultiLevelDragDrop />
        </div>
      </aside>
    </ResizableContainer>
  )
}
