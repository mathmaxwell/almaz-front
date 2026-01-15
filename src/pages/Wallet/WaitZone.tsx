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
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import type { IPayment } from '../../types/payment/payment'
import { getPaymentByUser } from '../../api/payment/payment'
import { useTokenStore } from '../../store/token/useTokenStore'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import LoadingProgress from '../../components/Loading/LoadingProgress'

const WaitZone = () => {
	const { token } = useTokenStore()
	const { t } = useTranslationStore()
	const { data, isLoading, refetch } = useQuery<IPayment[], Error>({
		queryKey: ['userPayments', token],
		queryFn: async () =>
			(await getPaymentByUser({ token, userId: token })) ?? [],
		enabled: !!token,
	})
	return (
		<>
			<Header />
			{isLoading && <LoadingProgress />}
			<Box
				sx={{
					p: { xs: 2, sm: 3 },
					mx: 'auto',
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
				}}
			>
				<Button
					fullWidth
					variant='contained'
					loading={isLoading}
					onClick={() => {
						refetch()
					}}
				>
					{t.update}
				</Button>
				<TableContainer component={Paper}>
					<Table aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell>{t.price}</TableCell>
								<TableCell align='right'>{t.status}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data?.map(row => (
								<TableRow
									key={row.id}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell component='th' scope='row'>
										{row.price} {t.som}
									</TableCell>
									<TableCell
										align='right'
										sx={{ color: row.isWorking ? 'yellow' : 'green' }}
									>
										{row.isWorking ? t.pending : t.finished}
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

export default WaitZone
