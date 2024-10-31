import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/landing'
import Aauthentication from './pages/authentication'
import { AuthProvider } from './contexts/AuthContext'
import VideoMeetComponent from './pages/VideoMeet'
import Home from './pages/Home'

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/auth' element={<Aauthentication/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='meeting/:url' element={<VideoMeetComponent/>}/>
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App