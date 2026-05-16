import { useState, useEffect, useRef } from 'react';
import styles from './ChatPanel.module.css';

export default function ChatPanel({ messages, onSendMessage, onTyping, currentUser, typingUsers }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const typingRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
    if (typingRef.current) { onTyping(false); typingRef.current = false; }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!typingRef.current) { onTyping(true); typingRef.current = true; }
    // Stop typing indicator is handled via timeout in EditorPage
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const typingList = Array.from(typingUsers).filter(u => u !== currentUser);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span>Chat</span>
      </div>

      <div className={styles.messages}>
        {messages.map((msg, i) => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id || i} className={styles.systemMsg}>
                {msg.message}
              </div>
            );
          }
          const isMine = msg.username === currentUser;
          return (
            <div key={msg.id || i} className={`${styles.message} ${isMine ? styles.mine : styles.theirs}`}>
              {!isMine && <span className={styles.username}>{msg.username}</span>}
              <div className={styles.bubble}>{msg.message}</div>
              <span className={styles.time}>{formatTime(msg.timestamp)}</span>
            </div>
          );
        })}
        {typingList.length > 0 && (
          <div className={styles.typingIndicator}>
            {typingList.join(', ')} {typingList.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className={styles.inputArea}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          autoComplete="off"
        />
        <button type="submit" className={styles.sendBtn} disabled={!input.trim()}>&#8593;</button>
      </form>
    </div>
  );
}
