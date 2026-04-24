import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
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
import RegisterEmployee from './pages/RegisterEmployee';
/* ── Loader commun ── */
function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-white text-lg">Chargement...</p>
      </div>
    </div>
  )
}

/* ── Route publique — redirige si déjà connecté ── */
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!loading && user) {
    if (user.role === 'admin') return <Navigate to="/dashboard" replace />
    return <Navigate to="/tasks" replace />
  }
  return children
}

/* ── Route privée — tout utilisateur connecté ── */
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!loading && !user) return <Navigate to="/login" replace />
  return children
}

/* ── Route Admin uniquement ── */
function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!loading && !user) return <Navigate to="/login" replace />
  if (!loading && user && user.role !== 'admin') return <Navigate to="/tasks" replace />
  return children
}

/* ── Route Chef de département + Admin ── */
function ChefRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!loading && !user) return <Navigate to="/login" replace />
  if (!loading && user && user.role !== 'chef_departement' && user.role !== 'admin')
    return <Navigate to="/tasks" replace />
  return children
}

/* ── Toutes les routes ── */
function AppRoutes() {
  return (
    <Routes>
      {/* ── Pages publiques ── */}
      <Route path="/landing" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register-employee" element={<RegisterEmployee />} />
      {/* ── Pages privées — tous les rôles ── */}
      <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
      <Route path="/posts" element={<PrivateRoute><Posts /></PrivateRoute>} />
      <Route path="/leaves" element={<PrivateRoute><Leaves /></PrivateRoute>} />
      <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
      <Route path="/surveys" element={<PrivateRoute><Surveys /></PrivateRoute>} />
      <Route path="/surveys/create" element={<PrivateRoute><CreateSurvey /></PrivateRoute>} />
      <Route path="/feedbacks" element={<PrivateRoute><Feedbacks /></PrivateRoute>} />
      <Route path="/archives" element={<PrivateRoute><Archives /></PrivateRoute>} />
      <Route path="/parametre" element={<PrivateRoute><Parametre /></PrivateRoute>} />

      {/* ── Pages Admin uniquement ── */}
      <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
      <Route path="/manage-chefs" element={<AdminRoute><ManageChefs /></AdminRoute>} />

      {/* ── Pages Chef + Admin ── */}
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