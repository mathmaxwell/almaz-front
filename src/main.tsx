import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.tsx'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useThemeStore } from '../src/store/theme/theme.ts'
import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
function Main() {
	const { theme } = useThemeStore()
	const muiTheme = useMemo(() => {
		const isDark = theme === 'dark'
		return createTheme({
			palette: {
				mode: isDark ? 'dark' : 'light',
				background: {
					default: isDark ? '#0A0E17' : '#F0F4FF',
					paper: isDark ? '#121822' : '#FFFFFF',
				},
				primary: {
					main: isDark ? '#00D4FF' : '#007BFF',
					light: isDark ? '#4DEFFF' : '#4D9CFF',
					dark: isDark ? '#0095CC' : '#0056B3',
					contrastText: '#FFFFFF',
				},
				secondary: {
					main: isDark ? '#FF2E63' : '#E91E63',
					light: isDark ? '#FF5F8A' : '#F06292',
					dark: isDark ? '#C70039' : '#C2185B',
					contrastText: '#FFFFFF',
				},
				success: {
					main: isDark ? '#00FF9F' : '#00C853',
				},
				error: {
					main: isDark ? '#FF3D71' : '#D81B60',
				},
				warning: {
					main: isDark ? '#FFD700' : '#FFAB00',
				},
				info: {
					main: isDark ? '#00E5FF' : '#00B8D4',
				},
				custom: {
					neonPurple: isDark ? '#BB00FF' : '#7C4DFF',
					neonOrange: isDark ? '#FF6B00' : '#FF5722',
					neonCyan: isDark ? '#00F5FF' : '#00E5FF',
					neonGreen: isDark ? '#39FF14' : '#00E676',
					gradientStart: isDark ? '#00D4FF' : '#3B82F6',
					gradientEnd: isDark ? '#FF00AA' : '#EC4899',
				},
				text: {
					primary: isDark ? '#E0F7FF' : '#0F172A',
					secondary: isDark ? '#B0BEC5' : '#475569',
					disabled: isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)',
				},
				divider: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
				action: {
					hover: isDark
						? 'rgba(0, 212, 255, 0.12)'
						: 'rgba(59, 130, 246, 0.12)',
					selected: isDark
						? 'rgba(0, 212, 255, 0.16)'
						: 'rgba(59, 130, 246, 0.16)',
				},
			},
			typography: {
				fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
				h1: { fontWeight: 800 },
				h2: { fontWeight: 700 },
				button: { fontWeight: 600 },
			},
			components: {
				MuiButton: {
					styleOverrides: {
						root: {
							borderRadius: 12,
							textTransform: 'none',
							fontWeight: 600,
						},
						contained: {
							boxShadow: isDark ? '0 0 20px rgba(0, 212, 255, 0.4)' : 'none',
						},
					},
				},
			},
		})
	}, [theme])
	const queryClient = new QueryClient()
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={muiTheme}>
				<CssBaseline />
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</ThemeProvider>
		</QueryClientProvider>
	)
}

createRoot(document.getElementById('root')!).render(<Main />)
