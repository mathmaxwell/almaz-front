import Header from '../../components/Header/Header'
import { useTokenStore } from '../../store/token/useTokenStore'
import {
	Box,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
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
import { CartRow } from './CartRow'
import BottomNavigate from '../home/BottomNavigate'
const GamePage = () => {
	const theme = useTheme()
	const { lang, t } = useTranslationStore()
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
					onClick={e => {
						e.stopPropagation()
						setText('')
						setImg(`${apiUrl}${game.helpImage}`)
						setOpen(true)
					}}
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
					<TableContainer component={Paper} sx={{ p: 0 }}>
						<Table aria-label='simple table' sx={{ p: 0 }}>
							<TableHead sx={{ p: 0 }}>
								<TableRow>
									<TableCell>{t.title}</TableCell>
									<TableCell align='center'>{t.image}</TableCell>
									<TableCell align='center'>{t.price}</TableCell>
									<TableCell align='center'>{t.add_to_cart}</TableCell>
									<TableCell align='center'>{t.buy_now}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{data?.map(row => (
									<CartRow
										key={row.id}
										row={row}
										setOpen={setOpen}
										setText={setText}
										setImg={setImg}
									/>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</>
			)}
			<BottomNavigate />
		</>
	)
}

export default GamePage
