import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	TextField,
	Typography,
	Zoom,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useBuyModalStore } from '../../store/modal/useBuyModalStore'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { useState } from 'react'
import { useGameStore } from '../../store/game/useGameStore'
import { useVideoModalStore } from '../../store/modal/useVideoModalStore'
import { useNavigate } from 'react-router-dom'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import { updateNumberFormat } from '../../func/number'
import { createBuy } from '../../api/buy/buy'
import { useTokenStore } from '../../store/token/useTokenStore'
const BuyModal = () => {
	const { token } = useTokenStore()
	const apiUrl = import.meta.env.VITE_API_URL
	const { open, closeModal, offer } = useBuyModalStore()
	const navigate = useNavigate()
	const { lang, t } = useTranslationStore()
	const [playerId, setPlayerId] = useState('')
	const [serverId, setServerId] = useState('')
	const { game } = useGameStore()
	const { open: openVideo } = useVideoModalStore()
	const isRu = lang === 'ru'
	const withOutServerId = game.description !== 'two'
	return (
		<Dialog
			open={open}
			onClose={closeModal}
			maxWidth='xs'
			fullWidth
			TransitionComponent={Zoom}
			transitionDuration={400}
			sx={{
				'& .MuiDialog-paper': {
					borderRadius: '20px',
					overflow: 'hidden',
					background: `linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)`,
					boxShadow: '0 20px 60px rgba(0, 255, 135, 0.18)',
					border: '1px solid rgba(0, 255, 136, 0.25)',
				},
			}}
		>
			<DialogTitle
				sx={{
					p: 3,
					pb: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					background: 'rgba(0,0,0,0.3)',
				}}
			>
				<Typography
					variant='h5'
					component='span'
					fontWeight={800}
					sx={{
						fontFamily: '"Bitcount", system-ui, sans-serif',
						background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						letterSpacing: '-0.5px',
					}}
				>
					{isRu ? offer?.ruName : offer?.uzName}
				</Typography>

				<IconButton onClick={closeModal} size='small' sx={{ color: '#aaa' }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent sx={{ px: 4, pb: 4, pt: 2 }}>
				<Box sx={{ textAlign: 'center', mb: 3 }}>
					<Box
						component='img'
						src={`${apiUrl}${offer?.image}`}
						alt='offer'
						sx={{
							width: 140,
							height: 140,
							objectFit: 'contain',
							borderRadius: '16px',
							boxShadow: '0 12px 30px rgba(0, 255, 136, 0.25)',
							border: '2px solid rgba(0, 255, 136, 0.3)',
							transition: 'transform 0.3s ease',
							'&:hover': { transform: 'scale(1.08)' },
						}}
					/>
				</Box>

				<Typography
					variant='h4'
					fontWeight={900}
					align='center'
					sx={{
						mb: 3,
						fontFamily: '"Bitcount", system-ui, sans-serif',
						color: '#00ffaa',
						textShadow: '0 0 20px rgba(0, 255, 170, 0.6)',
					}}
				>
					{updateNumberFormat(offer?.price || '')} {t.som}
				</Typography>

				<Box
					sx={{
						mb: 3,
						p: 1.5,
						borderRadius: '12px',
						background: 'rgba(255, 0, 0, 0.12)',
						border: '1px solid rgba(255, 0, 0, 0.35)',
						cursor: 'pointer',
						transition: 'all 0.2s',
						'&:hover': {
							background: 'rgba(255, 0, 0, 0.22)',
							transform: 'translateY(-2px)',
						},
					}}
				>
					<Typography
						onClick={() => {
							navigate('/about')
							closeModal()
						}}
						variant='body1'
						align='center'
						sx={{
							fontWeight: 600,
							color: '#ff6666',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1,
						}}
					>
						<PlayCircleOutlineIcon
							fontSize='large'
							onClick={() => {
								openVideo({
									title: isRu ? game.howToUseRu : game.howToUseUz,
									video: { url: `${apiUrl}${game.video}`, type: 'backend' },
								})
							}}
						/>
						{t.support_notice}
					</Typography>
				</Box>

				<Divider sx={{ my: 2.5, borderColor: 'rgba(0, 255, 136, 0.18)' }} />

				{!withOutServerId && (
					<TextField
						label={t.server_id}
						fullWidth
						variant='outlined'
						value={serverId}
						onChange={e => setServerId(e.target.value)}
						sx={{ mb: 2.5 }}
						InputProps={{
							sx: {
								borderRadius: '12px',
								background: 'rgba(255,255,255,0.04)',
								'& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
								'&:hover fieldset': { borderColor: '#00ff88' },
								'&.Mui-focused fieldset': { borderColor: '#00ff88' },
							},
						}}
						InputLabelProps={{ sx: { color: '#aaa' } }}
					/>
				)}

				<TextField
					label={t.player_id}
					fullWidth
					variant='outlined'
					value={playerId}
					onChange={e => setPlayerId(e.target.value)}
					sx={{ mb: 4 }}
					InputProps={{
						sx: {
							borderRadius: '12px',
							background: 'rgba(255,255,255,0.04)',
							'& fieldset': { borderColor: 'rgba(0, 255, 136, 0.3)' },
							'&:hover fieldset': { borderColor: '#00ff88' },
							'&.Mui-focused fieldset': { borderColor: '#00ff88' },
						},
					}}
					InputLabelProps={{ sx: { color: '#aaa' } }}
				/>

				<Button
					variant='contained'
					fullWidth
					size='large'
					onClick={async () => {
						const result = await createBuy({
							token,
							gameId: game.id,
							playerId,
							serverId,
							botId: offer?.botId!,
							offerId: offer?.id!,
						})
						console.log('result', result)
					}}
					disabled={
						withOutServerId
							? !playerId.trim()
							: !playerId.trim() || !serverId.trim()
					}
					sx={{
						py: 1.8,
						borderRadius: '14px',
						fontSize: '1.1rem',
						fontWeight: 700,
						background: 'linear-gradient(90deg, #00c853, #00e676)',
						boxShadow: '0 8px 25px rgba(0, 230, 118, 0.4)',
						textTransform: 'none',
						'&:hover': {
							background: 'linear-gradient(90deg, #00e676, #69f0ae)',
							transform: 'translateY(-2px)',
							boxShadow: '0 14px 35px rgba(0, 230, 118, 0.55)',
						},
						'&:disabled': {
							background: 'rgba(100,100,100,0.4)',
							boxShadow: 'none',
						},
					}}
				>
					{t.buy}
				</Button>
			</DialogContent>
		</Dialog>
	)
}

export default BuyModal
