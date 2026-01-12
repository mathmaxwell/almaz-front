import {
	Box,
	Paper,
	styled,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import Header from '../../components/Header/Header'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import BottomNavigate from '../home/BottomNavigate'
const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.text.secondary,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}))
const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}))
const Profile = () => {
	const { t } = useTranslationStore()
	// const { data: unreadMessagesCount } = useQuery<IUser[]>({
	// 	queryKey: ['unreadMessagesCount', token],
	// 	queryFn: async () => {
	// 		const result = await login({ token })
	// 		return result || []
	// 	},
	// 	enabled: !!token,
	// })
	return (
		<>
			<Header />
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
				<Typography align='center' variant='h4'>
					{t.payment_history}
				</Typography>
				<TableContainer component={Paper} sx={{ maxHeight: 500 }}>
					<Table aria-label='customized table'>
						<TableHead>
							<TableRow>
								<StyledTableCell align='right'>
									{t.payment_amount}
								</StyledTableCell>
								<StyledTableCell align='right'>
									{t.purchase_time}
								</StyledTableCell>
								<StyledTableCell align='right'>
									{t.received_time}
								</StyledTableCell>
								<StyledTableCell align='right'>{t.balance_was}</StyledTableCell>
								<StyledTableCell align='right'>
									{t.balance_became}
								</StyledTableCell>
								<StyledTableCell align='right'>{t.status}</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<StyledTableRow>
								<StyledTableCell align='right'>31.000</StyledTableCell>
								<StyledTableCell align='right'>
									12.12.2025 10:00
								</StyledTableCell>
								<StyledTableCell align='right'>
									12.12.2025 11:00
								</StyledTableCell>
								<StyledTableCell align='right'>0</StyledTableCell>
								<StyledTableCell align='right'>31.000</StyledTableCell>
								<StyledTableCell align='right'>sucsess</StyledTableCell>
							</StyledTableRow>
						</TableBody>
					</Table>
				</TableContainer>
				<Typography align='center' variant='h4'>
					{t.purchase_history}
				</Typography>
				<TableContainer component={Paper} sx={{ maxHeight: 500 }}>
					<Table aria-label='customized table'>
						<TableHead>
							<TableRow>
								<StyledTableCell>{t.game_title}</StyledTableCell>
								<StyledTableCell align='right'>
									{t.donation_name}
								</StyledTableCell>
								<StyledTableCell align='right'>{t.price}</StyledTableCell>
								<StyledTableCell align='right'>
									{t.purchase_time}
								</StyledTableCell>
								<StyledTableCell align='right'>{t.balance_was}</StyledTableCell>
								<StyledTableCell align='right'>
									{t.balance_became}
								</StyledTableCell>
								<StyledTableCell align='right'>{t.status}</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<StyledTableRow>
								<StyledTableCell component='th' scope='row'>
									mlbb
								</StyledTableCell>
								<StyledTableCell align='right'>220 almaz</StyledTableCell>
								<StyledTableCell align='right'>30.000</StyledTableCell>
								<StyledTableCell align='right'>
									12.12.2025 12:00
								</StyledTableCell>
								<StyledTableCell align='right'>31.000</StyledTableCell>
								<StyledTableCell align='right'>1.000</StyledTableCell>
								<StyledTableCell align='right'>sucsess</StyledTableCell>
							</StyledTableRow>
							<StyledTableRow>
								<StyledTableCell component='th' scope='row'>
									mlbb
								</StyledTableCell>
								<StyledTableCell align='right'>220 almaz</StyledTableCell>
								<StyledTableCell align='right'>30.000</StyledTableCell>
								<StyledTableCell align='right'>
									12.12.2025 12:00
								</StyledTableCell>
								<StyledTableCell align='right'>31.000</StyledTableCell>
								<StyledTableCell align='right'>1.000</StyledTableCell>
								<StyledTableCell align='right'>sucsess</StyledTableCell>
							</StyledTableRow>
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
