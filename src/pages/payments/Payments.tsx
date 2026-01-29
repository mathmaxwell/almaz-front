import { useQuery } from '@tanstack/react-query'
import Header from '../../components/Header/Header'
import { useTokenStore } from '../../store/token/useTokenStore'
import BottomNavigate from '../home/BottomNavigate'
import type { IPayment } from '../../types/payment/payment'
import {
	deletePayment,
	getPayment,
	updatePayment,
} from '../../api/payment/payment'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ClearIcon from '@mui/icons-material/Clear'
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
	useTheme,
} from '@mui/material'

const Payments = () => {
	const theme = useTheme()
	const { t } = useTranslationStore()
	const { token } = useTokenStore()
	const { data, isLoading, refetch } = useQuery<IPayment[], Error>({
		queryKey: ['allPayments', token],
		queryFn: async () => (await getPayment(token)) ?? [],
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
								<TableCell>{t.price}</TableCell>
								<TableCell align='right'>{t.status}</TableCell>
								<TableCell align='right'>{t.accept}</TableCell>
								<TableCell align='right'>{t.decline}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data?.map((row, index) => (
								<TableRow
									key={index}
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
									<TableCell
										align='right'
										sx={{ color: 'green' }}
										onClick={async () => {
											const result = confirm(`${t.confirm_accept}`)
											if (result) {
												await updatePayment({
													token,
													id: row.id,
													isWorking: false,
													userId: row.userId,
												})
												refetch()
											}
										}}
									>
										<CheckCircleIcon />
									</TableCell>
									<TableCell
										align='right'
										sx={{ color: 'red' }}
										onClick={async () => {
											const result = confirm(`${t.confirm_delete}`)
											if (result) {
												await deletePayment({ token, id: row.id })
											}
										}}
									>
										<ClearIcon />
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

export default Payments
