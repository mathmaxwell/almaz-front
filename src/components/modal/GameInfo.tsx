import { Box, Button, Dialog, Typography } from '@mui/material'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { useVideoModalStore } from '../../store/modal/useVideoModalStore'

const GameInfo = ({
	open,
	setOpen,
	text,
	img,
	url,
}: {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	text: string
	img: string
	url: string
}) => {
	const { t } = useTranslationStore()
	const { open: openVideo } = useVideoModalStore()
	return (
		<>
			<Dialog
				maxWidth='lg'
				open={open}
				sx={{ width: '100%' }}
				onClose={() => {
					setOpen(false)
				}}
				fullWidth
			>
				<Box
					sx={{
						width: '100%',
						p: { xs: 3, sm: 4 },
						display: 'flex',
						flexDirection: 'column',
						gap: 3,
					}}
				>
					<Typography
						sx={{ width: '100%', whiteSpace: 'pre-line' }}
						variant='h6'
						fontWeight='bold'
					>
						{text}
					</Typography>
					<img
						src={img}
						style={{
							maxWidth: '100%',
							maxHeight: '300px',
							borderRadius: '12px',
							boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
							objectFit: 'contain',
						}}
					/>
					<Button
						fullWidth
						variant='contained'
						onClick={() => {
							openVideo({ video: { type: 'backend', url: url }, title: '' })
						}}
					>
						{t.watch_video}
					</Button>
				</Box>
			</Dialog>
		</>
	)
}

export default GameInfo
