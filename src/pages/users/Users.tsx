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
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { useQuery } from '@tanstack/react-query'
import Header from '../../components/Header/Header'
import BottomNavigate from '../home/BottomNavigate'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import type { IUser } from '../../types/user/user'
import { getUsers } from '../../api/login/login'
import { useNavigate } from 'react-router-dom'

const Users = () => {
	const { t } = useTranslationStore()
	const navigate = useNavigate()
	const columns = [
		{ id: 'login', label: t.login, align: 'center' as const },
		{ id: 'password', label: t.password, align: 'center' as const },
		{
			id: 'balance',
			label: t.balance,
			align: 'center' as const,
			format: (v: number) => v.toLocaleString() + `  ${t.som}`,
		},
	] satisfies Array<{
		id: keyof IUser
		label: string
		align?: 'left' | 'center' | 'right'
		format?: (v: any) => any
	}>
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(15)
	const [filterLogin, setFilterLogin] = useState('')
	const [filterToken, setFilterToken] = useState('')
	const [filterBalanceMin, setFilterBalanceMin] = useState('')
	const { data, isLoading, error } = useQuery({
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
	const handleChangePage = (_: unknown, newPage: number) => {
		setPage(newPage)
	}
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
		<>
			<Header />

			<Typography
				variant='h5'
				textAlign={'center'}
				sx={{ fontWeight: 600, my: 2 }}
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

			<Paper sx={{ width: '100%', overflow: 'hidden' }}>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								{columns.map(col => (
									<TableCell
										key={col.id}
										align={col.align}
										sx={{ fontWeight: 700 }}
									>
										{col.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>

						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										align='center'
										sx={{ py: 10 }}
									>
										<CircularProgress />
									</TableCell>
								</TableRow>
							) : error ? (
								<TableRow>
									<TableCell colSpan={columns.length}>
										<Alert severity='error'>{t.data_load_error}</Alert>
									</TableCell>
								</TableRow>
							) : rows.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										align='center'
										sx={{ py: 8, color: 'text.secondary' }}
									>
										{hasFilters ? t.nothing_found_filters : t.no_users_yet}
									</TableCell>
								</TableRow>
							) : (
								rows.map(row => (
									<TableRow
										hover
										key={row.token || row.login}
										onClick={() => {
											navigate(`/users/${row.token}`)
										}}
									>
										{columns.map(col => {
											const value = row[col.id]
											return (
												<TableCell key={col.id} align={col.align}>
													{col.format && typeof value === 'number'
														? col.format(value)
														: (value ?? '—')}
												</TableCell>
											)
										})}
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
						`${from}–${to} ${t.from} ${count !== -1 ? count : `${t.more} ${to}`}`
					}
				/>
			</Paper>
			<BottomNavigate />
		</>
	)
}

export default Users
