import { useState, useEffect, useRef } from 'react';

export default function ChatPanel({ messages, onSendMessage, onTyping, currentUser, typingUsers }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
    if (isTypingRef.current) { onTyping(false); isTypingRef.current = false; }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    if (!isTypingRef.current) { onTyping(true); isTypingRef.current = true; }
  };

  const formatTime = ts => ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  const typingList = Array.from(typingUsers).filter(u => u !== currentUser);

  return (
    <div className="fixed sm:relative top-12 sm:top-auto right-0 sm:right-auto bottom-0 sm:bottom-auto z-40 sm:z-auto flex flex-col w-72 shrink-0 bg-mantle border-l border-overlay/50 shadow-2xl sm:shadow-none">
      {/* Header */}
      <div className="panel-header">
        <span>Chat</span>
        <span className="text-muted text-xs">{messages.filter(m => m.type !== 'system').length} msgs</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 opacity-50">
            <span className="text-3xl">💬</span>
            <p className="text-muted text-xs text-center">No messages yet.<br/>Say hello!</p>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id || i} className="flex justify-center">
                <span className="bg-surface/60 text-muted text-xs px-3 py-1 rounded-full">
                  {msg.message}
                </span>
              </div>
            );
          }

          const isMine = msg.username === currentUser;
          return (
            <div key={msg.id || i} className={`flex flex-col gap-0.5 ${isMine ? 'items-end' : 'items-start'} animate-fade-in`}>
              {!isMine && (
                <span className="text-xs text-blue font-medium px-1">{msg.username}</span>
              )}
              <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed break-words
                ${isMine
                  ? 'bg-blue/20 text-text rounded-tr-sm border border-blue/20'
                  : 'bg-surface text-text rounded-tl-sm border border-overlay/50'}`}
              >
                {msg.message}
              </div>
              <span className="text-xs text-muted px-1">{formatTime(msg.timestamp)}</span>
            </div>
          );
        })}

        {typingList.length > 0 && (
          <div className="flex items-center gap-2 px-1">
            <div className="flex gap-0.5">
              {[0,1,2].map(i => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-yellow"
                  style={{ animation: `bounceDot 1.2s ${i * 0.2}s infinite ease-in-out` }}
                />
              ))}
            </div>
            <span className="text-xs text-yellow italic">
              {typingList.join(', ')} {typingList.length === 1 ? 'is' : 'are'} typing...
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-overlay/50 flex gap-2">
        <input
          value={input}
          onChange={handleChange}
          placeholder="Message..."
          autoComplete="off"
          className="input-field text-sm py-2"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="shrink-0 w-9 h-9 flex items-center justify-center bg-blue hover:bg-lavender text-mantle rounded-lg font-bold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed active:scale-90"
        >
          ↑
        </button>
      </form>
    </div>
  );
}
