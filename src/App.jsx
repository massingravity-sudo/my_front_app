import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterEmployee from './pages/RegisterEmployee'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Posts from './pages/Posts'
import Analytics from './pages/Analytics'
import Leaves from './pages/Leaves'
import Messages from './pages/Messages'
import Surveys from './pages/Surveys'
import CreateSurvey from './pages/CreateSurvey'
import Feedbacks from './pages/Feedbacks'
import FeedbacksAdmin from './pages/FeedbacksAdmin'
import Archives from './pages/Archives'
import ForgotPassword from './pages/ForgotPassword'
import Parametre from './pages/Parametre'
import PricingPage from './pages/PricingPage'
import ManageChefs from './pages/ManageChefs'
import Evaluation from './pages/Evaluation'
import Primes from './pages/Primes'
import SuiviEquipe from './pages/SuiviEquipe'
import Recrutement from './pages/Recrutement'

/* ── Loader ── */
function Loader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#667eea',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Chargement...</p>
      </div>
    </div>
  )
}

/* ── Route publique — redirige si déjà connecté ── */
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (user) {
    return user.role === 'admin'
      ? <Navigate to="/dashboard" replace />
      : <Navigate to="/tasks" replace />
  }
  return children
}

/* ── Route privée ── */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  return children
}

/* ── Route Admin uniquement ── */
function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/tasks" replace />
  return children
}

/* ── Route Chef + Admin ── */
function ChefRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'chef_departement' && user.role !== 'manager' && user.role !== 'admin')
    return <Navigate to="/tasks" replace />
  return children
}

/* ── Route Welcome — accessible seulement si connecté ── */
function WelcomeRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* ── Publiques ── */}
      <Route path="/landing" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ── Inscription employé via invitation (pas besoin d'être connecté) ── */}
      <Route path="/register-employee" element={<RegisterEmployee />} />

      {/* ── Page de bienvenue ── */}
      <Route path="/welcome" element={<WelcomeRoute><Welcome /></WelcomeRoute>} />

      {/* ── Privées — tous rôles ── */}
      <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
      <Route path="/posts" element={<PrivateRoute><Posts /></PrivateRoute>} />
      <Route path="/leaves" element={<PrivateRoute><Leaves /></PrivateRoute>} />
      <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
      <Route path="/surveys" element={<PrivateRoute><Surveys /></PrivateRoute>} />
      <Route path="/surveys/create" element={<PrivateRoute><CreateSurvey /></PrivateRoute>} />
      <Route path="/feedbacks" element={<PrivateRoute><Feedbacks /></PrivateRoute>} />
      <Route path="/archives" element={<PrivateRoute><Archives /></PrivateRoute>} />
      <Route path="/parametre" element={<PrivateRoute><Parametre /></PrivateRoute>} />

      {/* ── Admin uniquement ── */}
      <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
      <Route path="/manage-chefs" element={<AdminRoute><ManageChefs /></AdminRoute>} />

      {/* ── Chef + Admin ── */}
      <Route path="/feedbacks/admin" element={<ChefRoute><FeedbacksAdmin /></ChefRoute>} />
      <Route path="/evaluation" element={<ChefRoute><Evaluation /></ChefRoute>} />
      <Route path="/primes" element={<ChefRoute><Primes /></ChefRoute>} />
      <Route path="/suivi-equipe" element={<ChefRoute><SuiviEquipe /></ChefRoute>} />
      <Route path="/recrutement" element={<ChefRoute><Recrutement /></ChefRoute>} />

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </AppProvider>
  )
}