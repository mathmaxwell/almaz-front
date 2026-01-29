import { Box } from '@mui/material'
import humo from '../../images/cards/humo.png'
import uzcard from '../../images/cards/uzcard.png'
import { useSelectCardStore } from '../../store/cart/useSelectCardStore'
const SelectType = () => {
	const { card, setCard } = useSelectCardStore()
	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				gap: 2,
			}}
		>
			<Box
				onClick={() => {
					setCard('humo')
				}}
				sx={{
					width: '48%',
					height: 150,
					borderRadius: 3,
					cursor: 'pointer',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					bgcolor: 'white',
					border: card === 'humo' ? '5px solid red' : '',
					boxShadow: card !== 'humo' ? '0 4px 12px rgba(0,0,0,1)' : '',
				}}
			>
				<img
					src={humo}
					alt='Humo'
					style={{
						width: '100%',
						height: '150px',
						objectFit: 'contain',
					}}
				/>
			</Box>
			<Box
				onClick={() => {
					setCard('uzcard')
				}}
				sx={{
					width: '48%',
					height: 150,
					borderRadius: 3,
					cursor: 'pointer',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					bgcolor: 'white',
					border: card === 'uzcard' ? '5px solid red' : '',
					boxShadow: card !== 'uzcard' ? '0 4px 12px rgba(0,0,0,1)' : '',
				}}
			>
				<img
					src={uzcard}
					alt='Uzcard'
					style={{
						width: '100%',
						height: '150px',
						objectFit: 'contain',
					}}
				/>
			</Box>
		</Box>
	)
}

export default SelectType
