import './Filters.scss'
import { Dispatch, SetStateAction } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'

interface IFilters {
  nameFilter: string
  setNameFilter: Dispatch<SetStateAction<string>>
  statusFilter: string
  setStatusFilter: Dispatch<SetStateAction<string>>
  setPage: Dispatch<SetStateAction<number>>
}

function Filters({
  nameFilter,
  setNameFilter,
  statusFilter,
  setStatusFilter,
  setPage,
}: IFilters) {
  const statusOptions = [
    { label: 'Any', value: '' },
    { label: 'Alive', value: 'alive' },
    { label: 'Dead', value: 'dead' },
    { label: 'Unknown', value: 'unknown' },
  ]

  return (
    <div className="filters-container">
      <div className="filter">
        <label htmlFor="name">Name</label>
        <InputText
          id="name"
          name="name"
          value={nameFilter}
          onChange={(e) => {
            setPage(1)
            setNameFilter(e.target.value)
          }}
          data-testid="filter-name"
        />
      </div>

      <form className="filter" data-testid="filter-status">
        <label htmlFor="status">Status</label>
        <Dropdown
          id="status"
          name="status"
          value={statusFilter}
          options={statusOptions}
          onChange={(e) => {
            setPage(1)
            setStatusFilter(e.value)
          }}
          placeholder="Select status"
        />
      </form>
    </div>
  )
}

export default Filters
