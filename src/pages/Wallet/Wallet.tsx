import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Card,
	CardContent,
	IconButton,
	TextField,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCardIcon from '@mui/icons-material/AddCard'
import Header from '../../components/Header/Header'
import BottomNavigate from '../home/BottomNavigate'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTokenStore } from '../../store/token/useTokenStore'
import {
	createAdmincart,
	deleteAdmincart,
	getAdmincart,
} from '../../api/cards/cards'
import type { ICards } from '../../types/cards/cards'
import { createPayment, getPayment } from '../../api/payment/payment'
import { useNavigate } from 'react-router-dom'
import { getUserById } from '../../api/login/login'
import type { IUser } from '../../types/user/user'

const Wallet = () => {
	const theme = useTheme()

	const isDesctop = useMediaQuery(theme.breakpoints.down('md'))
	const navigate = useNavigate()
	const { t } = useTranslationStore()
	const { token, setBalance } = useTokenStore()
	const isAdmin = import.meta.env.VITE_ADMINTOKEN === token
	const [name, setName] = useState('')
	const [number, setNumber] = useState('')
	const [amount, setAmount] = useState('')
	const [loading, setIsLoading] = useState(false)

	const {
		data: cards = [],
		isLoading,
		refetch,
	} = useQuery<ICards[], Error>({
		queryKey: ['admin-cards', token],
		queryFn: async () => (await getAdmincart(token)) ?? [],
		enabled: !!token,
	})
	const { data: userInfo } = useQuery<IUser, Error>({
		queryKey: ['userInfo', token],
		queryFn: async () => {
			const result = await getUserById({ userId: token })
			setBalance(result.balance.toString())
			return result
		},
		enabled: !!token,
	})
	const formatCardNumber = (value: string) => {
		const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
		const matches = v.match(/.{1,4}/g)
		return matches ? matches.join(' ') : ''
	}
	const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNumber(formatCardNumber(e.target.value))
	}
	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text.replace(/\s/g, ''))
	}
	const handleAddCard = async () => {
		if (!name.trim() || number.replace(/\s/g, '').length !== 16) return
		await createAdmincart({ token, name, number })
		setName('')
		setNumber('')
		refetch()
	}
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
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					{isLoading ? (
						<Typography>loading</Typography>
					) : cards.length === 0 ? (
						<Typography color='text.secondary' textAlign='center'>
							{t.no_cards_added}
						</Typography>
					) : (
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: isDesctop ? '1fr' : '1fr 1fr',
								gap: 2,
							}}
						>
							{cards.map(card => (
								<Card
									key={card.id}
									elevation={3}
									sx={{
										borderRadius: 3,
										background:
											'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
										color: 'white',
										position: 'relative',
										overflow: 'hidden',
									}}
								>
									<CardContent sx={{ position: 'relative', zIndex: 1 }}>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: 1.5,
												mb: 1.5,
											}}
										>
											<CreditCardIcon fontSize='large' />
											<Typography variant='h6' fontWeight={500}>
												{card.name}
											</Typography>
										</Box>

										<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
											<Typography
												variant='h5'
												fontFamily='monospace'
												letterSpacing={1.5}
												sx={{ userSelect: 'all' }}
											>
												{card.number}
											</Typography>

											<Tooltip title='Скопировать номер' arrow>
												<IconButton
													size='small'
													sx={{
														color: 'white',
														bgcolor: 'rgba(255,255,255,0.15)',
													}}
													onClick={() => copyToClipboard(card.number)}
												>
													<ContentCopyIcon fontSize='small' />
												</IconButton>
											</Tooltip>
										</Box>
										{isAdmin && (
											<IconButton
												size='small'
												sx={{
													position: 'absolute',
													top: 12,
													right: 12,
													color: 'white',
													bgcolor: 'rgba(0,0,0,0.3)',
													'&:hover': { bgcolor: 'rgba(255,0,0,0.6)' },
												}}
												onClick={async () => {
													if (!confirm('Удалить карту?')) return
													await deleteAdmincart({ token, id: card.id })
													refetch()
												}}
											>
												<DeleteIcon fontSize='small' />
											</IconButton>
										)}
									</CardContent>
								</Card>
							))}
						</Box>
					)}
				</Box>
				{isAdmin && (
					<Card variant='outlined' sx={{ borderRadius: 3, p: 1 }}>
						<CardContent
							sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
						>
							<Typography variant='h6' color='primary'>
								{t.add_new_card}
							</Typography>
							<TextField
								label={t.name}
								value={name}
								onChange={e => setName(e.target.value)}
								fullWidth
								variant='outlined'
							/>
							<TextField
								label={t.card_number}
								value={number}
								onChange={handleNumberChange}
								inputProps={{ maxLength: 19 }}
								placeholder='1234 5678 9012 3456'
								fullWidth
								variant='outlined'
							/>
							<Button
								variant='contained'
								size='large'
								startIcon={<AddCardIcon />}
								onClick={handleAddCard}
								disabled={
									!name.trim() || number.replace(/\s/g, '').length !== 16
								}
							>
								{t.add_card}
							</Button>
						</CardContent>
					</Card>
				)}
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
						console.log('newPayment', newPayment)

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
