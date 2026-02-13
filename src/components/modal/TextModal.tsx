import { Modal, Box, Typography, IconButton, useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTextModalStore } from '../../store/modal/useTextModal'

export default function TextModal() {
	const { open, message, closeModal } = useTextModalStore()
	const theme = useTheme()

	return (
		<Modal
			open={open}
			onClose={closeModal}
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				p: 2,
			}}
		>
			<Box
				sx={{
					position: 'relative',
					maxWidth: 480,
					width: '100%',
					bgcolor: theme.palette.background.paper,
					borderRadius: 4,
					boxShadow:
						theme.palette.mode === 'dark'
							? '0 20px 60px rgba(0, 0, 0, 0.5)'
							: '0 20px 60px rgba(0, 0, 0, 0.15)',
					p: { xs: 3, sm: 4 },
					border: `1px solid ${
						theme.palette.mode === 'dark'
							? 'rgba(255,255,255,0.08)'
							: 'rgba(0,0,0,0.04)'
					}`,
					outline: 'none',
				}}
			>
				<IconButton
					onClick={closeModal}
					sx={{
						position: 'absolute',
						top: 12,
						right: 12,
						color: theme.palette.text.secondary,
					}}
					size='small'
				>
					<CloseIcon fontSize='small' />
				</IconButton>
				<Typography
					sx={{
						lineHeight: 1.7,
						color: theme.palette.text.primary,
						pr: 3,
						whiteSpace: 'pre-line',
					}}
				>
					{message}
				</Typography>
			</Box>
		</Modal>
	)
}
