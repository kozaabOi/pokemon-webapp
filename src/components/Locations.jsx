import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Confetti from 'react-confetti'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css'; 

function Locations({ locations, setPage}) {
  setPage("arena")
  const navigate = useNavigate()
  const log = localStorage.getItem("setLogged")

  if (!log) {
    navigate("/login")
  }
  
  const usersPokemonUrls = [
    "https://pokeapi.co/api/v2/pokemon/bulbasaur",
    "https://pokeapi.co/api/v2/pokemon/charizard",
    "https://pokeapi.co/api/v2/pokemon/poliwhirl"
  ]
  
  const [location, setLocation] = useState(null)
  const [locationData, setLocationData] = useState(null)
  const [areaData, setAreaData] = useState(null)
  const [message, setMessage] = useState("")
  const [encounteredPokemon, setEncounteredPokemon] = useState(null)
  const [locationVisibles, setLocationVisibles] = useState(true)
  const [pokemonData, setPokemonData] = useState(null)
  const [myPokemon, setMyPokemon] = useState([])
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [winner, setWinner] = useState(null)
  const [usersPokemon, setUsersPokemon] = useState(usersPokemonUrls)
  const [firstFighterHp, setFirstFighterHp] = useState(null)
  const [secondFighterHp, setSecondFighterHp] = useState(null)
  const [render, setRender] = useState(true)

  useEffect(() => {
    (location &&
    fetch(location)
      .then(res => res.json())
      .then(data => {
        setLocationData(data)
      }))
  }, [location])

  useEffect(() => {
    if (areaData) {
    fetch(areaData)
      .then(res => res.json())
      .then(data => {
        showTheEncounters(data)
      })
  }}, [areaData])

  useEffect(()=> {
    if (encounteredPokemon) {
      fetch(encounteredPokemon.url)
        .then(res => res.json())
        .then(data => {
          setPokemonData(data)
          setLocationVisibles(false)
        })
    }
  },[encounteredPokemon])
  
  useEffect(()=>{
    if (locationData && locationData.areas) {
      const areaUrls = locationData.areas.map(area => area.url)
      const randomUrl = Math.floor(Math.random() * areaUrls.length)
      
      if (areaUrls.length > 0) {
        setAreaData(areaUrls[randomUrl])
      } else {
        setMessage("This location doesn't seem to have any Pokémon")
        setLocationVisibles(false)
      }
    }
  },[locationData])
    
  const showTheEncounters = (data) => {
    if (data.pokemon_encounters && data.pokemon_encounters.length > 0) {
      const randomPokemonIndex = Math.floor(Math.random() * data.pokemon_encounters.length)
      const randomPokemon = data.pokemon_encounters[randomPokemonIndex].pokemon
      setEncounteredPokemon(randomPokemon)
      }
    } 

  const handleShowLocation = () => {
    setLocation(null)
    setAreaData(null)
    setSelectedPokemon(null)
    setWinner(null)
    setMessage("")
    setLocationVisibles(true)
  }


useEffect(()=>{
  (usersPokemon &&
    usersPokemon.map(url => 
      fetch(url)
        .then(res => res.json())
        .then(data => {
          setMyPokemon(prevPokemon => [...prevPokemon, data])
          
      })))
},[usersPokemon, render])

function handleClick(pokemonData, selectedPokemon) {
  let first = selectedPokemon
  let second = pokemonData

  let i = 0;
  const intervalId = setInterval(function () {
    let isEven = i % 2 == 0;

    if (isEven) {
      let B = first.stats[1].base_stat;
      let D = second.stats[2].base_stat;
      let Z = function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
      };

      let damage = Math.floor(((((2 / 5 + 2) * B * 60) / D) / 50 + 2) * Z(217, 255) / 255);
      console.log(damage);

      second.stats[0].base_stat = second.stats[0].base_stat - damage;
      console.log("second fighter HP: ", second.stats[0].base_stat);
      setSecondFighterHp(second.stats[0].base_stat)
      
      if (second.stats[0].base_stat <= 0) {
        setSecondFighterHp(null)
        setFirstFighterHp(null)
        clearInterval(intervalId);
        return setWinner(first);
      }
    } else {
      let B = second.stats[1].base_stat;
      let D = first.stats[2].base_stat;
      let Z = function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
      };
      let damage = Math.floor(((((2 / 5 + 2) * B * 60) / D) / 50 + 2) * Z(217, 255) / 255);
      console.log(damage);

      first.stats[0].base_stat = first.stats[0].base_stat - damage;
      console.log("first fighter Hp: ", first.stats[0].base_stat);
      setFirstFighterHp(first.stats[0].base_stat)

      if (first.stats[0].base_stat <= 0) {
        setFirstFighterHp(null)
        setSecondFighterHp(null)
        clearInterval(intervalId);
        return setWinner(second);
      }
    }

    i++;

    if (i >= 1000) { clearInterval(intervalId); }
  }, 300);
}

useEffect(()=> {
  if (winner && winner === selectedPokemon){
      const catchedPokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonData.name}`
      if (!usersPokemon.includes(catchedPokemonUrl)){
        setMyPokemon([])
        setUsersPokemon(prevUsers => [...prevUsers, catchedPokemonUrl])
        setTimeout(() => {
        handleShowLocation();
        }, 8000)
      } else {
        setTimeout(() => {
        setMyPokemon([])
        setRender(prevRender => !prevRender)
        handleShowLocation();
      }, 8000)
    }
    } else if (winner && winner === pokemonData) {
      setMyPokemon([])
      setRender(prevRender => !prevRender)
    }
},[winner])

  return (
    <div className="location-container">
      <div className="locations">
        {locationVisibles && locations.map((location, index) => 
          <Card
            style={{
              boxShadow: "0px 0px 15px 6px rgba(0, 0, 0, 1)",
              textAlign: "center",
              fontFamily: "Roboto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "15px",

              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.4)",

              transition: "all 1s ease",

            }}
            className="location"
            sx={{
              width: 220,
              minHeight: 80,
            }} 
            key={index}
            onClick={()=>{setLocation(location.url)}}
          >
            <CardHeader 
              titleTypographyProps={{
              fontSize: 16,
              }}
              title={location.name.toUpperCase()} 
              sx={{
                padding:0
              }}
            />
              <div className={location.name}></div> 
          </Card>)}
      </div>
      {(!locationVisibles && message) ? <button className="back-button" onClick={handleShowLocation}>Back to the selector page!</button> : null}

      {!locationVisibles && 
      <div className="arena-container">
        {areaData 
          ? 
          <div className="fighters">
            <div>
              {selectedPokemon && 
                <>
                  {firstFighterHp && 
                    <>
                      <p>{firstFighterHp}</p>
                      <div style={{height:10, width:firstFighterHp*2, backgroundColor: "#ff0000" }}></div>
                    </>
                  }
                  <img src={selectedPokemon.sprites.back_default} style={{height:300}} alt={selectedPokemon.name} />
                  <h2>{selectedPokemon.name.charAt(0).toUpperCase()}{selectedPokemon.name.slice(1)}</h2>
                  
                </>
              }
          </div>
            <div>
              {firstFighterHp && 
                <>
                  <p>{secondFighterHp}</p>
                  <div style={{height:10, width:secondFighterHp*2, backgroundColor: "#ff0000" }}></div>
                </>
              }
              <img className="image" src={pokemonData.sprites.front_default} style={{height:300}}  alt={pokemonData.name} />
              <h2>{pokemonData.name.charAt(0).toUpperCase()}{pokemonData.name.slice(1)}</h2>
            </div>
          </div>
          : 
            <h3>{message}</h3>
          }
          <div className="collection">
            {myPokemon.map((pokemon, index) => 
              <Card 
              key={index}
              style={{
                boxShadow: "0px 0px 15px 6px rgba(0, 0, 0, 1)",
                textAlign: "center",
                fontFamily: "Roboto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 16,
  
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
  
                transition: "all 1s ease"
              }}
              className="location"
              sx={{
                width: 130,
                height: 70
              }}
              >
                <div  onClick={()=>setSelectedPokemon(pokemon)}>
                  <h3>{pokemon.name.charAt(0).toUpperCase()}{pokemon.name.slice(1)}</h3>
                  <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{height:50}}/>
                </div>
              </Card>
            )}
          </div>
        
          
      </div>
        }

        {!locationVisibles && 
        <>
        <div>
            {selectedPokemon && <button className="fight-button" onClick={()=>handleClick(pokemonData, selectedPokemon)}>Fight</button>}
        </div>
          <div>
              {winner && 
                  <div>
                    {(winner.name === selectedPokemon.name) 
                    ? 
                      <>
                        <Confetti />
                        <div className="winner">
                          <h1>{winner.name.charAt(0).toUpperCase()}{winner.name.slice(1)}</h1>
                        </div>
                      </>
                    :
                      <div className="shame">
                        <h1>This time you lose!</h1>
                        <button className="back-button" onClick={handleShowLocation}>Back to the selector page!</button>
                      </div>
                  }
                  </div>
              }
          </div>
        </>
        } 

    </div>
    
  )
}
export default Locations
