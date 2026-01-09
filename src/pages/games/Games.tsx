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
							alignItems: 'center',
							justifyContent: 'center',
							gap: 2,
						}}
					>
						{data?.map(g => (
							<Card sx={{ maxWidth: 345 }} key={g.id}>
								<CardActionArea
									onClick={() => {
										setGame(g)
										navigate(`/${g.name}/${g.id}`)
									}}
								>
									<CardMedia
										component='img'
										height='200'
										image={`${apiUrl}${g.image}`}
										alt={g.id}
									/>
									<CardContent>
										<Typography variant='h5'>{g.name}</Typography>
									</CardContent>
								</CardActionArea>
							</Card>
						))}
					</Box>
				</>
			)}
		</>
	)
}

export default Games
