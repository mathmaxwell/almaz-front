import {
	TableRow,
	TableCell,
	useTheme,
	useMediaQuery,
	IconButton,
} from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import type { IOffer } from '../../types/games/games'
import { useSavedGamesStore } from '../../store/cart/useCartStore'
import { useVideoModalStore } from '../../store/modal/useVideoModalStore'
import { useOfferStoreModal } from '../../store/modal/useOfferModal'
import { useTokenStore } from '../../store/token/useTokenStore'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CreateIcon from '@mui/icons-material/Create'
interface Props {
	row: IOffer
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	setText: React.Dispatch<React.SetStateAction<string>>
	setImg: React.Dispatch<React.SetStateAction<string>>
}
export const CartRow = ({ row, setOpen, setText, setImg }: Props) => {
	const { token } = useTokenStore()
	const isAdmin = import.meta.env.VITE_ADMINTOKEN == token
	const { openModal } = useOfferStoreModal()
	const theme = useTheme()
	const { open } = useVideoModalStore()
	const isDesctop = useMediaQuery(theme.breakpoints.down('md'))
	const { lang } = useTranslationStore()
	const { increment, decrement, getCount } = useSavedGamesStore()
	const selected = getCount(row.id)
	const apiUrl = import.meta.env.VITE_API_URL
	return (
		<TableRow
			sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
			onClick={() => {
				open({
					title: lang == 'ru' ? row.ruDesc : row.uzDesc,
					video: {
						type: 'backend',
						url: `${apiUrl}${row.video}`,
					},
				})
			}}
		>
			<TableCell sx={{ px: 0.5 }} align='center'>
				{lang === 'ru' ? row.ruName : row.uzName}
			</TableCell>
			{!isDesctop && (
				<TableCell
					align='center'
					sx={{ p: 0 }}
					onClick={e => {
						e.stopPropagation()
						setOpen(true)
						setText(lang == 'ru' ? row.ruDesc : row.uzDesc)
						setImg(`${apiUrl}${row.image}`)
					}}
				>
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

			<TableCell align='center'>
				<IconButton
					onClick={e => {
						e.stopPropagation()
						if (selected > 0) {
							decrement(row.id)
						} else {
							increment(row.id)
						}
					}}
				>
					{selected > 0 ? (
						<StarIcon color='warning' />
					) : (
						<StarBorderIcon color='warning' />
					)}
				</IconButton>
			</TableCell>

			<TableCell align='center'>
				<IconButton>
					<AttachMoneyIcon
						color='warning'
						onClick={e => {
							e.stopPropagation()
							alert('funksiya')
						}}
					/>
				</IconButton>
			</TableCell>
			{isAdmin && (
				<TableCell align='center'>
					<IconButton>
						<CreateIcon
							color='primary'
							onClick={e => {
								e.stopPropagation()
								openModal(row)
							}}
						/>
					</IconButton>
				</TableCell>
			)}
		</TableRow>
	)
}
