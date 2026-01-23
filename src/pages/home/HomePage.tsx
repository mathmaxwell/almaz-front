import { Box } from '@mui/material'
import HeaderAnnouncements from '../../components/announcements/HeaderAnnouncements'
import Header from '../../components/Header/Header'
import GamesPage from '../games/Games'
import BottomNavigate from './BottomNavigate'
const HomePage = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				gap: 2,
				width: '100%',
			}}
		>
			<Header />
			<HeaderAnnouncements />
			<GamesPage />
			<BottomNavigate />
		</Box>
	)
}

export default HomePage
