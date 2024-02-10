import { useEffect, useState } from "react"
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'

function Pokemon({ pokemon }) {
    const [pokeData, setPokeData] = useState(null)

    useEffect(()=> {
        fetch(pokemon.url)
            .then(res => res.json())
            .then(data => {
                setPokeData(data)
            })
    },[pokemon.url])
    
  return (
    <Card
			className="pokemon"
			sx={{ 
				width: 200,
				minHeight: 300
			}}
      style={{
        background: "rgba(255, 255, 255, 0.2)",
        borderRadius: 16,
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(4px)",
        border: "1px solid rgba(255, 255, 255, 0.3)"
      }}
		>
			<CardHeader
				title={pokemon.name.toUpperCase()}
			/>
			{pokeData &&
				<>
					<CardContent
						sx={{ padding: "0 16px 16px 16px" }}
					>
						<h2>#{pokeData.id}</h2>
					</CardContent>
					<CardMedia
						component="img"
						image={pokeData.sprites.front_default}
						alt={pokemon.name}
					/>
				</>
			}
		</Card>
  )
}

export default Pokemon
