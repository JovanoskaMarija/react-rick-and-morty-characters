import React from 'react'
import CountryCard from '../components/Card/Card'

import { render } from '@testing-library/react'

const character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episodes: 23,
}

describe('card', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<CountryCard character={character} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
