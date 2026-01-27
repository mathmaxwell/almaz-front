import { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import { useSavedGamesStore } from '../../store/cart/useCartStore'
import BottomNavigate from '../home/BottomNavigate'
import type { IOffer } from '../../types/games/games'
import { getOfferById } from '../../api/games/offer'
import { useTokenStore } from '../../store/token/useTokenStore'
import FavoriteIcon from '@mui/icons-material/Favorite'
import {
	Box,
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
import { useTranslationStore } from '../../store/language/useTranslationStore'
const Cart = () => {
	const { token } = useTokenStore()
	const apiUrl = import.meta.env.VITE_API_URL
	const { items, getCount, toggle, reset } = useSavedGamesStore()
	const { t, lang } = useTranslationStore()
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const isDesctop = useMediaQuery(theme.breakpoints.down('md'))
	const [offers, setOffers] = useState<IOffer[]>([])
	const entries = Object.entries(items)
	useEffect(() => {
		const fetchGames = async () => {
			const results = await Promise.all(
				entries.map(([id, _]) => getOfferById({ token, id })),
			)
			setOffers(results)
		}
		fetchGames()
	}, [entries.length])

	return (
		<Box
			sx={{
				height: '100vh',
				background: `linear-gradient(135deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.neonGreen} 50%, ${theme.palette.custom.gradientEnd} 100%)`,
				overflowY: 'auto',
			}}
		>
			<Header />
			{offers.length == 0 && (
				<Typography textAlign={'center'} variant='h5'>
					{t.no_saved_purchases}
				</Typography>
			)}
			<Box
				sx={{
					width: '100%',
					display: 'grid',
					gap: 2,
					gridTemplateColumns: isMobile
						? '1fr 1fr'
						: isDesctop
							? '1fr 1fr 1fr'
							: '1fr 1fr 1fr 1fr',
				}}
			>
				{offers?.map(offer => {
					const selected = getCount(offer.id)
					return (
						<Card
							key={offer.id}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								pb: 1,
								position: 'relative',
							}}
						>
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
								onClick={e => {
									e.stopPropagation()
								}}
								component='img'
								height={isMobile ? '200px' : isDesctop ? '230px' : '260px'}
								image={`${apiUrl}${offer.image}`}
								alt={offer.ruName}
								sx={{ objectFit: 'cover' }}
							/>
							<CardContent>
								<Box
									sx={{
										display: 'flex',
										flexDirection: isDesctop ? 'column' : 'row',
										alignItems: isDesctop ? 'start' : 'center',
										justifyContent: 'space-between',
										gap: 1,
										width: '100%',
									}}
								>
									<Typography variant={isMobile ? 'h6' : 'h5'}>
										{lang == 'ru' ? offer.ruName : offer.uzName}
									</Typography>
									<Typography variant='body2' sx={{ color: 'text.secondary' }}>
										{offer.price} {t.som}
									</Typography>
								</Box>
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
									onClick={e => {
										e.stopPropagation()
										alert('funksiya')
									}}
									variant='outlined'
								>
									{t.buy}
								</Button>
							</CardActions>
						</Card>
					)
				})}
			</Box>
			<BottomNavigate />
		</Box>
	)
}

export default Cart
