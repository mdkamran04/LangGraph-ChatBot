import type { Session } from "../hooks/useSessions";

export function Sidebar({
  sessions,
  activeSessionId,
  onSelect,
  onNew,
  onDelete,
}: {
  sessions: Session[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className="
        w-64 h-full flex flex-col
        bg-[#f1f3f7]
        text-zinc-700
        border-r border-black/5
      "
    >
      {/* New chat */}
      <button
        onClick={onNew}
        className="
          m-3 rounded-lg px-4 py-2 text-sm font-medium
          bg-white
          shadow-sm
          hover:bg-zinc-50
          transition
        "
      >
        + New Chat
      </button>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {sessions.map((s) => {
          const active = s.id === activeSessionId;

          return (
            <div
              key={s.id}
              className={`
                group flex items-center rounded-lg px-3 py-2 text-sm
                transition
                ${
                  active
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "hover:bg-white/70"
                }
              `}
            >
              <button
                onClick={() => onSelect(s.id)}
                className="flex-1 truncate text-left"
              >
                {s.title || "New Chat"}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(s.id);
                }}
                className="ml-2 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-400"
              >
                🗑
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
