import { create } from 'zustand'

interface TokenStore {
	token: string
	balance: string
	setToken: (token: string) => void
	setBalance: (balance: string) => void
	resetToken: () => void
	resetBalance: () => void
}

export const useTokenStore = create<TokenStore>(set => ({
	token: localStorage.getItem('userToken') || '',
	balance: localStorage.getItem('userBalance') || '',

	setToken: (token: string) => {
		localStorage.setItem('userToken', token)
		set({ token })
	},

	setBalance: (balance: string) => {
		localStorage.setItem('userBalance', balance)
		set({ balance })
	},

	resetToken: () => {
		localStorage.removeItem('userToken')
		set({ token: '' })
	},

	resetBalance: () => {
		localStorage.removeItem('userBalance')
		set({ balance: '' })
	},
}))
