import { Box, Skeleton } from '@mui/material'

const AnnouncementsSkeleton = () => {
	return (
		<Box
			sx={{
				p: 2,
				display: 'grid',
				gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
				gap: 2,
			}}
		>
			{Array.from(new Array(4)).map(i => (
				<Skeleton height={200} key={i} />
			))}
		</Box>
	)
}

export default AnnouncementsSkeleton
