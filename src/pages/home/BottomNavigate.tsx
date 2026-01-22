import {
	BottomNavigation,
	BottomNavigationAction,
	Box,
	Paper,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useLocation, useNavigate } from 'react-router-dom'
import ScheduleIcon from '@mui/icons-material/Schedule'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
const BottomNavigate = () => {
	const location = useLocation()
	const navigate = useNavigate()
	return (
		<>
			<Box sx={{ height: '50px', zIndex: 99 }}></Box>
			<Paper
				sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99 }}
				elevation={3}
			>
				<BottomNavigation
					sx={{ width: '100%', mt: 'auto' }}
					value={location.pathname}
					onChange={(_, newValue) => navigate(newValue)}
				>
					<BottomNavigationAction value='/' icon={<HomeIcon />} />
					<BottomNavigationAction
						value='/wallet'
						icon={<AccountBalanceWalletIcon />}
					/>
					<BottomNavigationAction value='/cart' icon={<ShoppingCartIcon />} />
					<BottomNavigationAction value='/history' icon={<ScheduleIcon />} />
				</BottomNavigation>
			</Paper>
		</>
	)
}

export default BottomNavigate
