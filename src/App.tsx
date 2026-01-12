import './App.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import ErrorPage from './pages/Error/ErrorPage'
import Register from './pages/Register/Register'
import { useTokenStore } from './store/token/useTokenStore'
import HomePage from './pages/home/HomePage'
import { useEffect } from 'react'
import Announcements from './pages/announcements/Announcements'
import Profile from './pages/Profile/Profile'
import About from './pages/About/About'
import GamePage from './pages/games/GamePage'
import GameModal from './components/modal/GameModal'
import OfferModal from './components/modal/OfferModal'
import Cart from './pages/Cart/Cart'
import Wallet from './pages/Wallet/Wallet'

function App() {
	const { token } = useTokenStore()
	const navigate = useNavigate()
	useEffect(() => {
		if (!token) {
			navigate('/register')
		}
	})
	return (
		<>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/profile' element={<Profile />} />
				<Route
					path='/:gameName/:gameId'
					element={
						<>
							<GamePage />
							<OfferModal />
						</>
					}
				/>
				<Route path='/wallet' element={<Wallet />} />
				<Route path='/about' element={<About />} />
				<Route path='/announcements' element={<Announcements />} />
				<Route
					path='/announcements/:announcementsId'
					element={<Announcements />}
				/>
				<Route path='/cart' element={<Cart />} />
				<Route path='/register' element={<Register />} />
				<Route path='*' element={<ErrorPage />} />
			</Routes>
			<GameModal />
		</>
	)
}

export default App
