import { useState } from 'react'
import type { ChangeEvent } from 'react'
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Box,
	InputAdornment,
	IconButton,
	Typography,
	CircularProgress,
	Alert,
	useTheme,
	Button,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useQuery } from '@tanstack/react-query'
import Header from '../../components/Header/Header'
import BottomNavigate from '../home/BottomNavigate'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { deleteUser, getUsers, updateUser } from '../../api/login/login'
import { useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import { useTokenStore } from '../../store/token/useTokenStore'
import { createTransactions } from '../../api/transactions/transactions'
import { updateNumberFormat } from '../../func/number'
import StarIcon from '@mui/icons-material/Star'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
const Users = () => {
	const theme = useTheme()
	const { token } = useTokenStore()
	const { t } = useTranslationStore()
	const navigate = useNavigate()
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(15)
	const [filterLogin, setFilterLogin] = useState('')
	const [filterToken, setFilterToken] = useState('')
	const [userType, setUserType] = useState('')
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [filterBalanceMin, setFilterBalanceMin] = useState('')
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: [
			'users',
			page,
			rowsPerPage,
			filterLogin,
			filterToken,
			filterBalanceMin,
			userType,
		],
		queryFn: async () => {
			const params = {
				page: page + 1,
				count: rowsPerPage,
				login: filterLogin.trim() || undefined,
				token: filterToken.trim() || undefined,
				startBalance: filterBalanceMin.trim()
					? Number(filterBalanceMin)
					: undefined,
				userType: userType,
			}
			const response = await getUsers({
				page: params.page,
				count: params.count,
				login: params.login,
				Token: params.token,
				StartBalance: params.startBalance,
				userRole: params.userType,
			})
			return {
				users: response.users ?? [],
				total: response.total ?? 0,
			}
		},
	})
	const rows = data?.users ?? []
	const totalCount = data?.total ?? 0
	const handleChangePage = (_: unknown, newPage: number) => setPage(newPage)
	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	}

	const hasFilters = filterLogin || filterToken || filterBalanceMin
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
			<Header />
			<Typography
				variant='h5'
				textAlign='center'
				sx={{ fontWeight: 600, fontFamily: 'Bitcount', mt: 2 }}
			>
				{t.users}
			</Typography>
			<Box
				sx={{
					display: 'flex',
					gap: 2,
					flexWrap: 'wrap',
					alignItems: 'flex-end',
					p: 2,
				}}
			>
				<TextField
					label={t.name}
					size='small'
					value={filterLogin}
					onChange={e => {
						setFilterLogin(e.target.value)
						setPage(0)
					}}
					fullWidth
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<SearchIcon fontSize='small' />
							</InputAdornment>
						),
					}}
				/>
				<TextField
					label='Токен'
					size='small'
					value={filterToken}
					onChange={e => {
						setFilterToken(e.target.value)
						setPage(0)
					}}
					fullWidth
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<SearchIcon fontSize='small' />
							</InputAdornment>
						),
					}}
				/>
				<TextField
					label={t.balance_from}
					fullWidth
					size='small'
					type='number'
					value={filterBalanceMin}
					onChange={e => {
						setFilterBalanceMin(e.target.value)
						setPage(0)
					}}
					InputProps={{
						startAdornment: <InputAdornment position='start'>≥</InputAdornment>,
					}}
				/>
				<Button
					variant={userType ? 'outlined' : 'contained'}
					fullWidth
					onClick={() => {
						userType ? setUserType('') : setUserType('superUser')
					}}
				>
					{t.super_users}
				</Button>
				<Button
					fullWidth
					variant={showPassword ? 'outlined' : 'contained'}
					onClick={() => {
						setShowPassword(prev => !prev)
					}}
				>
					{t.show_password}
				</Button>
			</Box>
			<Paper
				sx={{
					width: '100%',
					overflow: 'hidden',
					background: `linear-gradient(135deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.neonGreen} 50%, ${theme.palette.custom.gradientEnd} 100%)`,
					boxShadow: '0 0px 24px rgba(0,0,0,0.9)',
					height: '100%',
					overflowY: 'scroll',
				}}
			>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell align='center' sx={{ fontWeight: 700 }}>
									Login
								</TableCell>
								{showPassword && (
									<TableCell align='center' sx={{ fontWeight: 700 }}>
										{t.password}
									</TableCell>
								)}
								<TableCell align='center' sx={{ fontWeight: 700 }}>
									{t.balance}
								</TableCell>
								<TableCell align='center' sx={{ fontWeight: 700 }}>
									{t.actions}
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={4} align='center' sx={{ py: 10 }}>
										<CircularProgress />
									</TableCell>
								</TableRow>
							) : error ? (
								<TableRow>
									<TableCell colSpan={4}>
										<Alert severity='error'>{t.data_load_error}</Alert>
									</TableCell>
								</TableRow>
							) : rows.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={4}
										align='center'
										sx={{ py: 8, color: 'text.secondary' }}
									>
										{hasFilters ? t.nothing_found_filters : t.no_users_yet}
									</TableCell>
								</TableRow>
							) : (
								rows.map((row, index) => (
									<TableRow
										hover
										key={index}
										onClick={() => navigate(`/users/${row.token}`)}
									>
										<TableCell align='center'>{row.login ?? '—'}</TableCell>
										{showPassword && (
											<TableCell align='center'>
												{row.password ?? '—'}
											</TableCell>
										)}
										<TableCell align='center'>
											{row.balance != null
												? updateNumberFormat(row.balance) + ` ${t.som}`
												: '—'}
										</TableCell>

										<TableCell
											align='center'
											sx={{
												display: 'flex',
												gap: 0.5,
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<IconButton
												onClick={async e => {
													e.stopPropagation()

													const isSuper = row.userRole === 'superUser'
													const conf = confirm(
														isSuper
															? t.change_as_regular_user
															: t.change_as_superuser,
													)

													if (!conf) return

													await updateUser({
														token,
														userId: row.token,
														userRole: isSuper ? 'user' : 'superUser', // ✅ FIX
													})

													refetch()
												}}
												size='small'
												color={
													row.userRole === 'superUser' ? 'warning' : 'warning'
												}
												title={t.delete}
											>
												{row.userRole === 'superUser' ? (
													<StarIcon />
												) : (
													<StarOutlineIcon color='info' />
												)}
											</IconButton>

											<IconButton
												size='small'
												color='default'
												title={t.update_balance}
												onClick={async e => {
													e.stopPropagation()
													const sum = prompt(t.enter_amount_to_add_or_remove)
													const sumNumber = Number(sum)
													if (!sumNumber) {
														alert(t.invalid_amount)
														return
													}
													const conf = confirm(
														`${t.change_amount_confirmation} ${sum}`,
													)
													if (conf) {
														await createTransactions({
															userId: row.token,
															price: sumNumber,
															gameName: '-',
															donatName: '-',
															createdBy: 'admin',
														})
														refetch()
													}
												}}
											>
												<EditIcon fontSize='small' />
											</IconButton>

											<IconButton
												onClick={async e => {
													e.stopPropagation()
													if (confirm(t.delete_user_confirmation)) {
														await deleteUser({
															token,
															userId: row.token,
														})
														refetch()
													}
												}}
												size='small'
												color='error'
												title={t.delete}
											>
												<DeleteIcon fontSize='small' />
											</IconButton>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[10, 15, 25, 50, 100]}
					component='div'
					count={totalCount}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					labelRowsPerPage={`${t.rows_per_page}:`}
					labelDisplayedRows={({ from, to, count }) =>
						`${from}–${to} ${t.from} ${count !== -1 ? count : `больше ${to}`}`
					}
				/>
			</Paper>

			<BottomNavigate />
		</Box>
	)
}

export default Users
