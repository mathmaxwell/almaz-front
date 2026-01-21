import {
	TableRow,
	TableCell,
	Button,
	IconButton,
	useTheme,
	useMediaQuery,
} from '@mui/material'
import { useCartStore } from '../../store/cart/useCartStore'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { useTokenStore } from '../../store/token/useTokenStore'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import type { IOffer } from '../../types/games/games'
interface Props {
	row: IOffer
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	setText: React.Dispatch<React.SetStateAction<string>>
	setImg: React.Dispatch<React.SetStateAction<string>>
}
export const CartRow = ({ row, setOpen, setText, setImg }: Props) => {
	const theme = useTheme()
	const isDesctop = useMediaQuery(theme.breakpoints.down('md'))
	const { lang } = useTranslationStore()
	const apiUrl = import.meta.env.VITE_API_URL
	const count = useCartStore(state => state.getCount(row.id))
	const increment = useCartStore(state => state.increment)
	const decrement = useCartStore(state => state.decrement)
	const { balance } = useTokenStore()
	const stock = Number(balance) - Number(count) * Number(row.price)
	return (
		<TableRow
			sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
			onClick={() => {
				setOpen(true)
				setText(lang == 'ru' ? row.ruDesc : row.uzDesc)
				setImg('')
			}}
		>
			<TableCell sx={{ px: 0.5 }} align='center'>
				{lang === 'ru' ? row.ruName : row.uzName}
			</TableCell>
			{!isDesctop && (
				<TableCell align='center' sx={{ p: 0 }}>
					<img
						style={{
							width: 100,
							height: 100,
							objectFit: 'contain',
							padding: 0,
						}}
						src={`${apiUrl}${row.image}`}
						alt=''
					/>
				</TableCell>
			)}
			<TableCell sx={{ px: 0 }} align='center'>
				{row.price}
			</TableCell>
			<TableCell
				align='center'
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 0,
					p: 3,
					px: 0,
				}}
			>
				<IconButton
					onClick={e => {
						decrement(row.id)
						e.stopPropagation()
					}}
				>
					<RemoveCircleIcon color='error' fontSize='large' />
				</IconButton>
				{count}
				<IconButton
					onClick={e => {
						increment(row.id)
						e.stopPropagation()
					}}
				>
					<AddCircleIcon color='success' fontSize='large' />
				</IconButton>
			</TableCell>
			<TableCell align='center'>
				<Button
					sx={{ width: '90px' }}
					variant='contained'
					color={count == 0 ? 'info' : stock > 0 ? 'success' : 'error'}
					onClick={e => {
						e.stopPropagation()
					}}
				>
					{stock}
				</Button>
			</TableCell>
		</TableRow>
	)
}
