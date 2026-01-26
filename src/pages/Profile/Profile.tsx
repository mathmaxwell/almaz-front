import { useQuery } from '@tanstack/react-query'
import Header from '../../components/Header/Header'
import { useTokenStore } from '../../store/token/useTokenStore'
import type { IUser } from '../../types/user/user'
import BottomNavigate from '../home/BottomNavigate'
import { getUserById } from '../../api/login/login'
import {
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
import { useTranslationStore } from '../../store/language/useTranslationStore'
import {
	calculateTransactions,
	type ITransactions,
} from '../../types/transactions/transactions'
import { getTransactionsByUser } from '../../api/transactions/transactions'

const Profile = () => {
	const theme = useTheme()
	const { t } = useTranslationStore()
	const { token, setBalance } = useTokenStore()
	const { data: userInfo } = useQuery<IUser, Error>({
		queryKey: ['userInfo', token],
		queryFn: async () => {
			const result = await getUserById({ userId: token })
			setBalance(result.balance.toString())
			return result
		},
		enabled: !!token,
	})
	const { data } = useQuery<ITransactions[], Error>({
		queryKey: ['userPayments', token],
		queryFn: async () => (await getTransactionsByUser(token)) ?? [],
		enabled: !!token,
	})
	const information = calculateTransactions(data)
	return (
		<>
			<Header />
			<Typography variant='h4' textAlign={'center'}>
				{userInfo?.login}
			</Typography>
			<Typography align='center' variant='h5' sx={{ my: 2 }}>
				{t.balance}: {userInfo?.balance} {t.som}
			</Typography>
			<TableContainer component={Paper}>
				<Table aria-label='simple table'>
					<TableHead>
						<TableRow>
							<TableCell>{t.game_title}</TableCell>
							<TableCell align='center'>{t.donation_name}</TableCell>
							<TableCell align='center'>{t.count}</TableCell>
							<TableCell align='center'>{t.price}</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{information.map((info, index) => {
							return (
								<TableRow
									key={index}
									sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
									<TableCell component='th' scope='row'>
										{info.gameName}
									</TableCell>
									<TableCell align='center'>{info.donatName}</TableCell>
									<TableCell align='center'>{info.count}</TableCell>
									<TableCell
										sx={{
											color:
												info.price > 0 ? theme.palette.success.main : 'red',
										}}
										align='center'
									>
										{info.price}
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<BottomNavigate />
		</>
	)
}

export default Profile
