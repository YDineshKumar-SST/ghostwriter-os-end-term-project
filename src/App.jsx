import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PersonaProvider } from './context/PersonaContext';
import CommandPalette from './components/CommandPalette';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Vlogs = lazy(() => import('./pages/Vlogs'));
const Trending = lazy(() => import('./pages/Trending'));
const Analytics = lazy(() => import('./pages/Analytics'));

const AppLayout = () => {
  const { user, signOutUser, loading } = useAuth();

  return (
    <div className="min-h-screen bg-[#07080d] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-sky-400">GhostWriter OS</p>
            <h1 className="text-2xl font-semibold tracking-tight text-white">AI Persona Command Center</h1>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            {user && (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm transition ${
                      isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm transition ${
                      isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  Settings
                </NavLink>
                <button
                  type="button"
                  onClick={signOutUser}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
                  disabled={loading}
                >
                  Sign out
                </button>
              </>
            )}
            {!user && (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm transition ${
                    isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                Login
              </NavLink>
            )}
            <span className="rounded-full bg-slate-900 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-500">Cmd+K</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-slate-400">Loading app...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <PersonaProvider>
        <Router>
          <AppLayout />
          <CommandPalette />
        </Router>
      </PersonaProvider>
    </AuthProvider>
  );
}

export default App;
