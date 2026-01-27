import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { useTokenStore } from '../../store/token/useTokenStore'
import { getAnnouncements } from '../../api/Announcements/Announcements'
import type { IAnnouncements } from '../../types/Announcements/Announcements'
import LoadingProgress from '../Loading/LoadingProgress'

const HeaderAnnouncements = () => {
	const { lang } = useTranslationStore()
	const { token } = useTokenStore()
	const navigate = useNavigate()
	const { data: slides = [], isLoading } = useQuery<IAnnouncements[], Error>({
		queryKey: ['slides', token],
		queryFn: () => getAnnouncements({ token }).then(res => res ?? []),
		enabled: !!token,
	})
	const apiUrl = import.meta.env.VITE_API_URL
	const [activeIndex, setActiveIndex] = useState(0)
	useEffect(() => {
		if (slides.length <= 1) return
		const interval = setInterval(() => {
			setActiveIndex(prev => (prev + 1) % slides.length)
		}, 4500)
		return () => clearInterval(interval)
	}, [slides.length])
	if (isLoading) {
		return (
			<Box
				sx={{
					width: '100%',
					height: { xs: 180, sm: 260, md: 340 },
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					bgcolor: 'background.paper',
				}}
			>
				<LoadingProgress />
			</Box>
		)
	}
	if (slides.length === 0) return null
	const current = slides[activeIndex]
	return (
		<>
			<Box
				sx={{
					width: '100%',
					aspectRatio: { xs: '16/9', md: '21/9' },
					position: 'relative',
					overflow: 'hidden',
					borderRadius: { xs: 0, md: 2 },
					boxShadow: { md: '0 8px 24px rgba(0,0,0,0.15)' },
					bgcolor: 'background.paper',
				}}
			>
				<Box
					component='img'
					src={`${apiUrl}${current.image}`}
					alt={lang === 'ru' ? current.ru : current.uz}
					sx={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						objectPosition: 'center',
						transition: 'opacity 0.8s ease',
						opacity: 1,
						position: 'absolute',
						inset: 0,
					}}
					onClick={() => {
						navigate(`/announcements/${current.id}`)
					}}
					onError={e => {
						console.error('Не загрузилась картинка:', e.currentTarget.src)
					}}
				/>
				<Box
					sx={{
						position: 'absolute',
						inset: 0,
						background:
							'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)',
						pointerEvents: 'none',
					}}
				/>
				<Box
					sx={{
						position: 'absolute',
						bottom: { xs: 16, sm: 24, md: 32 },
						left: { xs: 16, sm: 24, md: 32 },
						right: { xs: 16, sm: 24, md: 32 },
						color: 'white',
						zIndex: 2,
					}}
				>
					<Typography
						variant='h5'
						component='div'
						sx={{
							fontWeight: 700,
							textShadow: '0 2px 12px rgba(0,0,0,0.9)',
							lineHeight: 1.3,
							letterSpacing: '-0.01em',
							WebkitLineClamp: 3,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
							display: '-webkit-box',
						}}
					>
						{lang === 'ru' ? current.ru : current.uz}
					</Typography>
				</Box>
				{slides.length > 1 && (
					<Box
						sx={{
							position: 'absolute',
							bottom: 12,
							left: '50%',
							transform: 'translateX(-50%)',
							display: 'flex',
							gap: '10px',
							zIndex: 3,
						}}
					>
						{slides.map((_, idx) => (
							<Box
								key={idx}
								onClick={() => setActiveIndex(idx)}
								sx={{
									width: 10,
									height: 10,
									borderRadius: '50%',
									bgcolor:
										idx === activeIndex ? 'white' : 'rgba(255,255,255,0.4)',
									border: '1px solid rgba(255,255,255,0.3)',
									cursor: 'pointer',
									transition: 'all 0.3s ease',
									'&:hover': {
										bgcolor: 'white',
										transform: 'scale(1.2)',
									},
								}}
							/>
						))}
					</Box>
				)}
			</Box>
		</>
	)
}

export default HeaderAnnouncements
