import type { IGetUser, IUser } from '../../types/user/user'
import api from '../api'

export async function login({
	login,
	password,
}: {
	login: string
	password: string
}) {
	try {
		const result = await api.post('/users/login', { login, password })
		return result.data as IUser
	} catch (error) {
		throw error
	}
}
export async function getUserById({ userId }: { userId: string }) {
	try {
		const result = await api.post('/users/getUserById', { userId })
		return result.data as IUser
	} catch (error) {
		throw error
	}
}
export async function deleteUser({
	token,
	userId,
}: {
	token: string
	userId: string
}) {
	try {
		const result = await api.post('/users/deleteUser', { token, userId })
		return result.data as IUser
	} catch (error) {
		throw error
	}
}

export async function getUsers({
	page,
	count,
	login,
	Token,
	StartBalance,
}: {
	page: number
	count: number
	login: string | undefined
	Token: string | undefined
	StartBalance: number | undefined
}) {
	try {
		const result = await api.post('/users/getUsers', {
			page,
			count,
			login,
			Token,
			StartBalance,
		})
		return result.data as IGetUser
	} catch (error) {
		throw error
	}
}
export async function register({
	login,
	password,
}: {
	login: string
	password: string
}) {
	try {
		const result = await api.post('/users/register', { login, password })
		return result.data as IUser
	} catch (error) {
		throw error
	}
}
