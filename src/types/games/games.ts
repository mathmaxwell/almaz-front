export interface IGames {
	id: string
	name: string
	image: string
	howToUseUz: string
	howToUseRu: string
	helpImage: string
}
export interface IOffer {
	id: string
	gameId: string
	image: string
	uzName: string
	ruName: string
	price: string
	ruDesc: string
	uzDesc: string
}
