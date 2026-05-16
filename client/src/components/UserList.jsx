import styles from './UserList.module.css';

export default function UserList({ users, currentUser }) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>Users</span>
        <span className={styles.count}>{users.length}</span>
      </div>
      <div className={styles.list}>
        {users.map((user) => (
          <div key={user.socketId} className={styles.user}>
            <span className={styles.dot} style={{ background: user.color }} />
            <span className={styles.name}>
              {user.username}
              {user.username === currentUser && <span className={styles.you}> (you)</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
