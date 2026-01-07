import { create } from 'zustand'

interface TokenStore {
	token: string
	setToken: (token: string) => void
	resetToken: () => void
}
export const useTokenStore = create<TokenStore>(set => ({
	token: localStorage.getItem('userToken') || '',
	setToken: (token: string) => {
		localStorage.setItem('userToken', token)
		set({ token })
	},
	resetToken: () => {
		localStorage.removeItem('userToken')
		set({ token: '' })
	},
}))
