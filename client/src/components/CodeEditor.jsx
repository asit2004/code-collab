import Editor from '@monaco-editor/react';

const MONACO_LANG_MAP = {
  javascript: 'javascript', typescript: 'typescript',
  python: 'python', java: 'java', cpp: 'cpp',
  c: 'c', go: 'go', rust: 'rust', ruby: 'ruby',
};

export default function CodeEditor({ code, language, onChange }) {
  return (
    <div className="flex-1 overflow-hidden">
      <Editor
        height="100%"
        language={MONACO_LANG_MAP[language] || 'javascript'}
        value={code}
        onChange={val => onChange(val ?? '')}
        theme="hc-black"
        options={{
          fontSize: 14,
          fontFamily: "'Space Mono', monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          tabSize: 2,
          wordWrap: 'on',
          bracketPairColorization: { enabled: true },
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderLineHighlight: 'line',
          occurrencesHighlight: false,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: { verticalScrollbarSize: 5, horizontalScrollbarSize: 5 },
        }}
      />
    </div>
  );
}
