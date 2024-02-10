import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function Navbar() {
	const navigate = useNavigate()
	const handleClick = () => {
		localStorage.clear()
		navigate('/login')
	}

	return (
	
			<div className='navigation-bar'>
				<header className='site-nav'>
					<Link to='/'>Arena</Link>
					<Link to='/pokebase'>Pokebase</Link>
					<Link to='/about'>About</Link>
					<button className='logout' onClick={()=>{handleClick()}}>Log out</button>
				</header>
			</div>
	
	)
}

export default Navbar
