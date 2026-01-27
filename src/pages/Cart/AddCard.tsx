import {
	Box,
	Button,
	Card,
	CardContent,
	TextField,
	Typography,
	useTheme,
} from '@mui/material'
import AddCardIcon from '@mui/icons-material/AddCard'
import Header from '../../components/Header/Header'
import BottomNavigate from '../home/BottomNavigate'
import { useTokenStore } from '../../store/token/useTokenStore'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { useState } from 'react'
import { createAdmincart } from '../../api/cards/cards'
import BankCards from '../../components/BankCards/BankCards'

const AddCard = () => {
	const theme = useTheme()
	const { token } = useTokenStore()
	const { t } = useTranslationStore()
	const [name, setName] = useState('')
	const [number, setNumber] = useState('')
	const [type, setType] = useState('')
	const handleAddCard = async () => {
		if (!name.trim() || number.replace(/\s/g, '').length !== 16) return
		await createAdmincart({ token, name, number, type })
		setName('')
		setNumber('')
		setType('')
	}

	const formatCardNumber = (value: string) => {
		const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
		const matches = v.match(/.{1,4}/g)
		return matches ? matches.join(' ') : ''
	}
	const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNumber(formatCardNumber(e.target.value))
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
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
				<BankCards cardType='all' />
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
			</Box>
			<BottomNavigate />
		</Box>
	)
}

export default AddCard
