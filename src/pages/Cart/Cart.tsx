import { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import { useSavedGamesStore } from '../../store/cart/useCartStore'
import BottomNavigate from '../home/BottomNavigate'
import type { IOffer } from '../../types/games/games'
import { getOfferById } from '../../api/games/offer'
import { useTokenStore } from '../../store/token/useTokenStore'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import GameCard from '../../components/game/GameCard'
import GameCardSkeleton from '../games/GameCardSkeleton'
const Cart = () => {
	const { token } = useTokenStore()
	const { items } = useSavedGamesStore()
	const { t } = useTranslationStore()
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const isDesctop = useMediaQuery(theme.breakpoints.down('md'))
	const [offers, setOffers] = useState<IOffer[]>([])
	const entries = Object.entries(items)
	const [loading, setLoading] = useState(false)
	useEffect(() => {
		const fetchGames = async () => {
			setLoading(true)
			try {
				const results = []
				for (const [id] of entries) {
					const offer = await getOfferById({ token, id })
					if (offer) results.push(offer)
				}
				setOffers(results)
			} finally {
				setLoading(false)
			}
		}
		fetchGames()
	}, [token])

	return (
		<Box
			sx={{
				height: '100vh',
				background: `linear-gradient(135deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.neonGreen} 50%, ${theme.palette.custom.gradientEnd} 100%)`,
				overflowY: 'auto',
			}}
		>
			<Header />
			{loading && (
				<>
					<GameCardSkeleton />
				</>
			)}
			{!loading && offers.length == 0 && (
				<Typography
					sx={{ fontFamily: 'Bitcount' }}
					textAlign={'center'}
					variant='h5'
				>
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
				{offers?.map((offer, index) => {
					return <GameCard key={index} offer={offer} />
				})}
			</Box>
			<BottomNavigate />
		</Box>
	)
}

export default Cart
