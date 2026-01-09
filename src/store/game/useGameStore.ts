import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IGames } from '../../types/games/games'

interface GameState {
	game: IGames
	setGame: (game: IGames) => void
	updateGame: (game: Partial<IGames>) => void
	clearGame: () => void
}

export const useGameStore = create<GameState>()(
	persist(
		set => ({
			game: {
				id: '',
				helpImage: '',
				image: '',
				howToUseUz: '',
				howToUseRu: '',
				name: '',
			},
			setGame: game => set({ game }),
			updateGame: game =>
				set(state => ({
					game: state.game
						? { ...state.game, ...game }
						: {
								id: '',
								helpImage: '',
								image: '',
								howToUseUz: '',
								howToUseRu: '',
								name: '',
						  },
				})),
			clearGame: () =>
				set({
					game: {
						id: '',
						helpImage: '',
						image: '',
						howToUseUz: '',
						howToUseRu: '',
						name: '',
					},
				}),
		}),
		{
			name: 'game-storage',
		}
	)
)
