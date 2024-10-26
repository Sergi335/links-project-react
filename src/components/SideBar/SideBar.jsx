import SideBarControls from './SideBarControls'
import SideBarInfo from './SideBarInfo'
import SideBarNav from './SideBarNav'
import styles from './SideInfo.module.css'

export default function SideBar () {
  return (
      <aside id='sidebar' className={`${styles.sidebar} pinned`}>
        <div className={`${styles.sidebar_wrapper} info_wrapper`}>
          <SideBarInfo />
          <SideBarNav />
          <SideBarControls />
        </div>
      </aside>
  )
}
