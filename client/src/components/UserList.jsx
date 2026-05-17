export default function UserList({ users, currentUser }) {
  return (
    <div className="fixed sm:relative top-12 sm:top-auto left-0 sm:left-auto bottom-0 sm:bottom-auto z-40 sm:z-auto flex flex-col w-56 sm:w-44 shrink-0 bg-mantle border-r border-overlay/50 shadow-2xl sm:shadow-none">
      <div className="panel-header">
        <span>Users</span>
        <span className="bg-blue/20 text-blue text-xs px-1.5 py-0.5 rounded-full font-bold">
          {users.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {users.length === 0 ? (
          <p className="text-muted text-xs text-center py-6">No users yet</p>
        ) : (
          users.map(user => (
            <div
              key={user.socketId}
              className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-surface/50 transition-colors group"
            >
              {/* Avatar circle */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-mantle shrink-0 shadow-sm"
                style={{ backgroundColor: user.color }}
              >
                {user.username[0].toUpperCase()}
              </div>
              <span className="text-sm text-subtle group-hover:text-text transition-colors truncate">
                {user.username}
                {user.username === currentUser && (
                  <span className="text-blue text-xs ml-1">(you)</span>
                )}
              </span>
              {/* Online dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-green shrink-0 ml-auto animate-pulse-slow" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
