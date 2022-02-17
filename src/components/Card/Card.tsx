import './Card.scss'
import { Character } from '../../types/types'

interface ICard {
  character: Character
}

function Card({ character }: ICard) {
  return (
    <div className="card">
      <img src={character.image} alt={`${character.name}`} />
      <div className="info-card">
        <span className="character-name">{character.name}</span>
        <div>
          <div className="info">
            <span className="label">gender:</span>
            <span className="value">{character.gender}</span>
          </div>

          <div className="info">
            <span className="label">species:</span>
            <span className="value">{character.species}</span>
          </div>

          <div className="info">
            <span className="label">status:</span>
            <span className="value">{character.status}</span>
          </div>

          <div className="info">
            <span className="label">episodes:</span>
            <span className="value">{character.episodes}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
