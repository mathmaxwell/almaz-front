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
import { useParams } from 'react-router-dom'
import LoadingProgress from '../../components/Loading/LoadingProgress'
import { updateNumberFormat } from '../../func/number'
import { useState } from 'react'
const History = () => {
	const { token, setBalance } = useTokenStore()
	const { userId } = useParams()
	const theme = useTheme()
	const { t } = useTranslationStore()
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
	return (
		<Box
			sx={{
				height: '100vh',
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
				}}
			>
				<Typography sx={{ fontFamily: 'Bitcount' }} align='center' variant='h5'>
					{t.balance}: {updateNumberFormat(userInfo?.balance || '')} {t.som}
				</Typography>
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
						}}
					>
						{t.top_up}
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
						{t.purchases}
					</Button>
				</Box>
				<TableContainer
					component={Paper}
					sx={{
						background: `linear-gradient(135deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.neonGreen} 50%, ${theme.palette.custom.gradientEnd} 100%)`,
						boxShadow: '0 0px 24px rgba(0,0,0,0.9)',
					}}
				>
					<Table aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell align='center'>{t.time}</TableCell>
								{active == 'instructions' && (
									<TableCell align='center'>{t.game_title}</TableCell>
								)}
								{active == 'instructions' && (
									<TableCell align='center'>
										{userId ? t.filled_by : t.donation_name}
									</TableCell>
								)}
								{active == 'buy' && (
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
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
									>
										<TableCell align='center' component='th' scope='row'>
											{row.hour.toString().padStart(2, '0')}:
											{row.minute.toString().padStart(2, '0')}, {row.day}.
											{row.month.toString().padStart(2, '0')}.{row.year}
										</TableCell>
										{active == 'instructions' && (
											<TableCell align='center'>{row.gameName}</TableCell>
										)}
										{active == 'instructions' && (
											<TableCell align='center'>
												{userId ? row.createdBy : row.donatName}
											</TableCell>
										)}
										{active == 'buy' && (
											<TableCell align='center'>{row.createdBy}</TableCell>
										)}
										<TableCell
											sx={{
												fontSize: '24px',
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
