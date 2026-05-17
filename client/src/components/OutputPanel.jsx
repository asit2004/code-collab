export default function OutputPanel({ output, onClose, isCompiling, autoCompile }) {
  return (
    <div className="h-52 bg-crust border-t border-overlay/50 flex flex-col shrink-0 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-overlay/30">
        <div className="flex items-center gap-2.5">
          <span className="text-subtle text-xs font-semibold">▶ OUTPUT</span>

          {isCompiling && (
            <span className="flex items-center gap-1.5 text-yellow text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow animate-pulse-slow" />
              compiling...
            </span>
          )}

          {!isCompiling && output && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
              ${output.isError
                ? 'bg-red/15 text-red border border-red/30'
                : 'bg-green/15 text-green border border-green/30'}`}
            >
              {output.status || (output.isError ? 'Error' : 'Accepted')}
            </span>
          )}

          {autoCompile && !isCompiling && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue/10 text-blue border border-blue/20">
              auto
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-muted hover:text-text text-xs px-1.5 py-0.5 hover:bg-surface/50 rounded transition-all duration-150"
        >
          ✕ close
        </button>
      </div>

      {/* Output content */}
      <pre className={`flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed
        ${isCompiling ? 'text-yellow/60 italic' : output?.isError ? 'text-red' : 'text-green'}`}
      >
        {isCompiling
          ? '⏳  Running your code...'
          : (output?.output || 'No output')}
      </pre>
    </div>
  );
}
