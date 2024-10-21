import SideBarControls from './SideBarControls'
import SideBarInfo from './SideBarInfo'
import SideBarNav from './SideBarNav'
import styles from './SideInfo.module.css'

export default function SideBar () {
  return (
      <aside id='sideinfo' className={`${styles.sideInfo} pinned`}>
        <div id='sideinfoWrapper' className={`${styles.sideInfoWrapper} info_wrapper`}>
          <SideBarInfo />
          <SideBarNav />
          <SideBarControls />
        </div>
      </aside>
  )
}
