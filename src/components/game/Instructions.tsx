import { Button, Typography, useTheme } from '@mui/material'
import { useGameStore } from '../../store/game/useGameStore'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { useVideoModalStore } from '../../store/modal/useVideoModalStore'
const Instructions = () => {
	const { game } = useGameStore()
	const { open } = useVideoModalStore()
	const { lang, t } = useTranslationStore()
	const theme = useTheme()
	const apiUrl = import.meta.env.VITE_API_URL
	return (
		<>
			<Typography sx={{ fontFamily: 'Bitcount' }} align='center' variant='h3'>
				{t.instructions}
			</Typography>
			<Typography variant='h4' sx={{ my: 2, fontFamily: 'Bitcount' }}>
				{lang == 'ru' ? game.howToUseRu : game.howToUseUz}
			</Typography>
			<Button
				variant='contained'
				fullWidth
				sx={{
					my: 2,
					bgcolor: theme.palette.error.main,
					boxShadow: '0 4px 12px rgba(0,0,0,1)',
				}}
				onClick={() => {
					open({ video: { type: 'backend', url: `${apiUrl}${game.video}` } })
				}}
			>
				{t.watch_video}
			</Button>
			<img
				src={`${apiUrl}${game.helpImage}`}
				alt='image'
				style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
			/>
		</>
	)
}

export default Instructions
