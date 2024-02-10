import Pokemon from "./Pokemon"

function PokeBase({ pokemons, setPage }) {
  setPage("pokebase")
  
  return (
        <div className="pokemons">
          {pokemons.map((pokemon, index) => <Pokemon key={index} pokemon={pokemon}/>)}
        </div>
  )
}

export default PokeBase
