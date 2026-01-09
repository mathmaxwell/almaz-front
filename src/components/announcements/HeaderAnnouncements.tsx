import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useNavigate } from 'react-router-dom'
const HeaderAnnouncements = () => {
	const navigate = useNavigate()
	return (
		<>
			<AppBar
				position='static'
				onClick={() => {
					navigate('/announcements')
				}}
			>
				<Toolbar>
					<Typography
						variant='h6'
						noWrap
						component='div'
						sx={{ cursor: 'pointer' }}
					>
						KOF skinlari
					</Typography>
					<Box
						sx={{
							width: '100px',
							height: '100px',
							bgcolor: 'red',
							marginLeft: 2,
						}}
					></Box>
					<Box sx={{ flexGrow: 1 }} />
					<Typography
						variant='body1'
						noWrap
						component='div'
						sx={{ cursor: 'pointer', width: '50%' }}
					>
						KOF skinlarini sotib olin, 12-dekabrdan 30-dekabrgacha
					</Typography>
					<IconButton
						onClick={e => {
							e.stopPropagation()
						}}
					>
						<ClearIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
		</>
	)
}

export default HeaderAnnouncements
