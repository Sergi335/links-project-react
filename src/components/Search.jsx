import debounce from 'just-debounce-it'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useHideForms from '../hooks/useHideForms'
import { searchLinks } from '../services/functions'
import { useFormsStore } from '../store/forms'
import { CloseIcon, SearchIcon } from './Icons/icons'
import styles from './Search.module.css'
import CustomLink from './customlink'

export default function Search () {
  const [search, updateSearch] = useState('')
  // const [error, setError] = useState(null)
  const [results, setResults] = useState([])
  const [sort, setSort] = useState(false)
  const [loading, setLoading] = useState(false)
  const [placeholder, setPlaceholder] = useState('Links, descriptions, notes ...')
  const resRef = useRef()
  const inputRef = useRef()
  const boxRef = useRef()
  const [media] = useState(window.matchMedia('(max-width: 768px)'))
  const searchBoxVisible = useFormsStore(state => state.searchBoxVisible)
  const setSearchBoxVisible = useFormsStore(state => state.setSearchBoxVisible)
  useHideForms({ form: boxRef.current, setFormVisible: setSearchBoxVisible })

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('entramos')
  }
  const handleChange = useCallback(
    debounce(async (search) => {
      setLoading(true)
      // setError(null)
      const searchResults = await searchLinks({ search })
      setResults(searchResults)
      setLoading(false)
    }, 300),
    []
  )
  const handleShowMobileSearch = () => {
    console.log('entramos')
    inputRef.current.classList.toggle(styles.show)
    inputRef.current.focus()
  }
  const handleInputChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    if (newSearch.length > 2) {
      handleChange(newSearch)
    }
  }
  const handleSort = () => {
    setSort(!sort)
  }
  const sortedLinks = useMemo(() => {
    return sort
      ? [...results].sort((a, b) => a.name.localeCompare(b.name))
      : results
  }, [sort, results])

  useEffect(() => {
    if (searchBoxVisible) inputRef.current.focus()
  }, [searchBoxVisible])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault()
        setSearchBoxVisible(!searchBoxVisible)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [searchBoxVisible, setSearchBoxVisible])

  return (
        <section ref={boxRef} id='searchbox' className={searchBoxVisible ? `${styles.searchbox} ${styles.flex}` : `${styles.searchbox}`}>
          <form id='searchForm' className={styles.searchForm} onSubmit={handleSubmit}>
              <input ref={inputRef}
                className={sortedLinks?.length > 0 ? `${styles.active} ${styles.searchInput}` : `${styles.searchInput}`}
                type="text"
                name="query"
                id=""
                value={search}
                autoFocus
                onFocus={() => setPlaceholder('')}
                onBlur={() => setPlaceholder('Links, descriptions, notes ...')}
                onChange={handleInputChange}
                placeholder={placeholder}
                autoComplete='off'
                minLength={3}
              />
              {/* {
                search.length > 0 && <button type='button' className={styles.cleanButton} onClick={() => updateSearch('')}>
                                      <CloseIcon className='uiIcon'/>
                                     </button>
              } */}
              {
                media.matches
                  ? <button type='button' className={styles.searchButton} onClick={handleShowMobileSearch}>
                      <SearchIcon className={styles.searchButtonIcon} />
                    </button>
                  : <button type='submit' className={styles.searchButton}>
                      <SearchIcon className={styles.searchButtonIcon} />
                    </button>
              }
          </form>
          {
             search.length > 2 && sortedLinks?.length > 0
               ? <div ref={resRef} className={styles.searchResults}>
                  <div className={styles.resControls}>
                    <div className={styles.resControlsGroup}>
                      <input type="checkbox" className={styles.checkBox} name="" id="alfaSort" onChange={handleSort} checked={sort} />
                      <label className={styles.checkLabel} htmlFor='alfaSort'>Orden Alfabético</label>
                    </div>
                    <button type='button' className={styles.cleanButton} onClick={() => updateSearch('')}>
                      <CloseIcon className='uiIcon'/>
                    </button>
                  </div>
                  {
                    sortedLinks.map(link => (
                      <CustomLink
                        key={link._id}
                        data={{ link }}
                        idpanel={link.idpanel}
                        className={'searchResult'}
                      />
                    ))
                  }
                </div>
               : null
          }
          {
            search.length > 2 && sortedLinks?.length === 0
              ? (
              <div ref={resRef} className={styles.searchResults}>
                {loading
                  ? (
                    <div className={styles.loaderWrapper}>
                      <span className={styles.loader}></span>
                    </div>
                    )
                  : (
                    <div className={styles.resControls}>
                      <p className={styles.noResText}>No hay resultados</p>
                      <button type='button' className={styles.cleanButton} onClick={() => updateSearch('')}>
                        <CloseIcon className='uiIcon'/>
                      </button>
                    </div>
                    )
                }
              </div>
                )
              : null
          }
        </section>
  )
}
