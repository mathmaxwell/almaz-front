import { Button, Paper } from '@mui/material'
import type { IPayment } from '../../types/payment/payment'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import { useState } from 'react'
import type { GridRowSelectionModel } from '@mui/x-data-grid'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { useTokenStore } from '../../store/token/useTokenStore'
import { deletePayment } from '../../api/payment/payment'
import LoadingProgress from '../Loading/LoadingProgress'
const columns: GridColDef[] = [
	{ align: 'center', field: 'id', headerName: 'ID' },
	{ align: 'center', field: 'minute', headerName: 'minute' },
	{ align: 'center', field: 'hour', headerName: 'hour' },
	{ align: 'center', field: 'day', headerName: 'day' },
	{ align: 'center', field: 'month', headerName: 'month' },
	{ align: 'center', field: 'year', headerName: 'year' },
	{ align: 'center', field: 'userId', headerName: 'userId' },
	{
		field: 'price',
		headerName: 'price',
		align: 'center',
	},
]
const paginationModel = { page: 0, pageSize: 20 }
const SelectBooking = ({ data = [] }: { data?: IPayment[] }) => {
	const { t } = useTranslationStore()
	const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>()
	const { token } = useTokenStore()
	const [loading, setLoading] = useState(false)
	return (
		<>
			{loading && <LoadingProgress />}
			<Button
				onClick={async () => {
					if (!selectionModel) return
					let selectedRows: IPayment[]
					if (selectionModel.type === 'include') {
						selectedRows = data.filter(row => selectionModel.ids.has(row.id))
					} else {
						selectedRows = data.filter(row => !selectionModel.ids.has(row.id))
					}
					if (selectedRows.length === 0) return
					const conf = confirm(`${t.delete}? - ${selectedRows.length}`)
					if (conf) {
						setLoading(true)
						for (const id of selectedRows) {
							await deletePayment({ token, id: id.id })
						}
						setLoading(false)
					}
				}}
				fullWidth
				variant='contained'
				color='error'
				sx={{ my: 2 }}
			>
				{t.delete}
			</Button>
			<Paper sx={{ width: '100%' }}>
				<DataGrid
					rows={data}
					columns={columns}
					initialState={{ pagination: { paginationModel } }}
					pageSizeOptions={[20, 25, 50, 75, 100]}
					checkboxSelection
					sx={{ border: 0 }}
					onRowSelectionModelChange={newSelection =>
						setSelectionModel(newSelection)
					}
					rowSelectionModel={selectionModel}
				/>
			</Paper>
		</>
	)
}

export default SelectBooking
