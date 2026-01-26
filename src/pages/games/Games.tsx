import { useQuery } from '@tanstack/react-query'
import { useTokenStore } from '../../store/token/useTokenStore'
import { getGames } from '../../api/games/games'
import type { IGames } from '../../types/games/games'
import { Box, Card, CardMedia, useMediaQuery, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../../store/game/useGameStore'
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
												borderRadius: 20,
											}}
											alt={g.name}
										/>
									</Box>
								)
							}
						})}
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
						{data?.map(g => {
							if (g.place === 'bot') {
								return (
									<Card
										sx={{
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'space-between',
											position: 'relative',
											borderRadius: 4,
										}}
										key={g.id}
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
											}}
											component='img'
											image={`${apiUrl}${g.image}`}
											alt={g.id}
											height={
												isMobile ? '200px' : isDesctop ? '230px' : '260px'
											}
										/>
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
