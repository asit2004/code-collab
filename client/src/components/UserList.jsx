export default function UserList({ users, currentUser }) {
  return (
    <div className="fixed sm:relative top-12 sm:top-auto left-0 sm:left-auto bottom-0 sm:bottom-auto z-40 sm:z-auto flex flex-col w-56 sm:w-44 shrink-0 bg-black border-r-2 border-white/20 shadow-2xl sm:shadow-none">
      <div className="panel-header">
        <span>Users</span>
        <span className="bg-red/20 text-red text-xs px-1.5 py-0.5 border border-red/40 font-bold font-mono">
          {users.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {users.length === 0 ? (
          <p className="text-muted text-xs text-center py-6 font-mono">No users yet</p>
        ) : (
          users.map(user => (
            <div
              key={user.socketId}
              className="flex items-center gap-2 px-2 py-2 hover:bg-white/5 transition-colors group"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black shrink-0"
                style={{ backgroundColor: user.color }}
              >
                {user.username[0].toUpperCase()}
              </div>
              <span className="text-sm text-subtle group-hover:text-white transition-colors truncate font-mono">
                {user.username}
                {user.username === currentUser && (
                  <span className="text-blue text-xs ml-1">(you)</span>
                )}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-green shrink-0 ml-auto animate-pulse-slow" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
