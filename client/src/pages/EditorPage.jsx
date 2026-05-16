import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import socket from '../socket';
import api from '../utils/api';
import CodeEditor from '../components/CodeEditor';
import ChatPanel from '../components/ChatPanel';
import UserList from '../components/UserList';
import Toolbar from '../components/Toolbar';
import OutputPanel from '../components/OutputPanel';
import styles from './EditorPage.module.css';

export default function EditorPage() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [code, setCode] = useState('// Start coding here...\n');
  const [language, setLanguage] = useState('javascript');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [output, setOutput] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [showChat, setShowChat] = useState(true);
  const [showUsers, setShowUsers] = useState(true);
  const [versions, setVersions] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const typingTimeout = useRef(null);
  const isRemoteUpdate = useRef(false);

  // Load room info and chat history
  useEffect(() => {
    api.get(`/rooms/${roomId}`).then(res => {
      setRoomInfo(res.data.room);
    }).catch(() => navigate('/'));

    api.get(`/rooms/${roomId}/chat`).then(res => {
      setMessages(res.data.messages.map(m => ({
        type: m.type, id: m._id, username: m.username,
        message: m.message, timestamp: m.createdAt,
      })));
    }).catch(console.error);
  }, [roomId]);

  // Socket setup
  useEffect(() => {
    socket.connect();
    socket.emit('join-room', { roomId, username: user.username });

    // Receive initial room state
    socket.on('room-state', ({ code, language, users }) => {
      setCode(code);
      setLanguage(language);
      setUsers(users);
    });

    // Receive code updates from others
    socket.on('code-update', ({ code }) => {
      isRemoteUpdate.current = true;
      setCode(code);
    });

    socket.on('language-update', ({ language }) => setLanguage(language));

    socket.on('user-joined', ({ users }) => setUsers(users));
    socket.on('user-left', ({ users }) => setUsers(users));

    socket.on('chat-message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('code-saved', ({ username, timestamp, versions }) => {
      setVersions(versions);
      setMessages(prev => [...prev, {
        type: 'system',
        message: `Code saved by ${username}`,
        timestamp,
      }]);
    });

    socket.on('user-typing', ({ username, isTyping }) => {
      setTypingUsers(prev => {
        const next = new Set(prev);
        isTyping ? next.add(username) : next.delete(username);
        return next;
      });
    });

    return () => {
      socket.off('room-state');
      socket.off('code-update');
      socket.off('language-update');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('chat-message');
      socket.off('code-saved');
      socket.off('user-typing');
      socket.disconnect();
    };
  }, [roomId, user.username]);

  // Handle local code change
  const handleCodeChange = useCallback((newCode) => {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
    setCode(newCode);
    socket.emit('code-change', { roomId, code: newCode });
  }, [roomId]);

  const handleLanguageChange = useCallback((lang) => {
    setLanguage(lang);
    socket.emit('language-change', { roomId, language: lang });
  }, [roomId]);

  const handleSendMessage = useCallback((message) => {
    socket.emit('send-message', { roomId, username: user.username, message });
  }, [roomId, user.username]);

  const handleTyping = useCallback((isTyping) => {
    socket.emit('typing', { roomId, username: user.username, isTyping });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    if (isTyping) {
      typingTimeout.current = setTimeout(() => {
        socket.emit('typing', { roomId, username: user.username, isTyping: false });
      }, 2000);
    }
  }, [roomId, user.username]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    socket.emit('save-code', { roomId, code, language, username: user.username });
    setTimeout(() => setIsSaving(false), 1000);
  }, [roomId, code, language, user.username]);

  const handleExecute = useCallback(async () => {
    setIsExecuting(true);
    setOutput(null);
    try {
      const res = await api.post('/execute', { code, language });
      setOutput(res.data);
    } catch (err) {
      setOutput({ output: err.response?.data?.error || 'Execution failed', isError: true });
    } finally {
      setIsExecuting(false);
    }
  }, [code, language]);

  const handleRestoreVersion = useCallback((versionCode) => {
    setCode(versionCode);
    socket.emit('code-change', { roomId, code: versionCode });
  }, [roomId]);

  return (
    <div className={styles.container}>
      <Toolbar
        roomId={roomId}
        roomName={roomInfo?.name}
        language={language}
        onLanguageChange={handleLanguageChange}
        onSave={handleSave}
        onExecute={handleExecute}
        isSaving={isSaving}
        isExecuting={isExecuting}
        showChat={showChat}
        showUsers={showUsers}
        onToggleChat={() => setShowChat(v => !v)}
        onToggleUsers={() => setShowUsers(v => !v)}
        versions={versions}
        onRestoreVersion={handleRestoreVersion}
        username={user.username}
      />

      <div className={styles.body}>
        {showUsers && <UserList users={users} currentUser={user.username} />}

        <div className={styles.editorArea}>
          <CodeEditor
            code={code}
            language={language}
            onChange={handleCodeChange}
          />
          {output && (
            <OutputPanel output={output} onClose={() => setOutput(null)} />
          )}
        </div>

        {showChat && (
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            currentUser={user.username}
            typingUsers={typingUsers}
          />
        )}
      </div>
    </div>
  );
}
