import Header from '../../components/Header/Header'
import BottomNavigate from '../home/BottomNavigate'
import {
	Box,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	useTheme,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTokenStore } from '../../store/token/useTokenStore'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import type { IUser } from '../../types/user/user'
import { getUserById } from '../../api/login/login'
import { getTransactionsByUser } from '../../api/transactions/transactions'
import type { ITransactions } from '../../types/transactions/transactions'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingProgress from '../../components/Loading/LoadingProgress'
import { updateNumberFormat } from '../../func/number'
import { useState } from 'react'
const History = () => {
	const { token, setBalance } = useTokenStore()
	const { userId } = useParams()
	const theme = useTheme()
	const { t } = useTranslationStore()
	const navigate = useNavigate()
	const [active, setActive] = useState<'buy' | 'instructions'>('buy')
	const { data: userInfo } = useQuery<IUser, Error>({
		queryKey: ['userInfo', token, userId],
		queryFn: async () => {
			const result = await getUserById({ userId: userId ? userId : token })
			setBalance(result.balance.toString())
			return result
		},
		enabled: !!token,
	})
	const { data, isLoading: loadingPayment } = useQuery<ITransactions[], Error>({
		queryKey: ['userPayments', token, userId],
		queryFn: async () =>
			(await getTransactionsByUser(userId ? userId : token)) ?? [],
		enabled: !!token,
	})
	const isAdmin = import.meta.env.VITE_ADMINTOKEN === token
	const glassCard = {
		backgroundColor:
			theme.palette.mode === 'dark'
				? 'rgba(18, 24, 34, 0.7)'
				: 'rgba(255, 255, 255, 0.7)',
		backdropFilter: 'blur(16px)',
		WebkitBackdropFilter: 'blur(16px)',
		border: `1px solid ${
			theme.palette.mode === 'dark'
				? 'rgba(255,255,255,0.06)'
				: 'rgba(0,0,0,0.04)'
		}`,
	}

	return (
		<Box
			sx={{
				minHeight: '100vh',
				background: `linear-gradient(135deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.neonGreen} 50%, ${theme.palette.custom.gradientEnd} 100%)`,
				overflowY: 'auto',
			}}
		>
			<Header />
			{loadingPayment && <LoadingProgress />}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 2,
					px: { xs: 1.5, sm: 2 },
				}}
			>
				<Box
					sx={{
						...glassCard,
						borderRadius: 3,
						p: 2.5,
						width: '100%',
						textAlign: 'center',
						boxShadow:
							theme.palette.mode === 'dark'
								? '0 8px 32px rgba(0, 0, 0, 0.3)'
								: '0 8px 32px rgba(0, 0, 0, 0.08)',
					}}
				>
					<Typography
						variant='body2'
						sx={{ color: theme.palette.text.secondary, mb: 0.5 }}
					>
						{t.balance}
					</Typography>
					<Typography
						variant='h5'
						sx={{ fontWeight: 700, color: theme.palette.primary.main }}
					>
						{updateNumberFormat(userInfo?.balance || '')} {t.som}
					</Typography>
				</Box>
				<Box
					sx={{
						width: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						...glassCard,
						borderRadius: 3,
						overflow: 'hidden',
						p: 0.5,
					}}
				>
					<Button
						onClick={() => {
							setActive('buy')
						}}
						fullWidth
						variant={active == 'buy' ? 'contained' : 'text'}
						sx={{
							py: 1.2,
							borderRadius: 2.5,
							fontWeight: 600,
						}}
					>
						{t.top_up}
					</Button>
					<Button
						onClick={() => {
							setActive('instructions')
						}}
						fullWidth
						variant={active == 'instructions' ? 'contained' : 'text'}
						sx={{
							py: 1.2,
							borderRadius: 2.5,
							fontWeight: 600,
						}}
					>
						{t.purchases}
					</Button>
				</Box>
				<TableContainer
					component={Paper}
					sx={{
						...glassCard,
						borderRadius: 3,
						boxShadow:
							theme.palette.mode === 'dark'
								? '0 4px 20px rgba(0, 0, 0, 0.3)'
								: '0 4px 20px rgba(0, 0, 0, 0.08)',
					}}
				>
					<Table aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell align='center'>{t.time}</TableCell>
						
								{active == 'instructions' && (
									<TableCell align='center'>
										{userId ? t.filled_by : t.donation_name}
									</TableCell>
								)}
								{active == 'buy' && isAdmin && (
									<TableCell align='center'>{t.created_by}</TableCell>
								)}
								<TableCell align='center'>
									{t.price} ({t.som})
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data
								?.filter(g => (active == 'buy' ? g.price > 0 : g.price < 0))
								.map((row, index) => (
									<TableRow
										key={index}
										sx={{
											'&:last-child td, &:last-child th': { border: 0 },
											cursor: active == 'instructions' ? 'pointer' : 'default',
										}}
										onClick={() => {
											active == 'instructions' &&
												navigate(`/status/${row.gameName}/${row.order}`)
										}}
									>
										<TableCell align='center' component='th' scope='row'>
											{row.hour.toString().padStart(2, '0')}:
											{row.minute.toString().padStart(2, '0')}, {row.day}.
											{row.month.toString().padStart(2, '0')}.{row.year}
										</TableCell>
									
										{active == 'instructions' && (
											<TableCell align='center'>
												{userId ? row.createdBy : row.donatName}
											</TableCell>
										)}
										{active == 'buy' && isAdmin && (
											<TableCell align='center'>{row.createdBy}</TableCell>
										)}
										<TableCell
											sx={{
												fontSize: '1.1rem',
												fontWeight: 700,
												color:
													row.price > 0
														? theme.palette.success.main
														: theme.palette.error.main,
											}}
											align='center'
										>
											{row.price > 0 ? '+' : ''}
											{updateNumberFormat(row.price)}
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>

			<BottomNavigate />
		</Box>
	)
}

export default History
