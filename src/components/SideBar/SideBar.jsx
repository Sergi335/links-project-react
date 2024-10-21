import { useRef } from 'react'
import SideBarControls from './SideBarControls'
import SideBarInfo from './SideBarInfo'
import SideBarNav from './SideBarNav'
import styles from './SideInfo.module.css'

export default function SideBar ({ environment, className = 'listoflinks' }) {
  const localClass = Object.hasOwn(styles, className) ? styles[className] : ''
  const sideInfoRef = useRef()

  return (
      <aside ref={sideInfoRef} id='sideinfo' className={`${styles.sideInfo} ${localClass} pinned`}>
        <div id='sideinfoWrapper' className={`${styles.sideInfoWrapper} info_wrapper`}>
        <SideBarInfo />
        <SideBarNav />
        <SideBarControls />
        </div>
      </aside>
  )
}
