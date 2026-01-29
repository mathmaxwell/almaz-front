import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslationStore } from '../../store/language/useTranslationStore'

const ErrorPage = () => {
	const navigate = useNavigate()
	const { t } = useTranslationStore()
	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
					textAlign: 'center',
					mt: 4,
				}}
			>
				<Typography
					variant={'h4'}
					sx={{
						fontWeight: 'bold',
						color: 'primary.main',
						mb: 2,
						fontFamily: 'Bitcount',
					}}
				>
					{t.error404Title}
				</Typography>
				<Typography
					variant='body1'
					sx={{
						color: 'text.secondary',
						maxWidth: 600,
						fontFamily: 'Bitcount',
					}}
				>
					{t.error404Message}
				</Typography>
				<Button
					variant='contained'
					size='large'
					sx={{ mt: 3 }}
					onClick={() => {
						navigate('/')
					}}
				>
					{t.home_page}
				</Button>
			</Box>
		</Box>
	)
}

export default ErrorPage
