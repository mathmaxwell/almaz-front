import { Box } from '@mui/material'
const statusConfig = {
	top: {
		label: 'TOP',
		bg: 'linear-gradient(135deg, #ff9a3c, #ff5e62)',
		color: '#fff',
		glow: '0 0 20px rgba(255, 94, 98, 0.6)',
		border: '1px solid rgba(255,255,255,0.18)',
	},
	sale: {
		label: 'SALE',
		bg: 'linear-gradient(135deg, #f56565, #c53030)',
		color: '#fff',
		glow: '0 0 24px rgba(245, 101, 101, 0.55)',
		border: '1px solid rgba(255,255,255,0.15)',
	},
	vip: {
		label: 'VIP',
		bg: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
		color: '#fff',
		glow: '0 0 22px rgba(167, 139, 250, 0.65)',
		border: '1px solid rgba(255,255,255,0.2)',
	},
}
const GameStatus = ({
	status,
}: {
	status: 'vip' | 'sale' | 'top' | '' | '-'
}) => {
	if (status == '-' || status == '') {
		return <></>
	}
	return (
		<>
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: 140,
					height: 140,
					overflow: 'hidden',
					pointerEvents: 'none',
					zIndex: 2,
				}}
			>
				<Box
					component='span'
					sx={{
						position: 'absolute',
						display: 'block',
						width: 225,
						padding: '8px 0',
						background: statusConfig[status].bg,
						boxShadow: '0 5px 10px rgba(0,0,0,0.25)',
						color: statusConfig[status].color,
						fontWeight: 900,
						fontSize: '13px',
						letterSpacing: '1px',
						textAlign: 'center',
						textTransform: 'uppercase',
						transform: 'rotate(-45deg) translate3d(-110px, 30px, 0)',
						transformOrigin: 'top left',
						whiteSpace: 'nowrap',
					}}
				>
					{statusConfig[status].label}
				</Box>
			</Box>
		</>
	)
}

export default GameStatus
