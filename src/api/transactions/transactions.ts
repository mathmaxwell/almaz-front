import type {
	ITransactions,
	ITransactionsPaginated,
} from '../../types/transactions/transactions'
import api from '../api'
export async function getTransactionsByUser(
	userId: string,
	limit = 100,
	offset = 0,
) {
	try {
		const responce = await api.post('/transactions/transactionsGet', {
			userId,
			limit,
			offset,
		})
		const result = responce.data as ITransactionsPaginated
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
export async function getTransactionsByPeriod({
	token,
	startDay,
	startMonth,
	startYear,
	endDay,
	endMonth,
	endYear,
}: {
	token: string
	startDay: number
	startMonth: number
	startYear: number
	endDay: number
	endMonth: number
	endYear: number
}) {
	try {
		const responce = await api.post('/transactions/getTransactionsByPeriod', {
			token,
			startDay,
			startMonth,
			startYear,
			endDay,
			endMonth,
			endYear,
		})
		const result = responce.data as ITransactionsPaginated
		return result
	} catch (error) {
		throw new Error('getTransactions error')
	}
}
