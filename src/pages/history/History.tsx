import Header from '../../components/Header/Header'
import BottomNavigate from '../home/BottomNavigate'
import {
	Box,
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
const History = () => {
	const { token, setBalance } = useTokenStore()
	const { userId } = useParams()

	const theme = useTheme()
	const { t } = useTranslationStore()
	const { data: userInfo } = useQuery<IUser, Error>({
		queryKey: ['userInfo', token, userId],
		queryFn: async () => {
			const result = await getUserById({ userId: userId ? userId : token })
			setBalance(result.balance.toString())
			return result
		},
		enabled: !!token,
	})
	const { data } = useQuery<ITransactions[], Error>({
		queryKey: ['userPayments', token],
		queryFn: async () =>
			(await getTransactionsByUser(userId ? userId : token)) ?? [],
		enabled: !!token,
	})
	return (
		<>
			<Header />
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 2,
				}}
			>
				<Typography align='center' variant='h5'>
					{t.balance}: {userInfo?.balance} {t.som}
				</Typography>
				<TableContainer component={Paper}>
					<Table aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell align='left'>{t.time}</TableCell>
								<TableCell align='center'>{t.game_title}</TableCell>
								<TableCell align='center'>{t.donation_name}</TableCell>
								<TableCell align='right'>
									{t.price} ({t.som})
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data?.map((row, index) => (
								<TableRow
									key={index}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell align='left' component='th' scope='row'>
										{row.hour.toString().padStart(2, '0')}:
										{row.minute.toString().padStart(2, '0')}, {row.day}.
										{row.month.toString().padStart(2, '0')}.{row.year}
									</TableCell>
									<TableCell align='center'>{row.gameName}</TableCell>
									<TableCell align='center'>{row.donatName}</TableCell>
									<TableCell
										align='right'
										sx={{
											color: row.price > 0 ? theme.palette.success.main : 'red',
										}}
									>
										{row.price > 0 ? `+${row.price}` : `-${row.price}`}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>

			<BottomNavigate />
		</>
	)
}

export default History
