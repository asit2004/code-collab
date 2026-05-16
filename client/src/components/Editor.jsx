import { useRef, useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import socket from '../socket';

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java',
  'cpp', 'c', 'html', 'css', 'json', 'markdown',
];

export default function Editor({ roomId, initialCode, initialLanguage }) {
  const editorRef = useRef(null);
  const isRemoteChange = useRef(false);
  const [language, setLanguage] = useState(initialLanguage);

  useEffect(() => {
    socket.on('code-change', ({ code }) => {
      if (!editorRef.current) return;
      // Flag so onChange doesn't re-emit this back to the server
      isRemoteChange.current = true;
      // Preserve cursor position by using model setValue only when content differs
      const current = editorRef.current.getValue();
      if (current !== code) editorRef.current.setValue(code);
    });

    socket.on('language-change', ({ language: lang }) => {
      setLanguage(lang);
    });

    return () => {
      socket.off('code-change');
      socket.off('language-change');
    };
  }, []);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleChange = (value = '') => {
    // Skip emit if this change was triggered by a remote setValue call
    if (isRemoteChange.current) {
      isRemoteChange.current = false;
      return;
    }
    socket.emit('code-change', { roomId, code: value });
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    socket.emit('language-change', { roomId, language: lang });
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.toolbar}>
        <span style={styles.toolbarLabel}>Language</span>
        <select value={language} onChange={handleLanguageChange} style={styles.select}>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <MonacoEditor
        height="calc(100vh - 42px)"
        language={language}
        defaultValue={initialCode}
        theme="vs-dark"
        onChange={handleChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          tabSize: 2,
          automaticLayout: true,   // resizes editor when container changes
        }}
      />
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', flex: 1, height: '100vh' },
  toolbar: {
    height: '42px', background: '#181825', borderBottom: '1px solid #313244',
    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 1rem',
  },
  toolbarLabel: { color: '#6c7086', fontFamily: 'monospace', fontSize: '0.8rem' },
  select: {
    background: '#313244', color: '#cdd6f4', border: '1px solid #45475a',
    borderRadius: '4px', padding: '2px 8px', fontFamily: 'monospace', fontSize: '0.85rem',
    cursor: 'pointer',
  },
};
