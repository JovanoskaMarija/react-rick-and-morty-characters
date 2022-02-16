import './List.scss'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollTop } from 'primereact/scrolltop'
import { ScrollPanel } from 'primereact/scrollpanel'

import { objectToQueryString } from '../../../utils/helpers/objectToQueryString'
import { CharacterData, Character } from '../../../types/types'

import instance from '../../../api/instance'
import Filters from './Filters/Filters'
import useDebounceHook from '../../../utils/hooks/useDebounceHook'
import Card from '../../../components/Card/Card'
import Spinner from '../../../components/Spinner/Spinner'

interface Data {
  results: CharacterData[]
  info: {
    pages: number
    next: string | null
  }
}

function List() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [characters, setCharacters] = useState<Character[] | []>([])
  const [newCharacters, setNewCharacters] = useState<Character[] | []>([])
  const [error, setError] = useState<string>('')

  const [page, setPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number | null>(null)
  const [lastElement, setLastElement] = useState<HTMLDivElement | null>(null)

  const [statusFilter, setStatusFilter] = useState<string>('')
  const [nameFilter, setNameFilter] = useState<string>('')
  const debouncedNameFilter = useDebounceHook(nameFilter, 250)

  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first.isIntersecting) {
        setPage((no) => no + 1)
      }
    })
  )

  const filters = useMemo(() => {
    return objectToQueryString({
      name: debouncedNameFilter,
      status: statusFilter,
      page: page,
    })
  }, [debouncedNameFilter, statusFilter, page])

  useEffect(() => {
    setIsLoading(true)
    setError('')
    instance
      .get<Data>('character' + filters)
      .then(({ data }) => {
        let newCharacters = data.results.map((c) => {
          return {
            id: c.id,
            name: c.name,
            image: c.image,
            gender: c.gender,
            species: c.species,
            status: c.status,
            episodes: c.episode.length,
          }
        })

        setLastPage(data.info.pages)
        setNewCharacters(newCharacters)
      })
      .catch(({ response }) => {
        setError(response.data.error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [filters])

  useEffect(() => {
    const currentElement = lastElement
    const currentObserver = observer.current

    if (currentElement) {
      currentObserver.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement)
      }
    }
  }, [lastElement])

  useEffect(() => {
    setPage(1)
    setCharacters([])
  }, [debouncedNameFilter, statusFilter])

  useEffect(() => {
    if (newCharacters.length) {
      let newCharactersData = [...characters, ...newCharacters]

      setCharacters(newCharactersData)
      setNewCharacters([])
    }
  }, [characters, newCharacters])

  return (
    <div className="list-container">
      <ScrollPanel style={{ width: '98vw', height: '92vh' }}>
        <Filters
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        {error.length > 0 && <div className="error-message">{error}</div>}

        {isLoading && <Spinner />}
        <div className="list">
          {characters.length > 0 &&
            characters.map((c, i) => {
              return i === characters.length - 1 &&
                !isLoading &&
                lastPage &&
                page !== lastPage ? (
                <div key={c.id} ref={setLastElement} className="item">
                  <Card character={c} />
                </div>
              ) : (
                <div key={c.id} className="item">
                  <Card character={c} />
                </div>
              )
            })}
        </div>
        <ScrollTop
          target="parent"
          threshold={100}
          className="custom-scrolltop"
          icon="pi pi-arrow-up"
        />
      </ScrollPanel>
    </div>
  )
}

export default List
