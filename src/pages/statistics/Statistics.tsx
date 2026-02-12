import { Box, useTheme } from '@mui/material'
import Header from '../../components/Header/Header'
import BottomNavigate from '../home/BottomNavigate'
import { useState } from 'react'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { useTokenStore } from '../../store/token/useTokenStore'
import { useQuery } from '@tanstack/react-query'
import type { ITransactions } from '../../types/transactions/transactions'
import { getByPeriod } from '../../api/transactions/transactions'
import LoadingProgress from '../../components/Loading/LoadingProgress'
import GameStatistics from '../../components/statistics/GameStatistics'
const Statistics = () => {
	const { token } = useTokenStore()
	const { t } = useTranslationStore()
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
	const { data, isLoading } = useQuery<ITransactions[], Error>({
		queryKey: ['getByPeriod', token, start, end],
		queryFn: async () =>
			(await getByPeriod({
				token,
				startDay: start.startDay,
				startMonth: start.startMonth,
				startYear: start.startYear,
				endDay: end.endDay,
				endMonth: end.endMonth,
				endYear: end.endYear,
			})) ?? [],
		enabled: !!token,
	})
	const handleStartChange = (value: Dayjs | null) => {
		if (!value) return
		setStart({
			startDay: value.date(),
			startMonth: value.month() + 1,
			startYear: value.year(),
		})
	}
	const handleEndChange = (value: Dayjs | null) => {
		if (!value) return
		setEnd({
			endDay: value.date(),
			endMonth: value.month() + 1,
			endYear: value.year(),
		})
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
				<Box
					sx={{
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 2,
						p: 2,
					}}
				>
					<DatePicker
						label={t.start_date}
						format='DD.MM.YYYY'
						value={dayjs(
							`${start.startYear}-${start.startMonth}-${start.startDay}`,
						)}
						onChange={handleStartChange}
						slotProps={{
							textField: { fullWidth: true },
						}}
					/>
					<DatePicker
						label={t.end_date}
						format='DD.MM.YYYY'
						value={dayjs(`${end.endYear}-${end.endMonth}-${end.endDay}`)}
						onChange={handleEndChange}
						slotProps={{
							textField: { fullWidth: true },
						}}
					/>
				</Box>
				{data && <GameStatistics data={data} />}
			</LocalizationProvider>
			{isLoading ? <LoadingProgress /> : <></>}
			<BottomNavigate />
		</Box>
	)
}

export default Statistics
