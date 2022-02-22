import './List.scss'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollTop } from 'primereact/scrolltop'
import { ScrollPanel } from 'primereact/scrollpanel'

import { objectToQueryString } from '../../../utils/helpers/objectToQueryString'
import { CharacterData, Character } from '../../../types/types'

import instance from '../../../api/instance'
import Filters from '../../../components/Filters/Filters'
import useDebounceHook from '../../../utils/hooks/useDebounceHook'
import Card from '../../../components/Card/Card'
import Spinner from '../../../components/Spinner/Spinner'

interface ICharactersData {
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
  const debouncedNameFilter = useDebounceHook(nameFilter, 350)

  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0]
      if (first.isIntersecting) {
        setPage((pageNum) => pageNum + 1)
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
      .get<ICharactersData>(`character${filters}`)
      .then(({ data }) => {
        const newCharacters = data.results.map((character) => {
          return {
            id: character.id,
            name: character.name,
            image: character.image,
            gender: character.gender,
            species: character.species,
            status: character.status,
            episodes: character.episode.length,
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
    setCharacters([])
  }, [debouncedNameFilter, statusFilter])

  useEffect(() => {
    if (newCharacters.length) {
      const newCharactersData = [...characters, ...newCharacters]

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
          setPage={setPage}
        />
        {error.length > 0 && !isLoading && (
          <div className="error-message">{error}</div>
        )}

        {isLoading && <Spinner />}
        <div className="list">
          {characters.length > 0 &&
            characters.map((character, i) => {
              return i === characters.length - 1 &&
                !isLoading &&
                lastPage &&
                page !== lastPage ? (
                <div
                  key={`${character.id} - ${character.name}`}
                  ref={setLastElement}
                  className="item"
                >
                  <Card character={character} />
                </div>
              ) : (
                <div
                  key={`${character.id} - ${character.name}`}
                  className="item"
                >
                  <Card character={character} />
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
