import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mantle flex items-center justify-center p-4">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-mauve/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-2xl font-bold text-text mb-2">
            <span className="text-3xl">⚡</span>
            <span>CodeCollab</span>
          </div>
          <p className="text-subtle text-sm">Real-time collaborative coding</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h1 className="text-xl font-semibold text-text mb-6">Welcome back</h1>

          {error && (
            <div className="flex items-start gap-2 bg-red/10 border border-red/30 rounded-lg px-3 py-2.5 mb-5 animate-slide-up">
              <span className="text-red mt-0.5">⚠</span>
              <p className="text-red text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-subtle uppercase tracking-wide">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input-field"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-subtle uppercase tracking-wide">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full py-2.5 mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-mantle border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="text-center text-subtle text-sm mt-5">
          No account?{' '}
          <Link to="/register" className="text-blue hover:text-lavender transition-colors font-medium">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
