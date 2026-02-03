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
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { useQuery } from '@tanstack/react-query'
import Header from '../../components/Header/Header'
import BottomNavigate from '../home/BottomNavigate'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { deleteUser, getUsers } from '../../api/login/login'
import { useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import { useTokenStore } from '../../store/token/useTokenStore'
import { createTransactions } from '../../api/transactions/transactions'
import { updateNumberFormat } from '../../func/number'
const Users = () => {
	const theme = useTheme()
	const { token } = useTokenStore()
	const { t } = useTranslationStore()
	const navigate = useNavigate()
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(15)
	const [filterLogin, setFilterLogin] = useState('')
	const [filterToken, setFilterToken] = useState('')
	const [filterBalanceMin, setFilterBalanceMin] = useState('')
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: [
			'users',
			page,
			rowsPerPage,
			filterLogin,
			filterToken,
			filterBalanceMin,
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
			}
			const response = await getUsers({
				page: params.page,
				count: params.count,
				login: params.login,
				Token: params.token,
				StartBalance: params.startBalance,
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
	const clearFilters = () => {
		setFilterLogin('')
		setFilterToken('')
		setFilterBalanceMin('')
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
				sx={{ fontWeight: 600, my: 2, fontFamily: 'Bitcount' }}
			>
				{t.users}
			</Typography>
			<Box
				sx={{
					display: 'flex',
					gap: 2,
					flexWrap: 'wrap',
					mb: 3,
					alignItems: 'flex-end',
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
					sx={{ minWidth: 180 }}
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
					sx={{ minWidth: 180 }}
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
					size='small'
					type='number'
					value={filterBalanceMin}
					onChange={e => {
						setFilterBalanceMin(e.target.value)
						setPage(0)
					}}
					sx={{ minWidth: 140 }}
					InputProps={{
						startAdornment: <InputAdornment position='start'>≥</InputAdornment>,
					}}
				/>
				{hasFilters && (
					<IconButton
						onClick={clearFilters}
						color='error'
						title={t.reset_filters}
					>
						<ClearIcon />
					</IconButton>
				)}
			</Box>
			<Paper
				sx={{
					width: '100%',
					overflow: 'hidden',
					background: `linear-gradient(135deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.neonGreen} 50%, ${theme.palette.custom.gradientEnd} 100%)`,
					boxShadow: '0 0px 24px rgba(0,0,0,0.9)',
				}}
			>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell align='center' sx={{ fontWeight: 700 }}>
									Login
								</TableCell>
								<TableCell align='center' sx={{ fontWeight: 700 }}>
									{t.password}
								</TableCell>
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
										<TableCell align='center'>{row.password ?? '—'}</TableCell>
										<TableCell align='center'>
											{row.balance != null
												? updateNumberFormat(row.balance) + ` ${t.som}`
												: '—'}
										</TableCell>

										<TableCell align='center'>
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
