import { Modal, Box, Typography } from '@mui/material'
import { useTextModalStore } from '../../store/modal/useTextModal'
const style = {
	position: 'absolute' as const,
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	bgcolor: 'background.paper',
	borderRadius: 2,
	boxShadow: 24,
	p: 4,
}

export default function TextModal() {
	const { open, message, closeModal } = useTextModalStore()

	return (
		<Modal open={open} onClose={closeModal}>
			<Box sx={style}>
				<Typography mb={3}>{message}</Typography>
			</Box>
		</Modal>
	)
}
