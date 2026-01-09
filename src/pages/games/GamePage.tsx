import Header from '../../components/Header/Header'
import { useTokenStore } from '../../store/token/useTokenStore'
import {
	Box,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	IconButton,
	Typography,
} from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'
import { useGamesStoreModal } from '../../store/modal/useGameModal'
import EditIcon from '@mui/icons-material/Edit'
import { useGameStore } from '../../store/game/useGameStore'
import { useTheme } from '@mui/material/styles'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { useState } from 'react'
import GameInfo from '../../components/modal/GameInfo'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { useOfferStoreModal } from '../../store/modal/useOfferModal'
import type { IOffer } from '../../types/games/games'
import { useQuery } from '@tanstack/react-query'
import { getOffer } from '../../api/games/offer'
const GamePage = () => {
	const theme = useTheme()
	const { lang } = useTranslationStore()
	const { game } = useGameStore()
	const { token } = useTokenStore()
	const isAdmin = import.meta.env.VITE_ADMINTOKEN == token
	const apiUrl = import.meta.env.VITE_API_URL
	const { openModal } = useGamesStoreModal()
	const [open, setOpen] = useState(false)
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
	return (
		<>
			<Header />
			<GameInfo setOpen={setOpen} open={open} text={text} img={img} />
			<Box
				onClick={() => {
					setText(lang == 'ru' ? game.howToUseRu : game.howToUseRu)
					setImg(`${apiUrl}${game.helpImage}`)
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
					style={{ width: '50px', height: '50px', objectFit: 'cover' }}
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
					{data?.map(offer => (
						<Card sx={{ maxWidth: 345 }} key={offer.id}>
							<CardActionArea>
								<CardMedia
									component='img'
									height='200'
									image={`${apiUrl}${offer.image}`}
									alt={offer.ruName}
								/>
								<CardContent
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										gap: 2,
									}}
								>
									<Typography gutterBottom variant='h5' component='div'>
										{lang == 'ru' ? offer.ruName : offer.uzName}
									</Typography>
									<Typography
										sx={{ mr: 'auto' }}
										gutterBottom
										variant='h5'
										component='div'
									>
										{offer.price}
									</Typography>

									<IconButton
										onClick={e => {
											e.stopPropagation()
											setText(lang == 'ru' ? offer.ruDesc : offer.uzDesc)
											setImg(`${apiUrl}${game.helpImage}`)
											setOpen(true)
										}}
									>
										<HelpIcon />
									</IconButton>
								</CardContent>
							</CardActionArea>
						</Card>
					))}
				</>
			)}
		</>
	)
}

export default GamePage
