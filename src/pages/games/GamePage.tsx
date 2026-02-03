import Header from '../../components/Header/Header'
import { useTokenStore } from '../../store/token/useTokenStore'
import {
	Box,
	Button,
	IconButton,
	Typography,
	useMediaQuery,
} from '@mui/material'
import { useGamesStoreModal } from '../../store/modal/useGameModal'
import EditIcon from '@mui/icons-material/Edit'
import { useGameStore } from '../../store/game/useGameStore'
import { useTheme } from '@mui/material/styles'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { useOfferStoreModal } from '../../store/modal/useOfferModal'
import type { IOffer } from '../../types/games/games'
import { useQuery } from '@tanstack/react-query'
import { getOffer } from '../../api/games/offer'
import BottomNavigate from '../home/BottomNavigate'
import { useState } from 'react'
import Instructions from '../../components/game/Instructions'
import GameCard from '../../components/game/GameCard'
import GameCardSkeleton from './GameCardSkeleton'
const GamePage = () => {
	const theme = useTheme()
	const [active, setActive] = useState<'buy' | 'instructions'>('buy')
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const isDesctop = useMediaQuery(theme.breakpoints.down('md'))
	const { t } = useTranslationStore()
	const { game } = useGameStore()
	const { token } = useTokenStore()
	const isAdmin = import.meta.env.VITE_ADMINTOKEN == token
	const apiUrl = import.meta.env.VITE_API_URL
	const { openModal } = useGamesStoreModal()
	const { openModal: offerCreate } = useOfferStoreModal()
	const { data, isLoading } = useQuery<IOffer[], Error>({
		queryKey: ['offer', token],
		queryFn: async () => {
			const result = await getOffer({ token, gameId: game.id })
			return result ?? []
		},
		enabled: !!token,
	})
	return (
		<Box
			sx={{
				height: '100vh',
				background: `linear-gradient(135deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.neonGreen} 50%, ${theme.palette.custom.gradientEnd} 100%)`,
				overflowY: 'auto',
			}}
		>
			<Header />
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'start',
					gap: 2,
					p: 2,
					background: `linear-gradient(0deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.neonGreen} 50%, ${theme.palette.custom.gradientStart} 100%)`,
					mb: 2,
					borderRadius: '30px',
					boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
				}}
			>
				<img
					src={`${apiUrl}${game.image}`}
					alt='game name'
					style={{
						width: '75px',
						height: '75px',
						objectFit: 'contain',
						borderRadius: '50%',
					}}
				/>
				<Typography sx={{ fontFamily: 'Bitcount' }} variant='h4'>
					{game.name}
				</Typography>
				{isAdmin && (
					<IconButton
						sx={{ ml: 'auto' }}
						onClick={e => {
							offerCreate()
							e.stopPropagation()
						}}
					>
						<AddCircleIcon />
					</IconButton>
				)}
				{isAdmin && (
					<IconButton
						onClick={e => {
							openModal(game)
							e.stopPropagation()
						}}
					>
						<EditIcon />
					</IconButton>
				)}
			</Box>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					my: 2,
				}}
			>
				<Button
					onClick={() => {
						setActive('buy')
					}}
					fullWidth
					variant={active == 'buy' ? 'contained' : 'outlined'}
					sx={{
						p: '10px',
						borderRadius: '20px 0 0 20px',
						boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
						fontSize: isDesctop?'':'',
					}}
				>
					{t.buy}
				</Button>
				<Button
					onClick={() => {
						setActive('instructions')
					}}
					fullWidth
					variant={active == 'instructions' ? 'contained' : 'outlined'}
					sx={{
						p: '10px',
						borderRadius: '0 20px 20px 0',
						boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
					}}
				>
					{t.instructions}
				</Button>
			</Box>
			{isLoading ? (
				<>
					<GameCardSkeleton />
				</>
			) : (
				<>
					{active == 'buy' ? (
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
							{data?.map((offer, index) => {
								return <GameCard key={index} offer={offer} />
							})}
						</Box>
					) : (
						<Instructions />
					)}
				</>
			)}
			<BottomNavigate />
		</Box>
	)
}

export default GamePage
