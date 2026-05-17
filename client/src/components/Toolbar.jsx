import { useState, useRef, useEffect } from 'react';

const LANGUAGES = ['javascript','typescript','python','java','cpp','c','go','rust','ruby'];

export default function Toolbar({
  roomId, roomName, language, onLanguageChange,
  onSave, onExecute, isSaving, isExecuting,
  showChat, showUsers, onToggleChat, onToggleUsers,
  versions, onRestoreVersion,
  autoCompile, onToggleAutoCompile,
  showStdin, onToggleStdin,
  username, onLogout, onLeaveRoom,
}) {
  const [copied, setCopied] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex items-center justify-between px-2 sm:px-3 h-12 bg-mantle border-b border-overlay/50 shrink-0 gap-1 sm:gap-2 z-50">
      {/* Left */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-blue font-bold text-sm shrink-0">⚡</span>
        <span className="font-semibold text-text text-sm truncate max-w-32 hidden sm:block">
          {roomName || 'Untitled'}
        </span>
        <button
          onClick={copyRoomId}
          className="flex items-center gap-1.5 bg-surface/60 hover:bg-surface border border-overlay/50 hover:border-blue/50 rounded-md px-2 py-1 text-xs text-subtle hover:text-blue transition-all duration-150 font-mono shrink-0"
          title="Copy room ID"
        >
          <span className="text-muted">ID:</span>
          <span>{roomId}</span>
          <span>{copied ? '✓' : '📋'}</span>
        </button>
      </div>

      {/* Center */}
      <div className="flex items-center">
        <select
          value={language}
          onChange={e => onLanguageChange(e.target.value)}
          className="bg-surface border border-overlay/50 text-subtle hover:text-text text-xs rounded-lg px-2.5 py-1.5 outline-none cursor-pointer hover:border-blue/50 transition-all duration-150"
        >
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Auto-compile toggle — hidden on xs */}
        <button
          onClick={onToggleAutoCompile}
          title={autoCompile ? 'Auto-compile ON' : 'Auto-compile OFF'}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150
            ${autoCompile
              ? 'bg-yellow/10 border-yellow/50 text-yellow'
              : 'bg-transparent border-overlay/50 text-muted hover:border-overlay hover:text-subtle'}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${autoCompile ? 'bg-yellow animate-pulse-slow' : 'bg-overlay'}`} />
          <span className="hidden sm:inline">{autoCompile ? 'Auto ON' : 'Auto'}</span>
        </button>

        {/* Version history — hidden on xs */}
        <button
          onClick={() => setShowVersions(v => !v)}
          className={`hidden sm:flex btn-ghost text-xs px-2.5 py-1.5 ${showVersions ? 'border-blue/50 text-blue' : ''}`}
          title="Version history"
        >
          <span>🕒</span>
          <span className="hidden sm:inline ml-1">History</span>
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`btn-ghost text-xs px-2.5 py-1.5 ${isSaving ? 'border-green/50 text-green' : ''}`}
          title="Save (Ctrl+S)"
        >
          {isSaving ? '✓ Saved' : '💾 Save'}
        </button>

        {/* Stdin toggle */}
        <button
          onClick={onToggleStdin}
          title={showStdin ? 'Hide stdin panel' : 'Provide program input (stdin)'}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150
            ${showStdin
              ? 'bg-teal/10 border-teal/50 text-teal'
              : 'bg-transparent border-overlay/50 text-muted hover:border-overlay hover:text-subtle'}`}
        >
          <span>⌨</span>
          <span className="hidden md:inline">Stdin</span>
        </button>

        {/* Run */}
        <button
          onClick={onExecute}
          disabled={isExecuting}
          className="flex items-center gap-1.5 bg-green/20 hover:bg-green/30 border border-green/40 text-green font-semibold text-xs px-3 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          title="Run code"
        >
          {isExecuting ? (
            <>
              <span className="w-3 h-3 border-2 border-green border-t-transparent rounded-full animate-spin" />
              <span className="hidden sm:inline">Running...</span>
            </>
          ) : (
            <>▶ <span className="hidden sm:inline">Run</span></>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-overlay/50 mx-0.5" />

        {/* Toggle Users */}
        <button
          onClick={onToggleUsers}
          className={`btn-ghost text-xs px-2 py-1.5 ${showUsers ? 'border-blue/50 text-blue bg-blue/5' : ''}`}
          title="Toggle users panel"
        >👥</button>

        {/* Toggle Chat */}
        <button
          onClick={onToggleChat}
          className={`btn-ghost text-xs px-2 py-1.5 ${showChat ? 'border-blue/50 text-blue bg-blue/5' : ''}`}
          title="Toggle chat panel"
        >💬</button>

        {/* Divider */}
        <div className="w-px h-5 bg-overlay/50 mx-0.5" />

        {/* User menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(v => !v)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all duration-150 text-xs
              ${showUserMenu
                ? 'bg-blue/10 border-blue/40 text-blue'
                : 'bg-surface/60 border-overlay/50 text-subtle hover:border-blue/40 hover:text-text'}`}
            title="User menu"
          >
            {/* Avatar circle */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue to-mauve flex items-center justify-center text-mantle font-bold text-xs shrink-0">
              {username?.[0]?.toUpperCase() ?? '?'}
            </div>
            <span className="hidden sm:inline max-w-20 truncate font-medium">{username}</span>
            <span className="text-muted text-xs">{showUserMenu ? '▲' : '▼'}</span>
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <div className="absolute top-full right-0 mt-1.5 w-48 bg-mantle border border-overlay/50 rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-up">
              {/* User info */}
              <div className="px-3 py-3 border-b border-overlay/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue to-mauve flex items-center justify-center text-mantle font-bold text-sm shrink-0">
                    {username?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text truncate">{username}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-slow" />
                      <p className="text-xs text-muted">Online</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-1.5 space-y-0.5">
                <button
                  onClick={() => { setShowUserMenu(false); onLeaveRoom?.(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-subtle hover:bg-surface/60 hover:text-text transition-all duration-150 text-left"
                >
                  <span>🏠</span>
                  <span>Leave Room</span>
                </button>

                <button
                  onClick={() => { setShowUserMenu(false); onLogout?.(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red/80 hover:bg-red/10 hover:text-red transition-all duration-150 text-left"
                >
                  <span>→</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Version history dropdown */}
      {showVersions && (
        <div className="absolute top-12 right-0 w-80 max-h-96 overflow-y-auto bg-mantle border border-overlay/50 rounded-b-xl shadow-2xl z-50 animate-slide-up">
          <div className="panel-header">
            <span>Version History</span>
            <button onClick={() => setShowVersions(false)} className="text-muted hover:text-text transition-colors">✕</button>
          </div>
          {versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <span className="text-3xl opacity-30">🕒</span>
              <p className="text-muted text-xs text-center">No versions yet.<br/>Press Save to create a snapshot.</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {[...versions].reverse().map((v, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface/50 transition-colors group">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm text-text truncate">{v.label}</span>
                    <span className="text-xs text-blue">by {v.savedBy}</span>
                    <span className="text-xs text-muted">{new Date(v.savedAt).toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => { onRestoreVersion(v.code); setShowVersions(false); }}
                    className="opacity-0 group-hover:opacity-100 text-xs bg-blue/10 hover:bg-blue/20 border border-blue/30 text-blue px-2.5 py-1 rounded-md transition-all duration-150 shrink-0 ml-2"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
