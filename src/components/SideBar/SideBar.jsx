import styles2 from '../Header/Header.module.css'
import SearchButton from '../Header/SearchButton'
import LogoDisplay from './LogoDisplay'
import MultiLevelDragDrop from './newSideBarNav'
import { ResizableContainer } from './ResizableContainer'
import styles from './SideBar.module.css'

export default function SideBar () {
  return (
    <ResizableContainer id='sidebar' initialWidth={260} minWidth={30} maxWidth={400}>
      <aside className={`${styles.sidebar} resize-drag`}>
        <div className={`${styles.sidebar_wrapper} sidebar_wrapper_gc`}>
          <section className={styles2.header_info} style={{ borderBottom: 'var(--firstBorder)', height: '60px' }}>
            <SearchButton />
          </section>
          <MultiLevelDragDrop />
          <LogoDisplay />
        </div>
      </aside>
    </ResizableContainer>
  )
}
