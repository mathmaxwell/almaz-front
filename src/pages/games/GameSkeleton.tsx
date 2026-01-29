import { Box, Skeleton } from '@mui/material'

const GameSkeleton = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'start',
				gap: 2,
				width: '100%',
				overflowX: 'auto',
			}}
		>
			{Array.from(new Array(4)).map((_,index) => (
				<Skeleton
					key={index}
					variant='rectangular'
					animation='wave'
					width={100}
					height={100}
				/>
			))}
		</Box>
	)
}

export default GameSkeleton
