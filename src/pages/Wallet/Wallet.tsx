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
import { getUserById } from '../../api/login/login'
import type { IUser } from '../../types/user/user'
import SelectType from '../../components/BankCards/SelectType'
import { useSelectCardStore } from '../../store/cart/useSelectCardStore'
import BankCards from '../../components/BankCards/BankCards'
const Wallet = () => {
	const [cardType, setCardType] = useState<undefined | string>(undefined)
	const [loading, setIsLoading] = useState(false)
	const { card } = useSelectCardStore()
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
				<Typography align='center' variant='h4'>
					{t.balance}: {userInfo?.balance} {t.som}
				</Typography>
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
					<Button fullWidth variant='contained'>
						{t.watch_video}
					</Button>
				</Accordion>

				{!cardType ? (
					<>
						<SelectType />
						<TextField
							label={t.payment_amount}
							value={amount}
							onChange={e => setAmount(e.target.value)}
							type='number'
							fullWidth
							variant='outlined'
							onWheel={e => (e.target as HTMLElement).blur()}
							sx={{ mt: 2 }}
						/>
						<Button
							fullWidth
							variant='contained'
							sx={{ mt: 2 }}
							loading={loading}
							disabled={Number(amount) < 1000}
							onClick={async () => {
								setIsLoading(true)
								const result = (await getPayment(token)) ?? []
								const hasBusy = result.some(pay => pay.price === Number(amount))
								const hasOrder = result.some(
									pay => pay.userId === token && pay.isWorking,
								)
								if (hasOrder) {
									alert(t.you_already_have_an_order)
									setIsLoading(false)
									return
								}
								if (hasBusy) {
									alert(t.payment_is_busy)
									setIsLoading(false)
									return
								}
								await createPayment({
									userId: token,
									price: Number(amount),
								})
								setCardType(card)
								setIsLoading(false)
							}}
						>
							{t.book_now}
						</Button>
					</>
				) : (
					<>
						<BankCards cardType={cardType} />
					</>
				)}
			</Box>
			<BottomNavigate />
		</>
	)
}

export default Wallet
