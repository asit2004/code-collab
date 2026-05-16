import { useState } from 'react';
import styles from './Toolbar.module.css';

const LANGUAGES = ['javascript','typescript','python','java','cpp','c','go','rust','ruby'];

export default function Toolbar({
  roomId, roomName, language, onLanguageChange,
  onSave, onExecute, isSaving, isExecuting,
  showChat, showUsers, onToggleChat, onToggleUsers,
  versions, onRestoreVersion, username,
}) {
  const [showVersions, setShowVersions] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.left}>
        <span className={styles.logo}>&#9889;</span>
        <span className={styles.roomName}>{roomName || 'Untitled Room'}</span>
        <button className={styles.roomIdBtn} onClick={copyRoomId} title="Click to copy room ID">
          <span className={styles.roomIdLabel}>ID:</span> {roomId}
          {copied ? ' ✓' : ' 📋'}
        </button>
      </div>

      <div className={styles.center}>
        <select
          value={language}
          onChange={e => onLanguageChange(e.target.value)}
          className={styles.langSelect}
        >
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className={styles.right}>
        <button onClick={() => setShowVersions(v => !v)} className={styles.iconBtn} title="Version history">
          History
        </button>
        <button onClick={onSave} className={styles.iconBtn} disabled={isSaving} title="Save (Ctrl+S)">
          {isSaving ? 'Saved' : 'Save'}
        </button>
        <button onClick={onExecute} className={styles.runBtn} disabled={isExecuting} title="Run code">
          {isExecuting ? 'Running...' : 'Run'}
        </button>
        <button onClick={onToggleUsers} className={`${styles.iconBtn} ${showUsers ? styles.active : ''}`} title="Toggle users">
          Users
        </button>
        <button onClick={onToggleChat} className={`${styles.iconBtn} ${showChat ? styles.active : ''}`} title="Toggle chat">
          Chat
        </button>
      </div>

      {showVersions && (
        <div className={styles.versionsPanel}>
          <div className={styles.versionHeader}>
            <h3>Version History</h3>
            <button onClick={() => setShowVersions(false)} className={styles.closeBtn}>X</button>
          </div>
          {versions.length === 0 ? (
            <p className={styles.noVersions}>No saved versions yet. Press Save to create one.</p>
          ) : (
            [...versions].reverse().map((v, i) => (
              <div key={i} className={styles.versionItem}>
                <div className={styles.versionMeta}>
                  <span>{v.label}</span>
                  <span className={styles.versionBy}>by {v.savedBy}</span>
                  <span className={styles.versionTime}>{new Date(v.savedAt).toLocaleString()}</span>
                </div>
                <button onClick={() => { onRestoreVersion(v.code); setShowVersions(false); }} className={styles.restoreBtn}>
                  Restore
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
