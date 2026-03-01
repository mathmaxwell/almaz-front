import { Box, useTheme, Button, TextField } from '@mui/material'
import Header from '../../components/Header/Header'
import BottomNavigate from '../home/BottomNavigate'
import { useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useTokenStore } from '../../store/token/useTokenStore'
import { useQuery } from '@tanstack/react-query'
import type {
	ITransactions,
	ITransactionsPaginated,
} from '../../types/transactions/transactions'
import { getTransactionsByPeriod } from '../../api/transactions/transactions'
import LoadingProgress from '../../components/Loading/LoadingProgress'
import GameStatistics from '../../components/statistics/GameStatistics'
import DataPicker from '../../components/data/DataPicker'

const Statistics = () => {
	const { token } = useTokenStore()
	const theme = useTheme()
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
	const [limit, setLimit] = useState(100)
	const [offset, setOffset] = useState(0)
	const [allData, setAllData] = useState<ITransactions[]>([])

	const { data, isLoading } = useQuery<ITransactionsPaginated, Error>({
		queryKey: ['getTransactionsByPeriod', token, start, end, limit, offset],
		queryFn: async () =>
			(await getTransactionsByPeriod({
				token,
				startDay: start.startDay,
				startMonth: start.startMonth,
				startYear: start.startYear,
				endDay: end.endDay,
				endMonth: end.endMonth,
				endYear: end.endYear,
				limit,
				offset,
			})) ?? { data: [], total: 0, limit, offset },
		enabled: !!token,
	})

	const handleLoadMore = () => {
		if (data && allData.length < data.total) {
			setOffset(offset + limit)
			if (data) {
				setAllData([...allData, ...data.data])
			}
		}
	}

	return (
		<Box
			sx={{
				height: '100vh',
				background: `linear-gradient(135deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.neonGreen} 50%, ${theme.palette.custom.gradientEnd} 100%)`,
				overflowY: 'auto',
			}}
		>
			<Header />
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DataPicker
					start={start}
					setStart={setStart}
					setEnd={setEnd}
					end={end}
				/>
				{data && (
					<Box sx={{ p: 2 }}>
						<GameStatistics data={offset === 0 ? data.data : allData} />
						{allData.length < data.total && (
							<Box
								sx={{
									display: 'flex',
									gap: 2,
									mt: 2,
									justifyContent: 'center',
								}}
							>
								<Button variant='contained' onClick={handleLoadMore}>
									Load More ({allData.length}/{data.total})
								</Button>
								<TextField
									size='small'
									type='number'
									value={limit}
									onChange={e =>
										setLimit(
											Math.min(1000, Math.max(10, parseInt(e.target.value))),
										)
									}
									label='Items per page'
									inputProps={{ min: 10, max: 1000 }}
								/>
							</Box>
						)}
					</Box>
				)}
			</LocalizationProvider>
			{isLoading ? <LoadingProgress /> : <></>}
			<BottomNavigate />
		</Box>
	)
}

export default Statistics
