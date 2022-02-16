import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Filters from '../containers/RMCharacters/List/Filters/Filters'

describe('Filters component', () => {
  const name = ''
  const status = ''
  const mockChangeNameValue = jest.fn()
  const mockChangeStatusValue = jest.fn()

  it('shows all filter fields with empty values', async () => {
    render(
      <Filters
        nameFilter={name}
        setNameFilter={mockChangeNameValue}
        statusFilter={status}
        setStatusFilter={mockChangeStatusValue}
      />
    )

    const nameFilter = await screen.findByTestId('filter-name')
    expect((nameFilter as HTMLInputElement).value).toBe('')
    const statusFilter = await screen.findByTestId('filter-status')
    expect(statusFilter as HTMLInputElement).toHaveFormValues({
      status: '',
    })
  })

  it('triggers event handler on input change of name', async () => {
    const name = 'Rick'
    const status = ''
    const mockChangeNameValue = jest.fn()
    const mockChangeStatusValue = jest.fn()

    const { rerender } = render(
      <Filters
        nameFilter={name}
        setNameFilter={mockChangeNameValue}
        statusFilter={status}
        setStatusFilter={mockChangeStatusValue}
      />
    )

    const nameFilter = await screen.findByTestId('filter-name')

    fireEvent.change(nameFilter, {
      target: { value: 'Rick' },
    })

    rerender(
      <Filters
        nameFilter={name}
        setNameFilter={mockChangeNameValue}
        statusFilter={status}
        setStatusFilter={mockChangeStatusValue}
      />
    )

    await waitFor(() => {
      expect((nameFilter as HTMLInputElement).value).toEqual('Rick')
    })
  })
})
