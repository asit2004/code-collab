import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

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
    <div className="min-h-screen bg-base flex flex-col overflow-auto">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-mantle/80 backdrop-blur border-b border-overlay/40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-bold text-text">CodeCollab</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-surface/60 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-green animate-pulse-slow" />
              <span className="text-subtle text-sm font-medium">{user.username}</span>
            </div>
            <button onClick={logout} className="btn-danger text-xs">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue/10 border border-blue/20 rounded-full px-4 py-1.5 text-blue text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse-slow" />
            Real-time collaboration — no setup needed
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-text mb-4 leading-tight">
            Code together,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue to-mauve">
              in real time
            </span>
          </h1>
          <p className="text-subtle text-lg max-w-xl mx-auto">
            Share a room ID with your team and start collaborating instantly. No login required for guests.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Join / Create Card */}
          <div className="card p-6 animate-slide-up">
            {/* Tabs */}
            <div className="flex bg-surface/50 rounded-lg p-1 mb-6 gap-1">
              {['join','create'].map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(''); }}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-150 capitalize
                    ${tab === t
                      ? 'bg-blue text-mantle shadow-lg shadow-blue/20'
                      : 'text-subtle hover:text-text'}`}
                >
                  {t === 'join' ? '→ Join Room' : '+ Create Room'}
                </button>
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red/10 border border-red/30 rounded-lg px-3 py-2.5 mb-4 animate-slide-up">
                <span className="text-red text-sm">⚠</span>
                <p className="text-red text-sm">{error}</p>
              </div>
            )}

            {tab === 'join' ? (
              <form onSubmit={joinRoom} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-subtle uppercase tracking-wide">
                    Room ID
                  </label>
                  <input
                    className="input-field font-mono"
                    placeholder="e.g. abc12345"
                    value={roomId}
                    onChange={e => setRoomId(e.target.value)}
                    maxLength={20}
                  />
                  <p className="text-muted text-xs">Ask the room creator for their 8-character ID</p>
                </div>
                <button className="btn-primary w-full py-3" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-mantle border-t-transparent rounded-full animate-spin" />
                      Joining...
                    </span>
                  ) : '→ Join Room'}
                </button>
              </form>
            ) : (
              <form onSubmit={createRoom} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-subtle uppercase tracking-wide">
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
                  <label className="block text-xs font-medium text-subtle uppercase tracking-wide">
                    Language
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {LANGUAGES.map(l => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLanguage(l)}
                        className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium border transition-all duration-150
                          ${language === l
                            ? 'bg-blue/20 border-blue text-blue'
                            : 'bg-surface/50 border-overlay/50 text-subtle hover:border-overlay hover:text-text'}`}
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
                      <span className="w-4 h-4 border-2 border-mantle border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : '+ Create Room'}
                </button>
              </form>
            )}
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="card p-4 hover:border-blue/30 hover:bg-mantle/80 transition-all duration-200 group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-text mb-1">{f.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-overlay/30 py-4 text-center text-muted text-xs">
        CodeCollab — open source, built with MERN + Socket.io
      </footer>
    </div>
  );
}
