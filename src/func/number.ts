export function updateNumberFormat(sum: number | string) {
	return new Intl.NumberFormat('en-US').format(Number(sum))
}
