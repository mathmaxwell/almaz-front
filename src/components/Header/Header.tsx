import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import CampaignIcon from '@mui/icons-material/Campaign'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import LanguageIcon from '@mui/icons-material/Language'
import LogoutIcon from '@mui/icons-material/Logout'
import InfoIcon from '@mui/icons-material/Info'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import {
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { useThemeStore } from '../../store/theme/theme'
import { useTokenStore } from '../../store/token/useTokenStore'
import { useGamesStoreModal } from '../../store/modal/useGameModal'
export default function Header() {
	const { t, lang, setLang } = useTranslationStore()
	const { openModal } = useGamesStoreModal()
	const navigate = useNavigate()
	const [open, setOpen] = useState(false)
	const { setTheme, theme } = useThemeStore()
	const { resetToken, token } = useTokenStore()
	const isAdmin = import.meta.env.VITE_ADMINTOKEN == token
	return (
		<Box sx={{ flexGrow: 1, width: '100%' }}>
			<AppBar position='static'>
				<Toolbar>
					<IconButton
						size='large'
						edge='start'
						color='inherit'
						aria-label='open drawer'
						sx={{ mr: 2 }}
						onClick={() => {
							setOpen(true)
						}}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						variant='h6'
						noWrap
						component='div'
						sx={{ cursor: 'pointer' }}
						onClick={() => {
							navigate('/')
						}}
					>
						FASTPIN
					</Typography>

					<Box sx={{ flexGrow: 1 }} />
					<Box sx={{ display: 'flex' }}>
						<IconButton
							onClick={() => {
								navigate('/profile')
							}}
							size='large'
							edge='end'
							aria-haspopup='true'
							color='inherit'
						>
							<AccountCircle />
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>
			<Drawer
				open={open}
				onClose={() => {
					setOpen(false)
				}}
			>
				<Box
					sx={{ width: 250 }}
					role='presentation'
					onClick={() => {
						setOpen(false)
					}}
				>
					<List>
						<ListItem disablePadding>
							<ListItemButton
								onClick={() => {
									navigate('/announcements')
								}}
							>
								<ListItemIcon>
									<CampaignIcon />
								</ListItemIcon>
								<ListItemText primary={t.announcements} />
								{/*elon */}
							</ListItemButton>
						</ListItem>
					</List>
					<Divider />
					<List>
						<ListItem disablePadding>
							<ListItemButton
								onClick={() => {
									navigate('/about')
								}}
							>
								<ListItemIcon>
									<InfoIcon />
								</ListItemIcon>
								<ListItemText primary={t.about} />
							</ListItemButton>
						</ListItem>
					</List>
					<Divider />
					<List>
						<ListItem disablePadding>
							<ListItemButton
								onClick={() => {
									theme === 'dark' ? setTheme('light') : setTheme('dark')
								}}
							>
								<ListItemIcon>
									{theme == 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
								</ListItemIcon>
								<ListItemText
									primary={theme == 'dark' ? t.light_mode : t.dark_theme}
								/>
							</ListItemButton>
						</ListItem>
						<ListItem disablePadding>
							<ListItemButton
								onClick={() => {
									lang == 'ru' ? setLang('uz') : setLang('ru')
								}}
							>
								<ListItemIcon>
									<LanguageIcon />
								</ListItemIcon>
								<ListItemText primary={lang == 'ru' ? t.uzbek : t.russian} />
							</ListItemButton>
						</ListItem>
						{isAdmin && (
							<ListItem disablePadding>
								<ListItemButton
									onClick={() => {
										openModal()
									}}
								>
									<ListItemIcon>
										<SportsEsportsIcon />
									</ListItemIcon>
									<ListItemText primary={t.add_game} />
								</ListItemButton>
							</ListItem>
						)}
					</List>
				</Box>
				<ListItem disablePadding sx={{ mt: 'auto' }}>
					<ListItemButton
						onClick={() => {
							resetToken()
						}}
					>
						<ListItemIcon>
							<LogoutIcon color='error' />
						</ListItemIcon>
						<ListItemText primary={t.logout_of_system} sx={{ color: 'red' }} />
					</ListItemButton>
				</ListItem>
			</Drawer>
		</Box>
	)
}
