import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import styles from './Search.module.css'
import { searchLinks } from '../services/functions'
import CustomLink from './customlink'
import debounce from 'just-debounce-it'

export default function Search () {
  function useSearch () {
    const [search, updateSearch] = useState('')
    const [error, setError] = useState(null)
    const isFirstInput = useRef(true)

    useEffect(() => {
      if (isFirstInput.current) {
        isFirstInput.current = search === ''
        return
      }
      if (search === '') {
        setError('Introduce un texto')
        return
      }
      if (search.length < 3) {
        setError('Introduce al menos 3 carcateres')
        return
      }
      setError(null)
    }, [search])

    return { search, updateSearch, error, setError }
  }
  const { search, updateSearch, error } = useSearch()
  const [results, setResults] = useState([])
  const [sort, setSort] = useState(false)
  const [width, setWidth] = useState('')
  const [left, setLeft] = useState('')
  const [loading, setLoading] = useState(true)
  const resRef = useRef()
  const inputRef = useRef()
  const previousSearch = useRef(search)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (search === previousSearch.current) return
    previousSearch.current = search
    const data = await searchLinks({ search })
    setResults(data)
  }

  const handleChange = useCallback(
    debounce(async (search) => {
      // setLoading(true)
      const searchResults = await searchLinks({ search })
      setResults(searchResults)
      setLoading(false)
    }, 300),
    []
  )

  const handleInputChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)

    handleChange(newSearch)
  }
  const handleSort = () => {
    setSort(!sort)
  }
  useEffect(() => {
    const handleClick = (event) => {
      if (resRef.current && !resRef.current.contains(event.target)) {
        setResults([])
        updateSearch([])
        setLoading(true)
      }
      if (inputRef.current) {
        const { left, width } = inputRef.current.getBoundingClientRect()
        setWidth(width - 2)
        setLeft(left)
      }
    }
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [])

  const sortedLinks = useMemo(() => {
    return sort
      ? [...results].sort((a, b) => a.name.localeCompare(b.name))
      : results
  }, [sort, results])

  return (
        <>
            <form className={styles.searchForm} onSubmit={handleSubmit}>
                <input ref={inputRef} className={sortedLinks?.length > 0 ? styles.active : null} type="text" name="query" id="" value={search} onChange={handleInputChange} placeholder='Links, descriptions, notes ...'/>
            </form>
            {
                sortedLinks?.length > 0
                  ? <div ref={resRef} className={styles.searchResults} style={{ width, left }}>
                    {error && <p className='error'>{error}</p>}
                    <div className={styles.resControls}>
                      <input type="checkbox" className={styles.checkBox} name="" id="alfaSort" onChange={handleSort} checked={sort} />
                      <label className={styles.checkLabel} htmlFor='alfaSort'>Orden Alfabético</label>
                    </div>
                    {
                        sortedLinks.map(link => (
                            <CustomLink
                            key={link._id}
                            data={{ link }}
                            idpanel={link.idpanel}
                            />
                        ))
                    }
                  </div>
                  : null
            }
            {
              search.length > 0 && sortedLinks?.length === 0
                ? (
                <div ref={resRef} className={styles.searchResults} style={{ width, left }}>
                  {loading
                    ? (
                    <div className={styles.resControls}>
                      <p className={styles.noResText}>Cargando</p>
                    </div>
                      )
                    : (
                    <div className={styles.resControls}>
                      <p className={styles.noResText}>No hay resultados</p>
                    </div>
                      )}
                </div>
                  )
                : null
            }

        </>
  )
}
