import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { user, loading, authError, login, signUp, continueAsDemo, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    if (mode === 'login') {
      const { error } = await login(email, password);
      if (error) {
        setFormError(error.message ?? 'Unable to sign in.');
      }
      return;
    }

    const { error } = await signUp(email, password);
    if (error) {
      setFormError(error.message ?? 'Unable to create an account.');
      return;
    }

    setMode('login');
  };

  return (
    <div className="min-h-screen bg-[#07080d] px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/90 p-8 shadow-[0_24px_120px_rgba(15,23,42,0.35)]">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-sky-400">Secure access</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">GhostWriter OS</h1>
          <p className="mt-3 text-slate-400">Sign in to manage your AI content workflow and get intelligent completion suggestions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
              placeholder="Enter password"
            />
          </div>

          {(formError || authError) && (
            <div className="rounded-3xl bg-rose-500/10 p-4 text-sm text-rose-300">{formError || authError}</div>
          )}

          <button
            type="submit"
            className="w-full rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
            disabled={loading}
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {mode === 'login' ? (
            <>
              New here?{' '}
              <button type="button" onClick={() => setMode('signup')} className="font-semibold text-sky-400 hover:text-sky-300">
                Create an account
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button type="button" onClick={() => setMode('login')} className="font-semibold text-sky-400 hover:text-sky-300">
                Sign in now
              </button>
            </>
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 text-center text-slate-500">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Need env setup?</p>
          <p className="mt-2 text-sm">Add your Supabase credentials in <code className="rounded bg-slate-800 px-2 py-1">.env</code> as <code className="text-sky-400">VITE_SUPABASE_URL</code> and <code className="text-sky-400">VITE_SUPABASE_ANON_KEY</code>.</p>
          {!isSupabaseConfigured && (
            <button
              type="button"
              onClick={() => {
                continueAsDemo();
                navigate('/');
              }}
              className="mt-4 rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              Continue in demo mode
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
