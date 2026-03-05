import { useState, useMemo } from 'react'
import {
	Box,
	Typography,
	TextField,
	Card,
	Stack,
	Chip,
	Divider,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
	useTheme,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import Header from '../../components/Header/Header'
import BottomNavigate from '../home/BottomNavigate'
import LoadingProgress from '../../components/Loading/LoadingProgress'
import { useQuery } from '@tanstack/react-query'
import { useTokenStore } from '../../store/token/useTokenStore'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { getTransactionsByPeriod } from '../../api/transactions/transactions'
import type { ITransactions, ITransactionsPaginated } from '../../types/transactions/transactions'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DataPicker from '../../components/data/DataPicker'
import { updateNumberFormat } from '../../func/number'

const STATUS_COLORS: Record<string, string> = {
	completed: '#2ecc71',
	pending: '#f39c12',
	failed: '#e74c3c',
}

interface FilterState {
	userId: string
	playerId: string
	serverId: string
	order: string
	status: string
	game: string
}

const EMPTY_FILTER: FilterState = {
	userId: '',
	playerId: '',
	serverId: '',
	order: '',
	status: 'all',
	game: 'all',
}

const TransactionsLog = () => {
	const { token } = useTokenStore()
	const { t } = useTranslationStore()
	const theme = useTheme()
	const navigate = useNavigate()

	const today = dayjs()
	const monthAgo = dayjs().subtract(1, 'month')

	const [start, setStart] = useState({
		startDay: monthAgo.date(),
		startMonth: monthAgo.month() + 1,
		startYear: monthAgo.year(),
	})
	const [end, setEnd] = useState({
		endDay: today.date(),
		endMonth: today.month() + 1,
		endYear: today.year(),
	})

	// draft — что вводит пользователь (не фильтруем)
	const [draft, setDraft] = useState<FilterState>(EMPTY_FILTER)
	// applied — только после нажатия "Поиск"
	const [applied, setApplied] = useState<FilterState>(EMPTY_FILTER)

	const { data, isLoading } = useQuery<ITransactionsPaginated, Error>({
		queryKey: ['transactionsLog', token, start, end],
		queryFn: async () =>
			(await getTransactionsByPeriod({
				token,
				startDay: start.startDay,
				startMonth: start.startMonth,
				startYear: start.startYear,
				endDay: end.endDay,
				endMonth: end.endMonth,
				endYear: end.endYear,
			})) ?? { data: [] },
		enabled: !!token,
	})

	const purchases: ITransactions[] = useMemo(() => {
		return (data?.data ?? []).filter(tx => tx.price < 0)
	}, [data])

	const uniqueGames = useMemo(() => {
		const games = new Set(purchases.map(tx => tx.gameName).filter(g => g && g !== '-'))
		return Array.from(games).sort()
	}, [purchases])

	// фильтрация только по applied — не пересчитывается при каждом вводе
	const filtered = useMemo(() => {
		const { userId, playerId, serverId, order, status, game } = applied
		return purchases.filter(tx => {
			if (status !== 'all' && tx.status !== status) return false
			if (game !== 'all' && tx.gameName !== game) return false
			if (userId && !tx.userId?.toLowerCase().includes(userId.toLowerCase())) return false
			if (playerId && !tx.playerId?.toLowerCase().includes(playerId.toLowerCase())) return false
			if (serverId && !tx.serverId?.toLowerCase().includes(serverId.toLowerCase())) return false
			if (order && !tx.order?.toLowerCase().includes(order.toLowerCase())) return false
			return true
		})
	}, [purchases, applied])

	const applySearch = () => setApplied({ ...draft })
	const resetSearch = () => {
		setDraft(EMPTY_FILTER)
		setApplied(EMPTY_FILTER)
	}

	const glassCard = {
		backgroundColor:
			theme.palette.mode === 'dark'
				? 'rgba(18, 24, 34, 0.7)'
				: 'rgba(255, 255, 255, 0.85)',
		backdropFilter: 'blur(16px)',
		WebkitBackdropFilter: 'blur(16px)',
		border: `1px solid ${
			theme.palette.mode === 'dark'
				? 'rgba(255,255,255,0.06)'
				: 'rgba(0,0,0,0.04)'
		}`,
	}

	const isFiltered =
		applied.userId || applied.playerId || applied.serverId ||
		applied.order || applied.status !== 'all' || applied.game !== 'all'

	return (
		<Box
			sx={{
				minHeight: '100vh',
				background: `linear-gradient(135deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.neonGreen} 50%, ${theme.palette.custom.gradientEnd} 100%)`,
				overflowY: 'auto',
			}}
		>
			<Header />
			{isLoading && <LoadingProgress />}

			<Box sx={{ px: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
				{/* Title */}
				<Box sx={{ ...glassCard, borderRadius: 3, p: 2, textAlign: 'center' }}>
					<Typography variant='h5' fontWeight={700} color='primary'>
						{t.transactions_log}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						{isFiltered ? `${filtered.length} / ${purchases.length}` : purchases.length}
					</Typography>
				</Box>

				{/* Date picker */}
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DataPicker
						start={start}
						setStart={setStart}
						setEnd={setEnd}
						end={end}
					/>
				</LocalizationProvider>

				{/* Filters */}
				<Box sx={{ ...glassCard, borderRadius: 3, p: 2 }}>
					<Stack spacing={1.5}>
						{/* Dropdown filters — мгновенные */}
						<Stack direction='row' spacing={1}>
							<FormControl size='small' sx={{ flex: 1 }}>
								<InputLabel>{t.status}</InputLabel>
								<Select
									value={draft.status}
									label={t.status}
									onChange={e => setDraft(d => ({ ...d, status: e.target.value }))}
								>
									<MenuItem value='all'>{t.all_statuses}</MenuItem>
									<MenuItem value='completed'>{t.Completed}</MenuItem>
									<MenuItem value='pending'>{t.pending}</MenuItem>
									<MenuItem value='failed'>{t.canceled}</MenuItem>
								</Select>
							</FormControl>
							<FormControl size='small' sx={{ flex: 1 }}>
								<InputLabel>{t.game_name}</InputLabel>
								<Select
									value={draft.game}
									label={t.game_name}
									onChange={e => setDraft(d => ({ ...d, game: e.target.value }))}
								>
									<MenuItem value='all'>—</MenuItem>
									{uniqueGames.map(g => (
										<MenuItem key={g} value={g}>{g}</MenuItem>
									))}
								</Select>
							</FormControl>
						</Stack>

						{/* Текстовые поля — отдельные, без авто-фильтра */}
						<Stack direction='row' spacing={1}>
							<TextField
								size='small'
								label='User ID'
								value={draft.userId}
								onChange={e => setDraft(d => ({ ...d, userId: e.target.value }))}
								sx={{ flex: 1 }}
								inputProps={{ style: { fontFamily: 'monospace', fontSize: 12 } }}
							/>
							<TextField
								size='small'
								label='Player ID'
								value={draft.playerId}
								onChange={e => setDraft(d => ({ ...d, playerId: e.target.value }))}
								sx={{ flex: 1 }}
								inputProps={{ style: { fontFamily: 'monospace', fontSize: 12 } }}
							/>
						</Stack>
						<Stack direction='row' spacing={1}>
							<TextField
								size='small'
								label='Server ID'
								value={draft.serverId}
								onChange={e => setDraft(d => ({ ...d, serverId: e.target.value }))}
								sx={{ flex: 1 }}
								inputProps={{ style: { fontFamily: 'monospace', fontSize: 12 } }}
							/>
							<TextField
								size='small'
								label='Order #'
								value={draft.order}
								onChange={e => setDraft(d => ({ ...d, order: e.target.value }))}
								sx={{ flex: 1 }}
								inputProps={{ style: { fontFamily: 'monospace', fontSize: 12 } }}
							/>
						</Stack>

						{/* Кнопки */}
						<Stack direction='row' spacing={1}>
							<Button
								variant='contained'
								fullWidth
								startIcon={<SearchIcon />}
								onClick={applySearch}
								onKeyDown={e => e.key === 'Enter' && applySearch()}
							>
								{t.show_all.split(' ')[0]}
							</Button>
							{isFiltered && (
								<Button
									variant='outlined'
									color='inherit'
									onClick={resetSearch}
									sx={{ whiteSpace: 'nowrap' }}
								>
									{t.reset_filters}
								</Button>
							)}
						</Stack>
					</Stack>
				</Box>

				{/* List */}
				{isFiltered && (
					<Box sx={{ ...glassCard, borderRadius: 3, overflow: 'hidden' }}>
						{filtered.length === 0 ? (
							<Typography align='center' color='text.secondary' py={4}>
								{t.no_data}
							</Typography>
						) : (
							filtered.map((tx, i) => (
								<Box key={tx.id}>
									{i > 0 && <Divider />}
									<Box
										sx={{
											px: 2,
											py: 1.5,
											cursor: 'pointer',
											'&:hover': {
												bgcolor: theme.palette.mode === 'dark'
													? 'rgba(255,255,255,0.04)'
													: 'rgba(0,0,0,0.02)',
											},
										}}
										onClick={() => navigate(`/users/${tx.userId}`)}
									>
										<Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
											<Box sx={{ flex: 1, minWidth: 0 }}>
												{/* Game + donat */}
												<Stack direction='row' alignItems='center' spacing={0.5} flexWrap='wrap'>
													<Typography variant='body2' fontWeight={700} noWrap>
														{tx.gameName}
													</Typography>
													<Typography variant='caption' color='text.secondary'>·</Typography>
													<Typography variant='caption' color='text.secondary' noWrap>
														{tx.donatName}
													</Typography>
												</Stack>

												{/* userId → playerId */}
												<Stack direction='row' alignItems='center' spacing={0.5} mt={0.3} flexWrap='wrap'>
													<Typography variant='caption' color='text.secondary'>user:</Typography>
													<Typography
														variant='caption'
														fontWeight={600}
														sx={{ fontFamily: 'monospace', fontSize: 11 }}
													>
														{tx.userId?.slice(0, 12)}…
													</Typography>
													{tx.playerId && tx.playerId !== '-' && (
														<>
															<Typography variant='caption' color='text.secondary'>→</Typography>
															<Typography
																variant='caption'
																fontWeight={600}
																color='primary.main'
																sx={{ fontFamily: 'monospace', fontSize: 11 }}
															>
																{tx.playerId}
															</Typography>
														</>
													)}
													{tx.serverId && tx.serverId !== '-' && tx.serverId !== '0' && (
														<Chip
															label={`sv:${tx.serverId}`}
															size='small'
															sx={{ height: 18, fontSize: 10 }}
															variant='outlined'
														/>
													)}
												</Stack>

												{/* Date + order */}
												<Stack direction='row' alignItems='center' spacing={0.5} mt={0.2}>
													<Typography variant='caption' color='text.secondary'>
														{String(tx.day).padStart(2, '0')}.{String(tx.month).padStart(2, '0')}.{tx.year}{' '}
														{String(tx.hour).padStart(2, '0')}:{String(tx.minute).padStart(2, '0')}
													</Typography>
													{tx.order && tx.order !== '-' && (
														<>
															<Typography variant='caption' color='text.secondary'>·</Typography>
															<Typography
																variant='caption'
																color='text.secondary'
																sx={{ fontFamily: 'monospace', fontSize: 10 }}
															>
																#{tx.order}
															</Typography>
														</>
													)}
												</Stack>
											</Box>

											{/* Price + status */}
											<Stack alignItems='flex-end' spacing={0.3} ml={1}>
												<Typography variant='body2' fontWeight={700} color='error.main'>
													{updateNumberFormat(Math.abs(tx.price))} {t.som}
												</Typography>
												{tx.status && (
													<Chip
														label={tx.status}
														size='small'
														sx={{
															height: 20,
															fontSize: 10,
															fontWeight: 600,
															bgcolor: `${STATUS_COLORS[tx.status] ?? '#95a5a6'}22`,
															color: STATUS_COLORS[tx.status] ?? '#95a5a6',
														}}
													/>
												)}
											</Stack>
										</Stack>
									</Box>
								</Box>
							))
						)}
					</Box>
				)}
			</Box>
			<BottomNavigate />
		</Box>
	)
}

export default TransactionsLog
