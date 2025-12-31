import LogoDisplay from './LogoDisplay'
import MultiLevelDragDrop from './newSideBarNav'
import { ResizableContainer } from './ResizableContainer'
import styles from './SideBar.module.css'
// import SideBarNav from './SideBarNav'

export default function SideBar () {
  return (
    <ResizableContainer id='sidebar' initialWidth={30} minWidth={50} maxWidth={400}>
      <aside className={`${styles.sidebar} resize-drag`}>
        <div className={`${styles.sidebar_wrapper} sidebar_wrapper_gc`}>
          <LogoDisplay />
          {/* <SideBarNav /> */}
          <MultiLevelDragDrop />
        </div>
      </aside>
    </ResizableContainer>
  )
}
