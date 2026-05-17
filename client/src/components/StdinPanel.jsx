export default function StdinPanel({ value, onChange, onClose }) {
  return (
    <div className="h-28 sm:h-36 bg-black border-t-2 border-white/20 flex flex-col shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/20 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-subtle text-xs font-bold font-mono">⌨ STDIN</span>
          <span className="hidden sm:inline text-xs text-muted font-mono">Program input — one value per line</span>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white text-xs px-1.5 py-0.5 hover:bg-white/5 transition-all duration-150 font-mono"
        >
          ✕ close
        </button>
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={"e.g. for a calculator that asks 3 inputs:\n5\n+\n3"}
        className="flex-1 bg-transparent resize-none outline-none px-4 py-3 font-mono text-xs text-white placeholder-muted/40 leading-relaxed"
        spellCheck={false}
      />
    </div>
  );
}
