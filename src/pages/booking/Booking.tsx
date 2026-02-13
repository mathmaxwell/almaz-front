import { Box, useTheme } from '@mui/material'
import Header from '../../components/Header/Header'
import BottomNavigate from '../home/BottomNavigate'

const Booking = () => {
	const theme = useTheme()
	return (
		<Box
			sx={{
				minHeight: '100vh',
				background: `linear-gradient(135deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.neonGreen} 50%, ${theme.palette.custom.gradientEnd} 100%)`,
				overflowY: 'auto',
			}}
		>
			<Header />
			<BottomNavigate />
		</Box>
	)
}

export default Booking
