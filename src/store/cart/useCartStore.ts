import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CartState = {
	items: Record<string, number>

	getCount: (id: string) => number
	increment: (id: string) => void
	decrement: (id: string) => void
	reset: (id: string) => void
}

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => ({
			items: {},

			getCount: id => {
				return get().items[id] ?? 0
			},

			increment: id => {
				set(state => {
					const current = state.items[id] ?? 0
					if (current >= 10) return state

					return {
						items: {
							...state.items,
							[id]: current + 1,
						},
					}
				})
			},

			decrement: id => {
				set(state => {
					const current = state.items[id] ?? 0
					if (current <= 0) return state

					return {
						items: {
							...state.items,
							[id]: current - 1,
						},
					}
				})
			},

			reset: id => {
				set(state => {
					const newItems = { ...state.items }
					delete newItems[id]

					return { items: newItems }
				})
			},
		}),
		{
			name: 'cart-storage',
		}
	)
)
