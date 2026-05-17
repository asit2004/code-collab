import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { WebGLShader } from '../components/ui/web-gl-shader';
import { LiquidButton } from '../components/ui/liquid-glass-button';

const LANGUAGES = ['javascript','typescript','python','java','cpp','c','go','rust','ruby'];

const LANG_ICONS = {
  javascript: '🟨', typescript: '🔷', python: '🐍',
  java: '☕', cpp: '⚙️', c: '🔧', go: '🐹', rust: '🦀', ruby: '💎',
};

const FEATURES = [
  { icon: '⚡', title: 'Real-time Sync', desc: 'Every keystroke synced instantly across all users' },
  { icon: '💬', title: 'Live Chat', desc: 'Communicate with your team while coding' },
  { icon: '▶', title: 'Run Code', desc: 'Execute code in 9 languages without leaving the editor' },
  { icon: '🕒', title: 'Version History', desc: 'Save and restore up to 20 code snapshots' },
];

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('join');
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const joinRoom = async (e) => {
    e.preventDefault();
    if (!roomId.trim()) return setError('Please enter a Room ID');
    setLoading(true); setError('');
    try {
      await api.get(`/rooms/${roomId.trim()}`);
      navigate(`/room/${roomId.trim()}`);
    } catch {
      setError('Room not found. Check the ID and try again.');
    } finally { setLoading(false); }
  };

  const createRoom = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/rooms/create', { name: roomName, language });
      navigate(`/room/${res.data.room.roomId}`);
    } catch {
      setError('Failed to create room. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-auto relative">
      <WebGLShader />

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-black/70 backdrop-blur border-b-2 border-white/20 relative">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-mono tracking-tighter text-lg">CodeCollab</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-white/20">
              <div className="w-2 h-2 rounded-full bg-green animate-pulse-slow" />
              <span className="text-subtle text-sm font-medium font-mono">{user.username}</span>
            </div>
            <button onClick={logout} className="btn-danger text-xs">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 sm:py-12 relative z-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
            </span>
            <p className="text-xs text-green font-mono">Real-time collaboration — no setup needed</p>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Code together,{' '}
            <span className="text-red">in real time</span>
          </h1>
          <p className="text-subtle text-lg max-w-xl mx-auto mb-8">
            Share a room ID with your team and start collaborating instantly.
          </p>
          <div className="flex justify-center">
            <LiquidButton size="xl" className="text-white border rounded-full" onClick={() => document.getElementById('action-card')?.scrollIntoView({ behavior: 'smooth' })}>
              Get Started
            </LiquidButton>
          </div>
        </div>

        {/* Double border frame */}
        <div className="border-2 border-white/20 p-2">
          <div className="border-2 border-white/10 bg-black/85 backdrop-blur-sm">
            <div className="grid lg:grid-cols-2">
              {/* Join / Create Card */}
              <div id="action-card" className="p-6 border-b-2 lg:border-b-0 lg:border-r-2 border-white/10">
                {/* Tabs */}
                <div className="flex border-2 border-white/20 mb-6">
                  {['join','create'].map(t => (
                    <button
                      key={t}
                      onClick={() => { setTab(t); setError(''); }}
                      className={`flex-1 py-2 text-sm font-bold transition-all duration-150 capitalize font-mono
                        ${tab === t
                          ? 'bg-red text-black'
                          : 'text-subtle hover:text-white'}`}
                    >
                      {t === 'join' ? '→ Join Room' : '+ Create Room'}
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="flex items-center gap-2 bg-red/10 border-2 border-red/40 px-3 py-2.5 mb-4">
                    <span className="text-red text-sm">⚠</span>
                    <p className="text-red text-sm">{error}</p>
                  </div>
                )}

                {tab === 'join' ? (
                  <form onSubmit={joinRoom} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-white/60 uppercase tracking-wider font-mono">
                        Room ID
                      </label>
                      <input
                        className="input-field font-mono"
                        placeholder="e.g. abc12345"
                        value={roomId}
                        onChange={e => setRoomId(e.target.value)}
                        maxLength={20}
                      />
                      <p className="text-muted text-xs font-mono">Ask the room creator for their 8-character ID</p>
                    </div>
                    <button className="btn-primary w-full py-3" disabled={loading}>
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Joining...
                        </span>
                      ) : '→ Join Room'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={createRoom} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-white/60 uppercase tracking-wider font-mono">
                        Room Name <span className="text-muted normal-case">(optional)</span>
                      </label>
                      <input
                        className="input-field"
                        placeholder="My Coding Session"
                        value={roomName}
                        onChange={e => setRoomName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-white/60 uppercase tracking-wider font-mono">
                        Language
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {LANGUAGES.map(l => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => setLanguage(l)}
                            className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-bold border-2 transition-all duration-150 font-mono
                              ${language === l
                                ? 'bg-blue/20 border-blue text-blue shadow-[2px_2px_0_0_#3399ff]'
                                : 'bg-surface/50 border-white/20 text-subtle hover:border-white/40 hover:text-white'}`}
                          >
                            <span>{LANG_ICONS[l]}</span>
                            <span className="capitalize">{l}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <button className="btn-primary w-full py-3" disabled={loading}>
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Creating...
                        </span>
                      ) : '+ Create Room'}
                    </button>
                  </form>
                )}
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-2">
                {FEATURES.map((f, i) => (
                  <div
                    key={i}
                    className={`p-5 border-b-2 border-white/10 hover:bg-white/5 transition-all duration-200 group
                      ${i % 2 === 0 ? 'border-r-2' : ''}
                      ${i >= 2 ? 'border-b-0' : ''}`}
                  >
                    <div className="text-2xl mb-2">{f.icon}</div>
                    <h3 className="text-sm font-bold text-white mb-1 font-mono">{f.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-white/10 py-4 text-center font-mono text-white/30 text-xs">
        CodeCollab — open source, built with MERN + Socket.io
      </footer>
    </div>
  );
}
