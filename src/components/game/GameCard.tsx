import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	IconButton,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import type { IOffer } from '../../types/games/games'
import { useSavedGamesStore } from '../../store/cart/useCartStore'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { useOfferStoreModal } from '../../store/modal/useOfferModal'
import { useTokenStore } from '../../store/token/useTokenStore'
import EditIcon from '@mui/icons-material/Edit'
import { updateNumberFormat } from '../../func/number'
import GameStatus from './GameStatus'
import { useBuyModalStore } from '../../store/modal/useBuyModalStore'
import { useGameStore } from '../../store/game/useGameStore'
import { getGameById } from '../../api/games/games'
const GameCard = ({ offer }: { offer: IOffer }) => {
	const theme = useTheme()
	const { setGame } = useGameStore()
	const { token } = useTokenStore()
	const isAdmin = import.meta.env.VITE_ADMINTOKEN == token
	const { t, lang } = useTranslationStore()
	const apiUrl = import.meta.env.VITE_API_URL
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const { getCount, toggle, reset } = useSavedGamesStore()
	const selected = getCount(offer.id)
	const { openModal: openModalToBuy } = useBuyModalStore()
	const { openModal } = useOfferStoreModal()
	return (
		<>
			<Card
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					position: 'relative',
					background:
						offer.status && offer.status !== '-'
							? `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.warning.main} 50%, ${theme.palette.error.main} 100%)`
							: `linear-gradient(45deg, ${theme.palette.custom.neonCyan} 0%, ${theme.palette.custom.gradientEnd} 50%, ${theme.palette.custom.neonPurple} 100%)`,
					borderRadius: '20px',
					boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
				}}
			>
				<GameStatus status={offer.status} />
				<IconButton
					sx={{
						position: 'absolute',
						top: 10,
						right: 10,
						backgroundColor: selected
							? 'rgba(255, 255, 255, 0.85)'
							: 'rgba(0, 0, 0, 0.45)',
						backdropFilter: 'blur(6px)',
						WebkitBackdropFilter: 'blur(6px)',
						boxShadow: '0 8px 24px rgba(0,0,0,100)',
					}}
					onClick={e => {
						e.stopPropagation()
						if (selected > 0) {
							reset(offer.id)
						} else {
							toggle(offer.id)
						}
					}}
				>
					<FavoriteIcon color={selected ? 'error' : 'action'} />
				</IconButton>
				<CardMedia
					component='img'
					image={`${apiUrl}${offer.image}`}
					alt={offer.ruName}
					sx={{
						aspectRatio: '1 / 1',
						width: '100%',
						objectFit: 'cover',
						objectPosition: 'center',
					}}
				/>
				<CardContent>
					<Typography
						sx={{ fontFamily: 'Bitcount', color: theme.palette.common.black }}
						align='center'
						variant={isMobile ? 'h5' : 'h4'}
					>
						{lang == 'ru' ? offer.ruName : offer.uzName}
					</Typography>
					<Typography
						sx={{
							fontFamily: 'Bitcount',
							color: theme.palette.common.black,
						}}
						variant={isMobile ? 'h6' : 'h5'}
						align='center'
					>
						{updateNumberFormat(offer.price)} {t.som}
					</Typography>
				</CardContent>
				<CardActions
					disableSpacing
					sx={{
						display: 'flex',
						flexDirection: isMobile ? 'column' : 'row',
					}}
				>
					<Button
						fullWidth
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1,
							boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
						}}
						onClick={async e => {
							e.stopPropagation()
							const result = await getGameById({ token, id: offer.gameId })
							setGame(result)
							openModalToBuy(offer)
						}}
						color={offer.status !== '-' ? 'warning' : 'info'}
						variant='contained'
					>
						<ShoppingCartIcon />
						{t.buy}
					</Button>
					{isAdmin && (
						<EditIcon
							onClick={e => {
								e.stopPropagation()
								openModal(offer)
							}}
						/>
					)}
				</CardActions>
			</Card>
		</>
	)
}

export default GameCard
