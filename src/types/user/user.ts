export interface IUser {
	login: string
	password: string
	token: string
	balance: number
	userRole: string
}
export interface IGetUser {
	count: number
	page: number
	pages: number
	total: number
	users: IUser[]
}
