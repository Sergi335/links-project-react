import styles from './SideBar.module.css'
import SideBarControls from './SideBarControls'
import SideBarInfo from './SideBarInfo'
import SideBarNav from './SideBarNav'

export default function SideBar () {
  return (
      <aside id='sidebar' className={`${styles.sidebar} pinned`}>
        <div className={`${styles.sidebar_wrapper} sidebar_wrapper_gc`}>
          <SideBarInfo />
          <SideBarNav />
          <SideBarControls />
        </div>
      </aside>
  )
}
