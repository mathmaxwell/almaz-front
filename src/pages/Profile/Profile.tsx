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
} from '@mui/material'
import Header from '../../components/Header/Header'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import BottomNavigate from '../home/BottomNavigate'
import { useQuery } from '@tanstack/react-query'
import { useTokenStore } from '../../store/token/useTokenStore'
import { getTransactionsByUser } from '../../api/transactions/transactions'
import type { ITransactions } from '../../types/transactions/transactions'
const Profile = () => {
	const { t } = useTranslationStore()
	const { token } = useTokenStore()
	const { data } = useQuery<ITransactions[]>({
		queryKey: ['data', token],
		queryFn: async () => {
			const result = await getTransactionsByUser(token)
			return result || []
		},
		enabled: !!token,
	})

	return (
		<>
			<Header />
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
				<Typography align='center' variant='h4'>
					{t.payment_history}
				</Typography>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell>{t.time}</TableCell>
								<TableCell align='center'>
									{t.price} ({t.som})
								</TableCell>
								<TableCell align='center'>{t.game_title}</TableCell>
								<TableCell align='center'>{t.donation_name}</TableCell>
								<TableCell align='right'>{t.created_by}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data?.map(row => (
								<TableRow
									key={row.price}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell component='th' scope='row'>
										{row.hour.toString().padStart(2, '0')}:
										{row.minute.toString().padStart(2, '0')}, {row.day}.
										{row.month.toString().padStart(2, '0')}.{row.year}
									</TableCell>
									<TableCell
										align='center'
										sx={{
											color: row.price > 0 ? 'green' : 'red',
										}}
									>
										{row.price > 0 ? `+${row.price}` : `-${row.price}`}
									</TableCell>
									<TableCell align='center'>{row.gameName}</TableCell>
									<TableCell align='center'>{row.donatName}</TableCell>
									<TableCell align='right'>{row.createdBy}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<div style={{ height: '50px' }} />
				<BottomNavigate />
			</Box>
		</>
	)
}

export default Profile
