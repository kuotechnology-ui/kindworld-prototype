import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from './hooks/redux'
import Layout from './components/Layout'
import AuthDebug from './components/AuthDebug'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignInPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import DashboardPage from './pages/DashboardPage'
import CompanyDashboardPage from './pages/CompanyDashboardPage'
import NGODashboardPage from './pages/NGODashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import MissionsPage from './pages/MissionsPage'
import MissionDetailPage from './pages/MissionDetailPage'
import BadgesPage from './pages/BadgesPage'
import ProfilePage from './pages/ProfilePage'
import LeaderboardPage from './pages/LeaderboardPage'
import VerificationRequestPage from './pages/VerificationRequestPage'
import NotificationSettingsPage from './pages/NotificationSettingsPage'

function App() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  
  console.log('App render - isAuthenticated:', isAuthenticated, 'user:', user)

  if (!isAuthenticated) {
    return (
      <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/verification-request" element={<VerificationRequestPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AuthDebug />
      </>
    )
  }

  // Route based on user role
  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'company':
        return <CompanyDashboardPage />
      case 'ngo':
        // NGO dashboard is always accessible, but features within it are restricted
        return <NGODashboardPage />
      case 'admin':
        return <AdminDashboardPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={getDashboardComponent()} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/missions/:id" element={<MissionDetailPage />} />
        <Route path="/badges" element={<BadgesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notification-settings" element={<NotificationSettingsPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/verification-request" element={<VerificationRequestPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AuthDebug />
    </Layout>
  )
}

export default App
