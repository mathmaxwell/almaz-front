import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useLocation, useNavigate } from 'react-router-dom'
const BottomNavigate = () => {
	const location = useLocation()
	const navigate = useNavigate()

	return (
		<>
			<Paper
				sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
				elevation={3}
			>
				<BottomNavigation
					sx={{ width: '100%', mt: 'auto' }}
					value={location.pathname}
					onChange={(_, newValue) => navigate(newValue)}
				>
					<BottomNavigationAction value='/' icon={<HomeIcon />} />
					<BottomNavigationAction
						value='/savedGames'
						icon={<SportsEsportsIcon />}
					/>
					<BottomNavigationAction value='/cart' icon={<ShoppingCartIcon />} />
				</BottomNavigation>
			</Paper>
		</>
	)
}

export default BottomNavigate
