import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import styles from './Home.module.css';

const LANGUAGES = ['javascript','typescript','python','java','cpp','c','go','rust','ruby'];

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('join'); // 'join' | 'create'

  const createRoom = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/rooms/create', { name: roomName, language });
      navigate(`/room/${res.data.room.roomId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create room');
    } finally { setLoading(false); }
  };

  const joinRoom = async (e) => {
    e.preventDefault();
    if (!roomId.trim()) return setError('Please enter a room ID');
    setLoading(true); setError('');
    try {
      await api.get(`/rooms/${roomId.trim()}`);
      navigate(`/room/${roomId.trim()}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Room not found');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>&#9889; CodeCollab</div>
        <div className={styles.userInfo}>
          <span>&#128100; {user.username}</span>
          <button onClick={logout} className={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>Real-Time Code Collaboration</h1>
          <p>Create a room or join an existing one to start coding together</p>
        </div>

        <div className={styles.card}>
          <div className={styles.tabs}>
            <button className={tab === 'join' ? styles.activeTab : styles.tab} onClick={() => setTab('join')}>
              Join Room
            </button>
            <button className={tab === 'create' ? styles.activeTab : styles.tab} onClick={() => setTab('create')}>
              Create Room
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {tab === 'join' ? (
            <form onSubmit={joinRoom} className={styles.form}>
              <div className={styles.field}>
                <label>Room ID</label>
                <input placeholder="Enter 8-character room ID" value={roomId}
                  onChange={e => setRoomId(e.target.value)} maxLength={20} />
              </div>
              <button type="submit" className={styles.primaryBtn} disabled={loading}>
                {loading ? 'Joining...' : '→ Join Room'}
              </button>
            </form>
          ) : (
            <form onSubmit={createRoom} className={styles.form}>
              <div className={styles.field}>
                <label>Room Name (optional)</label>
                <input placeholder="My Coding Session" value={roomName}
                  onChange={e => setRoomName(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label>Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <button type="submit" className={styles.primaryBtn} disabled={loading}>
                {loading ? 'Creating...' : '+ Create Room'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
