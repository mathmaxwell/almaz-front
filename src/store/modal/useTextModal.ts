import { create } from 'zustand'

interface ModalState {
	open: boolean
	message: string
	openModal: (message: string) => void
	closeModal: () => void
}

export const useTextModalStore = create<ModalState>(set => ({
	open: false,
	message: '',
	openModal: message =>
		set({
			open: true,
			message,
		}),
	closeModal: () =>
		set({
			open: false,
			message: '',
		}),
}))
