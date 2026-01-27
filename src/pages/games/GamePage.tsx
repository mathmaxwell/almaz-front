import Header from '../../components/Header/Header'
import { useTokenStore } from '../../store/token/useTokenStore'
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
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useGamesStoreModal } from '../../store/modal/useGameModal'
import EditIcon from '@mui/icons-material/Edit'
import { useGameStore } from '../../store/game/useGameStore'
import { useTheme } from '@mui/material/styles'
import CreateIcon from '@mui/icons-material/Create'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { useState } from 'react'
import GameInfo from '../../components/modal/GameInfo'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { useOfferStoreModal } from '../../store/modal/useOfferModal'
import type { IOffer } from '../../types/games/games'
import { useQuery } from '@tanstack/react-query'
import { getOffer } from '../../api/games/offer'
import BottomNavigate from '../home/BottomNavigate'
import { useSavedGamesStore } from '../../store/cart/useCartStore'
import { useVideoModalStore } from '../../store/modal/useVideoModalStore'
const GamePage = () => {
	const theme = useTheme()
	const { toggle, reset, getCount } = useSavedGamesStore()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const isDesctop = useMediaQuery(theme.breakpoints.down('md'))
	const { lang, t } = useTranslationStore()
	const { game } = useGameStore()
	const { token } = useTokenStore()
	const isAdmin = import.meta.env.VITE_ADMINTOKEN == token
	const apiUrl = import.meta.env.VITE_API_URL
	const { openModal } = useGamesStoreModal()
	const [open, setOpen] = useState(false)
	const { open: openVideo } = useVideoModalStore()
	const { openModal: offerCreate } = useOfferStoreModal()
	const { data, isLoading } = useQuery<IOffer[], Error>({
		queryKey: ['offer', token],
		queryFn: async () => {
			const result = await getOffer({ token, gameId: game.id })
			return result ?? []
		},
		enabled: !!token,
	})
	const [text, setText] = useState('')
	const [img, setImg] = useState('')
	const [video, setVideo] = useState('')
	return (
		<>
			<Header />
			<GameInfo
				setOpen={setOpen}
				open={open}
				text={text}
				img={img}
				url={video}
			/>
			<Box
				onClick={() => {
					setText(lang == 'ru' ? game.howToUseRu : game.howToUseRu)
					setImg(`${apiUrl}${game.helpImage}`)
					setVideo(`${apiUrl}${game.video}`)
					setOpen(true)
				}}
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'start',
					gap: 2,
					p: 2,
					backgroundColor: theme.palette.background.paper,
					mb: 2,
				}}
			>
				<img
					src={`${apiUrl}${game.image}`}
					alt='game name'
					style={{ width: '50px', height: '50px', objectFit: 'contain' }}
				/>
				<Typography variant='h4'>{game.name}</Typography>
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
			{isLoading ? (
				<>loading</>
			) : (
				<>
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
						{data?.map(offer => {
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
											setOpen(true)
											setText(lang == 'ru' ? offer.ruDesc : offer.uzDesc)
											setImg(`${apiUrl}${offer.image}`)
											setVideo(`${apiUrl}${game.video}`)
										}}
										component='img'
										height={isMobile ? '200px' : isDesctop ? '230px' : '260px'}
										image={`${apiUrl}${offer.image}`}
										alt={offer.ruName}
										sx={{ objectFit: 'cover' }}
									/>
									<CardContent
										onClick={() => {
											openVideo({
												title: lang == 'ru' ? offer.ruDesc : offer.uzDesc,
												video: {
													type: 'backend',
													url: `${apiUrl}${offer.video}`,
												},
											})
										}}
									>
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
											<Typography
												variant='body2'
												sx={{ color: 'text.secondary' }}
											>
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
										{isAdmin && (
											<IconButton>
												<CreateIcon
													color='primary'
													onClick={e => {
														e.stopPropagation()
														offerCreate(offer)
													}}
												/>
											</IconButton>
										)}
									</CardActions>
								</Card>
							)
						})}
					</Box>
				</>
			)}
			<BottomNavigate />
		</>
	)
}

export default GamePage
