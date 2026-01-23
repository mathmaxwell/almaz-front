import type { ITransactions } from '../../types/transactions/transactions'
import api from '../api'
export async function getTransactionsByUser(userId: string) {
	try {
		const responce = await api.post('/transactions/transactionsGet', {
			userId,
		})
		const result = responce.data as ITransactions[]
		return result
	} catch (error) {
		throw new Error('getTransactions error')
	}
}
export async function createTransactions({
	userId,
	price,
	gameName,
	donatName,
	createdBy,
}: {
	userId: string
	price: number
	gameName: string
	donatName: string
	createdBy: string
}) {
	try {
		const response = await api.post('/transactions/transactionsCreate', {
			userId,
			price,
			gameName,
			donatName,
			createdBy,
		})
		return response.data as ITransactions
	} catch (error: any) {
		return error.response.data as ITransactions
	}
}
export async function deleteTransactions({ id }: { id: string }) {
	try {
		const response = await api.post('/transactions/transactionsDelete', { id })
		return response
	} catch (error: any) {
		throw error
	}
}
