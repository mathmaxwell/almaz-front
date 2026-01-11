import {
	ImageList,
	ImageListItem,
	ImageListItemBar,
	Typography,
	Box,
	Link,
	useMediaQuery,
	useTheme,
} from '@mui/material'
import Header from '../../components/Header/Header'
import telegram from '../../images/telegram.png'
import instagram from '../../images/instagram.webp'
import admin from '../../images/admin.jpeg'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import BottomNavigate from '../home/BottomNavigate'
const About = () => {
	const { t } = useTranslationStore()
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const isDesctop = useMediaQuery(theme.breakpoints.down('md'))

	const contacts = [
		{
			title: 'Telegram канал',
			subtitle: '@mlbb_donater',
			image: telegram,
			link: 'https://t.me/mlbb_donater',
		},
		{
			title: 'Instagram',
			subtitle: '@your_instagram', // Заменить на реальный аккаунт
			image: instagram,
			link: 'https://instagram.com/your_instagram', // Заменить
		},
		{
			title: 'Администратор',
			subtitle: '@Usmonov_admini',
			image: admin,
			link: 'https://t.me/Usmonov_admini',
		},
	]

	return (
		<>
			<Header />
			<Box sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
				<Typography variant='h4' textAlign='center' fontWeight='bold'>
					{t.contact_us}
				</Typography>
				<Typography
					variant='body1'
					textAlign='center'
					color='text.secondary'
					mb={5}
				>
					{t.contact_message}
				</Typography>

				<ImageList
					cols={isMobile ? 1 : isDesctop ? 2 : 3}
					gap={24}
					sx={{
						'& .MuiImageListItem-root': {
							borderRadius: '16px',
							overflow: 'hidden',
						},
					}}
				>
					{contacts.map(item => (
						<ImageListItem
							key={item.subtitle}
							component={Link}
							href={item.link}
							target='_blank'
							rel='noopener noreferrer'
							sx={{ cursor: 'pointer' }}
						>
							<img
								src={item.image}
								alt={item.title}
								loading='lazy'
								style={{
									width: '100%',
									height: '320px',
									objectFit: 'cover',
									borderRadius: '16px',
								}}
							/>
							<ImageListItemBar
								title={
									<Typography variant='h6' fontWeight='bold'>
										{item.title}
									</Typography>
								}
								subtitle={
									<Typography variant='body2' sx={{ color: '#fff' }}>
										{item.subtitle}
									</Typography>
								}
								sx={{
									background:
										'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
									borderRadius: '0 0 16px 16px',
									'.MuiImageListItemBar-title': { color: '#fff' },
									'.MuiImageListItemBar-subtitle': { color: '#fff' },
								}}
							/>
						</ImageListItem>
					))}
				</ImageList>
			</Box>
			<BottomNavigate />
		</>
	)
}

export default About
