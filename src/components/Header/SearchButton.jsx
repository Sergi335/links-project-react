import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import { useFormsStore } from '../../store/forms'
import styles from './Header.module.css'

export default function SearchButton () {
  const searchBoxVisible = useFormsStore(state => state.searchBoxVisible)
  const setSearchBoxVisible = useFormsStore(state => state.setSearchBoxVisible)
  const handleShowSearch = () => {
    setSearchBoxVisible(!searchBoxVisible)
  }
  return (
        <div id="docsearch" className={`${styles.search_button_container}`}>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <button popovertarget='searchbox' type="button" className={styles.search_button} aria-label="Search" onClick={handleShowSearch}>
                <span className={styles.search_button_text}>
                    <span className={`ti ti-search ${styles.search_button_icon}`}></span>
                    <span className="DocSearch-Button-Placeholder">Search</span>
                </span>
                <span className={styles.search_button_keys}>
                    <kbd className={styles.search_button_key_ctrl}></kbd>
                    <kbd className="DocSearch-Button-Key">K</kbd>
                </span>
            </button>
        </div>
  )
}
