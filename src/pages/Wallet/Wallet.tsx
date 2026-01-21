import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	TextField,
	Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Header from '../../components/Header/Header'
import BottomNavigate from '../home/BottomNavigate'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTokenStore } from '../../store/token/useTokenStore'
import { createPayment, getPayment } from '../../api/payment/payment'
import { useNavigate } from 'react-router-dom'
import { getUserById } from '../../api/login/login'
import type { IUser } from '../../types/user/user'
import BankCards from '../../components/BankCards/BankCards'
const Wallet = () => {
	const [loading, setIsLoading] = useState(false)
	const navigate = useNavigate()
	const { t } = useTranslationStore()
	const { token, setBalance } = useTokenStore()
	const [amount, setAmount] = useState('')
	const { data: userInfo } = useQuery<IUser, Error>({
		queryKey: ['userInfo', token],
		queryFn: async () => {
			const result = await getUserById({ userId: token })
			setBalance(result.balance.toString())
			return result
		},
		enabled: !!token,
	})

	return (
		<>
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
				<Accordion>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls='panel1-content'
						id='panel1-header'
					>
						<Typography component='span'>{t.how_to_pay}</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
							<li>{t.payment_instruction}</li>
							<li>{t.payment_booking}</li>
							<li>{t.payment_timeout}</li>
							<li>{t.payment_error_rules}</li>
						</ol>
					</AccordionDetails>
				</Accordion>
				<Typography align='center' variant='h5'>
					{t.balance}: {userInfo?.balance} {t.som}
				</Typography>
				<BankCards />
				<TextField
					label={t.payment_amount}
					value={amount}
					onChange={e => setAmount(e.target.value)}
					type='number'
					fullWidth
					variant='outlined'
					inputProps={{ min: 1000 }}
					onWheel={e => (e.target as HTMLElement).blur()}
					sx={{ mt: 2 }}
				/>
				<Button
					fullWidth
					variant='contained'
					sx={{ mt: 2 }}
					loading={loading}
					onClick={async () => {
						setIsLoading(true)
						const result = (await getPayment(token)) ?? []
						const hasBusy = result.some(pay => pay.price === Number(amount))
						if (hasBusy) {
							alert('payment is busy')
							setIsLoading(false)
							return
						}
						const newPayment = await createPayment({
							userId: token,
							price: Number(amount),
						})
						navigate(`/wallet/${newPayment.id}`)
						setIsLoading(false)
					}}
				>
					{t.book_now}
				</Button>
			</Box>
			<BottomNavigate />
		</>
	)
}

export default Wallet
