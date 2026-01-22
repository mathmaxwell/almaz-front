import { useQuery } from '@tanstack/react-query'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCardIcon from '@mui/icons-material/AddCard'
import type { ICards } from '../../types/cards/cards'
import { useTokenStore } from '../../store/token/useTokenStore'
import {
	createAdmincart,
	deleteAdmincart,
	getAdmincart,
} from '../../api/cards/cards'
import { useState } from 'react'
import {
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
import { useTranslationStore } from '../../store/language/useTranslationStore'

const BankCards = ({ cardType }: { cardType: string }) => {
	const { token } = useTokenStore()
	const isAdmin = import.meta.env.VITE_ADMINTOKEN === token
	const { t } = useTranslationStore()
	const theme = useTheme()
	const isDesctop = useMediaQuery(theme.breakpoints.down('md'))
	const [name, setName] = useState('')
	const [number, setNumber] = useState('')
	const [type, setType] = useState('')
	const handleAddCard = async () => {
		if (!name.trim() || number.replace(/\s/g, '').length !== 16) return
		await createAdmincart({ token, name, number, type })
		setName('')
		setNumber('')
		setType('')
		refetch()
	}

	const {
		data: cards = [],
		isLoading,
		refetch,
	} = useQuery<ICards[], Error>({
		queryKey: ['admin-cards', token],
		queryFn: async () => {
			const cards = await getAdmincart(token)
			return cards.filter(pay => pay.type === cardType)
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
	return (
		<>
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
											sx={{ userSelect: 'all' }}
											noWrap
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
							label={t.type_of_card}
							value={type}
							placeholder='humo, uzcard'
							onChange={e => setType(e.target.value)}
							fullWidth
							variant='outlined'
						/>
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
							disabled={!name.trim() || number.replace(/\s/g, '').length !== 16}
						>
							{t.add_card}
						</Button>
					</CardContent>
				</Card>
			)}
		</>
	)
}

export default BankCards
