import { useQuery } from '@tanstack/react-query'
import Header from '../../components/Header/Header'
import type { IAnnouncements } from '../../types/Announcements/Announcements'
import { useTokenStore } from '../../store/token/useTokenStore'
import {
	createAnnouncements,
	deleteAnnouncements,
	getAnnouncements,
} from '../../api/Announcements/Announcements'
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	TextField,
	Typography,
	useTheme,
} from '@mui/material'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import BottomNavigate from '../home/BottomNavigate'
const Announcements = () => {
	const theme = useTheme()
	const { lang, t } = useTranslationStore()
	const { token } = useTokenStore()
	const isAdmin = import.meta.env.VITE_ADMINTOKEN == token
	const apiUrl = import.meta.env.VITE_API_URL
	const {
		data: slides,
		isLoading,
		refetch,
	} = useQuery<IAnnouncements[], Error>({
		queryKey: ['slides', token],
		queryFn: async () => {
			const result = await getAnnouncements({ token })
			return result ?? []
		},
		enabled: !!token,
	})
	const [loading, setLoading] = useState(false)
	const [imageFile, setImageFile] = useState<File | null>(null)
	const [previewMain, setPreviewMain] = useState<string | null>(null)
	const [ru, setRu] = useState<string>('')
	const [uz, setUz] = useState<string>('')
	const [ruText, setRuText] = useState<string>('')
	const [uzText, setUzText] = useState<string>('')
	const onSubmit = async () => {
		const data = new FormData()
		data.append('token', token)
		data.append('ru', ru.trim())
		data.append('uz', uz.trim())
		data.append('ruText', ruText.trim())
		data.append('uzText', uzText.trim())
		if (imageFile) data.append('image', imageFile)
		setLoading(true)
		try {
			await createAnnouncements(data)
			refetch()
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => {
		if (imageFile) {
			const url = URL.createObjectURL(imageFile)
			setPreviewMain(url)
			return () => URL.revokeObjectURL(url)
		}
	}, [imageFile])

	return (
		<Box
			sx={{
				height: '100vh',
				background: `linear-gradient(135deg, ${theme.palette.custom.gradientStart} 0%, ${theme.palette.custom.neonGreen} 50%, ${theme.palette.custom.gradientEnd} 100%)`,
				overflowY: 'auto',
			}}
		>
			<Header />

			{isAdmin && (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 2,
						width: '100%',
						p: 2,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', sm: 'row' },
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: 2,
							width: '100%',
						}}
					>
						<TextField
							label={t.title_uz}
							value={uz}
							sx={{ whiteSpace: 'pre-line' }}
							onChange={e => setUz(e.target.value)}
							fullWidth
							variant='outlined'
						/>
						<TextField
							label={t.title_ru}
							value={ru}
							sx={{ whiteSpace: 'pre-line' }}
							onChange={e => setRu(e.target.value)}
							fullWidth
							variant='outlined'
						/>
					</Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', sm: 'row' },
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: 2,
							width: '100%',
						}}
					>
						<TextField
							label={t.description_uz}
							value={uzText}
							sx={{ whiteSpace: 'pre-line' }}
							onChange={e => setUzText(e.target.value)}
							fullWidth
							variant='outlined'
						/>
						<TextField
							label={t.description_ru}
							value={ruText}
							sx={{ whiteSpace: 'pre-line' }}
							onChange={e => setRuText(e.target.value)}
							fullWidth
							variant='outlined'
						/>
					</Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', sm: 'row' },
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: 2,
							width: '100%',
						}}
					>
						<Button
							variant='outlined'
							component='label'
							fullWidth
							sx={{ py: 2, textTransform: 'none' }}
						>
							{imageFile ? imageFile.name : t.upload_image}
							<input
								type='file'
								hidden
								accept='image/*'
								onChange={e => setImageFile(e.target.files?.[0] || null)}
							/>
						</Button>
						<Button
							onClick={() => {
								onSubmit()
							}}
							disabled={!ru || !uz || !uzText || !ruText || !previewMain}
							loading={loading}
							sx={{ py: 2, textTransform: 'none' }}
							variant='contained'
							fullWidth
							size='large'
						>
							{t.add_advertisement}
						</Button>
					</Box>
				</Box>
			)}
			{isLoading ? (
				<>Loading</>
			) : (
				<Box
					sx={{
						p: 2,
						display: 'grid',
						gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
						gap: 2,
					}}
				>
					{slides?.map(slider => (
						<Card key={slider.id}>
							<CardActionArea>
								<CardMedia
									component='img'
									height='300'
									image={`${apiUrl}${slider.image}`}
									alt={slider.ru}
								/>
								<CardContent
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
								>
									<Box>
										<Typography gutterBottom variant='h5' component='div'>
											{lang == 'ru' ? slider.ru : slider.uz}
										</Typography>
										<Typography
											variant='body2'
											sx={{ color: 'text.secondary' }}
										>
											{lang == 'ru' ? slider.ruText : slider.uzText}
										</Typography>
									</Box>
									{isAdmin && (
										<DeleteIcon
											onClick={async () => {
												let isDelete = confirm(`${t.delete}?`)
												if (isDelete) {
													await deleteAnnouncements({
														token,
														id: slider.id,
													})
													refetch()
												}
											}}
										/>
									)}
								</CardContent>
							</CardActionArea>
						</Card>
					))}
				</Box>
			)}

			<BottomNavigate />
		</Box>
	)
}

export default Announcements
