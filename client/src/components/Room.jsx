import Editor from './Editor';

export default function Room({ roomId, username, users, initialCode, initialLanguage }) {
  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.roomInfo}>
          <span style={styles.label}>Room</span>
          <code style={styles.roomId}>{roomId}</code>
        </div>
        <div style={styles.label}>Users ({users.length})</div>
        <ul style={styles.userList}>
          {users.map((u) => (
            <li key={u.socketId} style={styles.userItem}>
              <span style={styles.dot} />
              {u.username}
              {u.username === username && <span style={styles.you}> (you)</span>}
            </li>
          ))}
        </ul>
      </aside>
      <Editor
        roomId={roomId}
        initialCode={initialCode}
        initialLanguage={initialLanguage}
      />
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', background: '#1e1e2e' },
  sidebar: {
    width: '200px', background: '#181825', padding: '1rem',
    display: 'flex', flexDirection: 'column', gap: '1rem',
    borderRight: '1px solid #313244', flexShrink: 0,
  },
  roomInfo: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  label: { color: '#6c7086', fontFamily: 'monospace', fontSize: '0.75rem', textTransform: 'uppercase' },
  roomId: { color: '#89b4fa', fontFamily: 'monospace', fontSize: '0.9rem' },
  userList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  userItem: { color: '#cdd6f4', fontFamily: 'monospace', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', background: '#a6e3a1', flexShrink: 0 },
  you: { color: '#6c7086' },
};
