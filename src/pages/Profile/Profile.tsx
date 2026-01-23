import { Box } from '@mui/material'
import Header from '../../components/Header/Header'
import BottomNavigate from '../home/BottomNavigate'

const Profile = () => {
	return (
		<>
			<Header />
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
				<BottomNavigate />
			</Box>
		</>
	)
}

export default Profile
