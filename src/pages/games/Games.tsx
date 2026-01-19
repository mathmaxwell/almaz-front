import { useQuery } from '@tanstack/react-query'
import { useTokenStore } from '../../store/token/useTokenStore'
import { getGames } from '../../api/games/games'
import type { IGames } from '../../types/games/games'
import {
	Box,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../../store/game/useGameStore'
const Games = () => {
	const { setGame } = useGameStore()
	const navigate = useNavigate()
	const apiUrl = import.meta.env.VITE_API_URL
	const { token } = useTokenStore()
	const { data, isLoading } = useQuery<IGames[], Error>({
		queryKey: ['games', token],
		queryFn: async () => {
			const result = await getGames(token)
			return result ?? []
		},
		enabled: !!token,
	})
	return (
		<>
			{isLoading ? (
				<>loading</>
			) : (
				<>
					<Box
						sx={{
							display: 'flex',
							width: '100vw',
							overflowX: 'auto',
							gap: 2,
						}}
					>
						{data?.map(g => {
							if (g.place === 'top') {
								return (
									<>
										<Box
											key={g.id}
											onClick={() => {
												setGame(g)
												navigate(`/${g.name}/${g.id}`)
											}}
										>
											<img
												src={`${apiUrl}${g.image}`}
												style={{
													width: '100px',
													height: '100px',
													objectFit: 'cover',
												}}
												alt='game'
											/>
										</Box>
									</>
								)
							}
						})}
					</Box>
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: {
								xs: '1fr 1fr',
								sm: '1fr 1fr 1fr',
								md: '1fr 1fr 1fr 1fr',
								lg: '1fr 1fr 1fr 1fr 1fr',
							},
							gap: 2,
							width: '100%',
						}}
					>
						{data?.map(g => {
							if (g.place === 'bot') {
								return (
									<Card sx={{ width: '100%' }} key={g.id}>
										<CardActionArea
											onClick={() => {
												setGame(g)
												navigate(`/${g.name}/${g.id}`)
											}}
										>
											<CardMedia
												sx={{ width: '100%' }}
												component='img'
												image={`${apiUrl}${g.image}`}
												alt={g.id}
											/>
											<CardContent sx={{ height: '100px' }}>
												<Typography variant='h5'>{g.name}</Typography>
											</CardContent>
										</CardActionArea>
									</Card>
								)
							}
						})}
					</Box>
				</>
			)}
		</>
	)
}

export default Games
