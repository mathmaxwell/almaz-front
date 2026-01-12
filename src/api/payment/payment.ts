import type { IPayment } from '../../types/payment/payment'
import api from '../api'

export async function getPayment(token: string) {
	try {
		const responce = await api.post('/payment/getPayment', {
			token,
		})
		const result = responce.data as IPayment[]
		return result
	} catch (error) {
		throw new Error('payment error')
	}
}
export async function createPayment({
	userId,
	price,
}: {
	userId: string
	price: number
}) {
	try {
		const now = new Date()
		const response = await api.post('/payment/createPayment', {
			userId,
			price,
			isWorking: true,
			year: now.getFullYear(),
			month: now.getMonth() + 1,
			day: now.getDate(),
			hour: now.getHours(),
			minute: now.getMinutes(),
		})
		return response
	} catch (error: any) {
		throw error
	}
}
export async function deletePayment({
	token,
	id,
}: {
	token: string
	id: string
}) {
	try {
		const response = await api.post('/payment/deletePayment', { token, id })
		return response
	} catch (error: any) {
		throw error
	}
}
export async function updatePayment({
	token,
	id,
}: {
	token: string
	id: string
	isWorking: false
}) {
	try {
		const response = await api.post('/payment/updatePayment', { token, id })
		return response
	} catch (error: any) {
		throw error
	}
}
