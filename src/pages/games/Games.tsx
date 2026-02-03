import { useQuery } from '@tanstack/react-query'
import { useTokenStore } from '../../store/token/useTokenStore'
import { getGames } from '../../api/games/games'
import type { IGames } from '../../types/games/games'
import { Box, Card, CardMedia, useMediaQuery, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../../store/game/useGameStore'
import GameSkeleton from './GameSkeleton'
const Games = () => {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const isDesctop = useMediaQuery(theme.breakpoints.down('md'))
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
				<>
					<GameSkeleton />
				</>
			) : (
				<>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'start',
							gap: 2,
							width: '100%',
							overflowX: 'auto',
						}}
					>
						{data
							?.filter(g => g.place === 'top')
							.map((g, index) => (
								<Box
									key={index}
									sx={{
										my: 2,
										width: 100,
										borderRadius: 20,
										cursor: 'pointer',
										flexShrink: 0,
										aspectRatio: '1 / 1',
									}}
									onClick={() => {
										setGame(g)
										navigate(`/${g.name}/${g.id}`)
									}}
								>
									<img
										src={`${apiUrl}${g.image}`}
										alt={g.name}
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
											borderRadius: 20,
										}}
									/>
								</Box>
							))}
					</Box>
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
						{data
							?.filter(g => g.place == 'bot')
							.map((g, index) => {
								return (
									<Card
										sx={{
											borderRadius: 8,
											boxShadow: '8px 8px 40px rgba(0,0,0,9)',
										}}
										key={index}
									>
										<CardMedia
											onClick={() => {
												setGame(g)
												navigate(`/${g.name}/${g.id}`)
											}}
											sx={{
												width: '100%',
												objectFit: 'cover',
												objectPosition: 'center',
												aspectRatio: '1 / 1',
											}}
											component='img'
											image={`${apiUrl}${g.image}`}
											alt={g.id}
											// height={
											// 	isMobile ? '200px' : isDesctop ? '230px' : '260px'
											// }
										/>
									</Card>
								)
							})}
					</Box>
				</>
			)}
		</>
	)
}

export default Games
