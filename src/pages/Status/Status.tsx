import { Box, Button, Typography, useTheme } from '@mui/material'
import Header from '../../components/Header/Header'
import BottomNavigate from '../home/BottomNavigate'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { orderStatus } from '../../api/buy/buy'
import type { IStatus } from '../../types/buy/buy'
import { useTranslationStore } from '../../store/language/useTranslationStore'

const Status = () => {
	const { gameId, order } = useParams()
	const { t } = useTranslationStore()
	const theme = useTheme()
	const { data, refetch } = useQuery<IStatus>({
		queryKey: ['order', gameId, order],
		queryFn: async () => {
			const result = await orderStatus({ order: order!, gameId: gameId! })
			return result ?? []
		},
		enabled: !!order,
	})

	return (
		<>
			<Box
				sx={{
					height: '100vh',
					background: `linear-gradient(135deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.neonGreen} 50%, ${theme.palette.custom.gradientEnd} 100%)`,
					overflowY: 'auto',
				}}
			>
				<Header />
				<Button
					fullWidth
					variant='contained'
					onClick={() => {
						refetch()
					}}
				>
					{t.update}
				</Button>
				<Typography>
					{t.status} - {data?.status}
				</Typography>
				<BottomNavigate />
			</Box>
		</>
	)
}

export default Status
