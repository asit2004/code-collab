export default function StdinPanel({ value, onChange, onClose }) {
  return (
    <div className="h-36 bg-crust border-t border-overlay/50 flex flex-col shrink-0 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-overlay/30 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-subtle text-xs font-semibold">⌨ STDIN</span>
          <span className="text-xs text-muted">Program input — one value per line</span>
        </div>
        <button
          onClick={onClose}
          className="text-muted hover:text-text text-xs px-1.5 py-0.5 hover:bg-surface/50 rounded transition-all duration-150"
        >
          ✕ close
        </button>
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={"e.g. for a calculator that asks 3 inputs:\n5\n+\n3"}
        className="flex-1 bg-transparent resize-none outline-none px-4 py-3 font-mono text-xs text-text placeholder-muted/40 leading-relaxed"
        spellCheck={false}
      />
    </div>
  );
}
