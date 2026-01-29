import { useQuery } from '@tanstack/react-query'
import Header from '../../components/Header/Header'
import { useTokenStore } from '../../store/token/useTokenStore'
import type { IUser } from '../../types/user/user'
import BottomNavigate from '../home/BottomNavigate'
import { getUserById } from '../../api/login/login'
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
import { useTranslationStore } from '../../store/language/useTranslationStore'
import {
	calculateTransactions,
	type ITransactions,
} from '../../types/transactions/transactions'
import { getTransactionsByUser } from '../../api/transactions/transactions'
import { updateNumberFormat } from '../../func/number'
import LoadingProgress from '../../components/Loading/LoadingProgress'

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
	const { data, isLoading } = useQuery<ITransactions[], Error>({
		queryKey: ['userPayments', token],
		queryFn: async () => (await getTransactionsByUser(token)) ?? [],
		enabled: !!token,
	})
	const information = calculateTransactions(data)
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'start',
				gap: 2,
				width: '100%',
				height: '100vh',
				background: `linear-gradient(135deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.neonGreen} 50%, ${theme.palette.custom.gradientEnd} 100%)`,
				overflowY: 'auto',
			}}
		>
			{isLoading && (
				<>
					<LoadingProgress />
				</>
			)}
			<Header />
			<Box
				sx={{
					my: 2,
					background: `linear-gradient(0deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.neonGreen} 50%, ${theme.palette.custom.gradientEnd} 100%)`,
					boxShadow: '0 0px 24px rgba(0,0,0,0.3)',
					width: '100%',
					p: 2,
					borderRadius: 12,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Typography
					sx={{ fontFamily: 'Bitcount' }}
					variant='h4'
					textAlign={'center'}
				>
					{userInfo?.login}
				</Typography>
				<Typography sx={{ fontFamily: 'Bitcount' }} align='center' variant='h5'>
					{t.balance}: {updateNumberFormat(userInfo?.balance || '')} {t.som}
				</Typography>
			</Box>
			<TableContainer
				component={Paper}
				sx={{
					background: `linear-gradient(135deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.neonGreen} 50%, ${theme.palette.custom.gradientEnd} 100%)`,
					boxShadow: '0 0px 24px rgba(0,0,0,0.9)',
				}}
			>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell align='center'>{t.game_title}</TableCell>
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
									<TableCell align='center' component='th' scope='row'>
										{info.gameName}
									</TableCell>
									<TableCell align='center'>{info.donatName}</TableCell>
									<TableCell align='center'>{info.count}</TableCell>
									<TableCell
										sx={{
											fontSize: '24px',
										}}
										align='center'
									>
										{updateNumberFormat(info.price)}
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<BottomNavigate />
		</Box>
	)
}

export default Profile
