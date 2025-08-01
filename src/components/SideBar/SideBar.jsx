import LogoDisplay from './LogoDisplay'
import MultiLevelDragDrop from './newSideBarNav'
import styles from './SideBar.module.css'
// import SideBarNav from './SideBarNav'

export default function SideBar () {
  return (
      <aside id='sidebar' className={`${styles.sidebar} pinned`}>
        <div className={`${styles.sidebar_wrapper} sidebar_wrapper_gc`}>
          <LogoDisplay />
          {/* <SideBarNav /> */}
          <MultiLevelDragDrop />
        </div>
      </aside>
  )
}
