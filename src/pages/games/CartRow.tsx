import { TableRow, TableCell, Button, IconButton } from '@mui/material'
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
			<TableCell>{lang === 'ru' ? row.ruName : row.uzName}</TableCell>
			<TableCell align='center' sx={{ p: 0 }}>
				<img
					style={{ width: 100, height: 100, objectFit: 'contain', padding: 0 }}
					src={`${apiUrl}${row.image}`}
					alt=''
				/>
			</TableCell>
			<TableCell align='center'>{row.price}</TableCell>
			<TableCell align='center'>
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
