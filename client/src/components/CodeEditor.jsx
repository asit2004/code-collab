import Editor from '@monaco-editor/react';
import styles from './CodeEditor.module.css';

const MONACO_LANG_MAP = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  go: 'go',
  rust: 'rust',
  ruby: 'ruby',
};

export default function CodeEditor({ code, language, onChange }) {
  const handleEditorChange = (value) => {
    onChange(value ?? '');
  };

  return (
    <div className={styles.editorWrapper}>
      <Editor
        height="100%"
        language={MONACO_LANG_MAP[language] || 'javascript'}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          tabSize: 2,
          wordWrap: 'on',
          bracketPairColorization: { enabled: true },
          padding: { top: 16 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
        }}
      />
    </div>
  );
}
