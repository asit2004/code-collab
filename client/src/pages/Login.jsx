import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WebGLShader } from '../components/ui/web-gl-shader';

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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative">
      <WebGLShader />

      <div className="relative w-full max-w-md z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-2xl font-bold text-white mb-2 font-mono tracking-tighter">
            CodeCollab
          </div>
          <p className="text-subtle text-sm font-mono">Real-time collaborative coding</p>
        </div>

        {/* Card */}
        <div className="bg-black/90 border-2 border-white/30 p-8 shadow-[8px_8px_0_0_rgba(255,255,255,0.1)]">
          <h1 className="text-xl font-bold text-white mb-6 font-mono">Welcome back</h1>

          {error && (
            <div className="flex items-start gap-2 bg-red/10 border-2 border-red/40 px-3 py-2.5 mb-5">
              <span className="text-red mt-0.5">⚠</span>
              <p className="text-red text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider font-mono">Email</label>
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
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider font-mono">Password</label>
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
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="text-center text-subtle text-sm mt-5 font-mono">
          No account?{' '}
          <Link to="/register" className="text-blue hover:text-blue/80 font-bold">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
