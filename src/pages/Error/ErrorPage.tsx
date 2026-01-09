import {
	Box,
	Button,
	IconButton,
	Typography,
	useMediaQuery,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ReplyIcon from '@mui/icons-material/Reply'
import { useTranslationStore } from '../../store/language/useTranslationStore'

const ErrorPage = () => {
	const isSmallScreen = useMediaQuery('(max-width:600px)')
	const navigate = useNavigate()
	const { t } = useTranslationStore()
	return (
		<Box
			sx={{
				py: { xs: 2, md: 4 },
				paddingLeft: { xs: 2, sm: 12 },
				paddingRight: { xs: 2, md: 4 },
				maxWidth: 1200,
				mx: 'auto',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'start',
			}}
		>
			{isSmallScreen ? (
				<IconButton sx={{ mb: 2 }} onClick={() => navigate('/')}>
					<ReplyIcon />
				</IconButton>
			) : (
				<Button sx={{ mb: 2 }} variant='outlined' onClick={() => navigate('/')}>
					{t.backToMainPage}
				</Button>
			)}
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
					variant={isSmallScreen ? 'h4' : 'h2'}
					sx={{
						fontWeight: 'bold',
						color: 'primary.main',
						mb: 2,
					}}
				>
					{t.error404Title || 'Oops! Page Not Found'}
				</Typography>
				<Typography
					variant='body1'
					sx={{
						color: 'text.secondary',
						maxWidth: 600,
					}}
				>
					{t.error404Message ||
						'It looks like you wandered off the path. Let’s get you back home!'}
				</Typography>
			</Box>
		</Box>
	)
}

export default ErrorPage
