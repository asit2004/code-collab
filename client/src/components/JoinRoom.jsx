import { useState } from 'react';

export default function JoinRoom({ onJoin }) {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !roomId.trim()) return;
    onJoin({ username: username.trim(), roomId: roomId.trim() });
  };

  const generateRoomId = () => {
    // Simple 6-char alphanumeric ID
    setRoomId(Math.random().toString(36).slice(2, 8).toUpperCase());
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Collaborative Code Editor</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
        />
        <div style={styles.row}>
          <input
            style={{ ...styles.input, flex: 1 }}
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            maxLength={10}
          />
          <button type="button" onClick={generateRoomId} style={styles.secondaryBtn}>
            Generate
          </button>
        </div>
        <button type="submit" style={styles.btn}>
          Join Room
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '100vh', background: '#1e1e2e',
  },
  title: { color: '#cdd6f4', fontFamily: 'monospace', marginBottom: '2rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', width: '320px' },
  row: { display: 'flex', gap: '0.5rem' },
  input: {
    padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #45475a',
    background: '#313244', color: '#cdd6f4', fontFamily: 'monospace', fontSize: '1rem',
  },
  btn: {
    padding: '0.75rem', borderRadius: '6px', border: 'none',
    background: '#89b4fa', color: '#1e1e2e', fontFamily: 'monospace',
    fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '0.75rem', borderRadius: '6px', border: '1px solid #45475a',
    background: '#313244', color: '#cdd6f4', fontFamily: 'monospace', cursor: 'pointer',
  },
};
