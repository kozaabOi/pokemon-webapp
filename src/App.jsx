import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import "./App.css"
import Locations from './components/Locations'
import About from './components/About'
import PokeBase from './components/PokeBase'
import Layout from './components/Layout'
import Register from './components/Register'
import Login from './components/Login'

function App() {
  const [locations, setLocations] = useState(null)
  const [pokemons, setPokemons] = useState(null)
  const [page, setPage] = useState("")

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/location')
      .then(res => res.json())
      .then(data => {
        setLocations(data.results)
      })
  }, [])

  useEffect(()=>{
    fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
      .then(res => res.json())
      .then(data => {
        setPokemons(data.results)
        console.log(data.results)
      })
  },[])

  return (
    <main className={page}>
      <BrowserRouter>
          <Routes>
              <Route path='/register' element={<Register setPage={setPage}/>}/>
              <Route path='/login' element={<Login setPage={setPage} />}/>
            <Route path='/' element={<Layout />}>
              <Route index element={locations && <Locations locations={locations} setPage={setPage} />}/>
              <Route path='/about' element={<About setPage={setPage}/>}/>
              <Route path='/pokebase' element={pokemons && <PokeBase pokemons={pokemons} setPage={setPage}/>}/>
            </Route>
          </Routes>
      </BrowserRouter> 
    </main>
 )
}

export default App
