import type { IStatus } from '../../types/buy/buy'
import api from '../api'

export async function createBuy({
	token,
	gameId,
	playerId,
	serverId,
	botId,
	offerId,
}: {
	token: string
	gameId: string
	playerId: string
	serverId: string
	botId: string
	offerId: string
}) {
	try {
		const responce = await api.post('/buy/create', {
			token,
			gameId,
			playerId,
			serverId,
			botId,
			offerId,
		})
		const result = responce.data as any
		return result
	} catch (error) {
		throw new Error('games error')
	}
}
export async function orderStatus({
	order,
	gameId,
}: {
	order: string
	gameId: string
}) {
	try {
		const responce = await api.post('/buy/orderStatus', {
			order: order.toString(),
			gameId,
		})
		const result = responce.data as IStatus
		return result
	} catch (error) {
		throw new Error('games error')
	}
}
