export interface CharacterData {
  created: string
  episode: string[]
  gender: string
  id: number
  image: string
  location: { name: string; url: string }
  name: string
  origin: { name: string; url: string }
  species: string
  status: string
  type: string
  url: string
}

export interface Character {
  id: number
  name: string
  image: string
  gender: string
  species: string
  status: string
  episodes: number
}
