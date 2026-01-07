import {
	Box,
	Button,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
	useTheme,
	useMediaQuery,
	Divider,
} from '@mui/material'
import { useState } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useTranslationStore } from '../../store/language/useTranslationStore'
import { login, register } from '../../api/login/login'
import { useTokenStore } from '../../store/token/useTokenStore'
import { useNavigate } from 'react-router-dom'
const Register = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [isLogin, setIsLogin] = useState(true)
	const { setToken } = useTokenStore()
	const navigate = useNavigate()
	const { t } = useTranslationStore()
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const [isShow, setIsShow] = useState(false)
	const [form, setForm] = useState<{ login: string; password: string }>({
		login: '',
		password: '',
	})
	async function handleSubmit(form: { login: string; password: string }) {
		setIsLoading(true)
		try {
			if (isLogin) {
				const result = await login(form)
				setToken(result.token)
			} else {
				const result = await register(form)
				setToken(result.token)
			}
			setIsLoading(false)
			navigate('/')
		} catch (error: any) {
			setIsLoading(false)
			alert(error?.response?.data || error.message || 'Unknown error')
		}
	}

	return (
		<Box
			sx={{
				width: '100vw',
				height: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: theme.palette.background.default,
				p: isMobile ? 2 : 0,
			}}
		>
			<Box
				sx={{
					width: '100%',
					maxWidth: '420px',
					p: { xs: 2, sm: 4, md: 5 },
					display: 'flex',
					flexDirection: 'column',
					gap: { xs: 2.5, sm: 3 },
					borderRadius: 3,
					border: '1px solid',
					borderColor: 'divider',
					backgroundColor: theme.palette.background.paper,
					boxShadow: 4,
				}}
			>
				<Typography
					variant={isMobile ? 'h5' : 'h4'}
					sx={{
						color: theme.palette.primary.main,
						textAlign: 'center',
						fontWeight: 600,
					}}
				>
					FASTPIN
				</Typography>

				<TextField
					fullWidth
					variant='outlined'
					placeholder='Login'
					value={form.login}
					onChange={e => setForm({ ...form, login: e.target.value })}
					onKeyDown={e => e.key === 'Enter' && handleSubmit(form)}
					size={isMobile ? 'small' : 'medium'}
				/>

				<TextField
					fullWidth
					variant='outlined'
					placeholder='Password'
					type={isShow ? 'text' : 'password'}
					value={form.password}
					onChange={e => setForm({ ...form, password: e.target.value })}
					onKeyDown={e => e.key === 'Enter' && handleSubmit(form)}
					size={isMobile ? 'small' : 'medium'}
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								<IconButton
									onClick={() => setIsShow(prev => !prev)}
									edge='end'
									size={isMobile ? 'small' : 'medium'}
								>
									{isShow ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
								</IconButton>
							</InputAdornment>
						),
					}}
				/>

				<Button
					variant='contained'
					size='large'
					fullWidth
					loading={isLoading}
					disabled={!form.login || !form.password}
					onClick={() => handleSubmit(form)}
					color='info'
					sx={{
						mt: 1,
						py: { xs: 0.5, sm: 1, md: 1.5 },
						fontSize: { xs: '1rem', sm: '1.1rem' },
					}}
				>
					{isLogin ? t.system_login : t.create_account}
				</Button>
				{/* Красивая линия с "or" */}
				<Divider
					sx={{
						'&::before, &::after': {
							borderColor: 'divider',
						},
					}}
				>
					<Typography variant='body2' sx={{ color: 'text.secondary' }}>
						{t.or}
					</Typography>
				</Divider>
				<Button
					variant='outlined'
					size='large'
					fullWidth
					onClick={() => setIsLogin(prev => !prev)}
					sx={{
						py: { xs: 0.5, sm: 1, md: 1.5 },
						fontSize: { xs: '1rem', sm: '1.1rem' },
					}}
				>
					{isLogin ? t.register : t.login}
				</Button>
			</Box>
		</Box>
	)
}

export default Register
