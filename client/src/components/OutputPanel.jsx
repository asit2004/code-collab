export default function OutputPanel({ output, onClose, isCompiling, autoCompile }) {
  return (
    <div className="h-36 sm:h-52 bg-black border-t-2 border-white/20 flex flex-col shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/20">
        <div className="flex items-center gap-2.5">
          <span className="text-subtle text-xs font-bold font-mono">▶ OUTPUT</span>

          {isCompiling && (
            <span className="flex items-center gap-1.5 text-yellow text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow animate-pulse-slow" />
              compiling...
            </span>
          )}

          {!isCompiling && output && (
            <span className={`text-xs px-2 py-0.5 font-bold font-mono border-2
              ${output.isError
                ? 'bg-red/15 text-red border-red/40'
                : 'bg-green/15 text-green border-green/40'}`}
            >
              {output.status || (output.isError ? 'Error' : 'Accepted')}
            </span>
          )}

          {autoCompile && !isCompiling && (
            <span className="text-xs px-2 py-0.5 bg-blue/10 text-blue border-2 border-blue/20 font-mono">
              auto
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-white/40 hover:text-white text-xs px-1.5 py-0.5 hover:bg-white/5 transition-all duration-150 font-mono"
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
