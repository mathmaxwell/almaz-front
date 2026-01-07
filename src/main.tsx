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
					default: isDark ? '#2D2D2D' : '#F3F4F6',
					paper: isDark ? '#393E46' : '#FFFFFF',
				},
				primary: {
					main: isDark ? '#90CAF9' : '#3B82F6',
				},
				secondary: {
					main: isDark ? '#F48FB1' : '#EC4899',
				},
				text: {
					primary: isDark ? '#E5E7EB' : '#111827',
					secondary: isDark ? '#9CA3AF' : '#4B5563',
				},
				divider: isDark ? '#4B5563' : '#E5E7EB',
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
