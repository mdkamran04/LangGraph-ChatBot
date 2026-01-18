export function Sidebar({
  sessions,
  activeSessionId,
  onSelect,
  onNew,
}: any) {
  return (
    <div
      className="
        w-64 h-full flex flex-col
        bg-[#f1f3f7]
        text-zinc-700
        border-r border-black/5
      "
    >
      <button
        onClick={onNew}
        className="
          m-3 rounded-lg px-4 py-2 text-sm font-medium
          bg-[#e4e7ef]
          hover:bg-[#dfe3ee]
          transition
        "
      >
        + New Chat
      </button>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {sessions.map((s: any) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`
              w-full truncate rounded-lg px-3 py-2 text-left text-sm
              transition
              ${
                s.id === activeSessionId
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "hover:bg-white/70"
              }
            `}
          >
            {s.id.slice(0, 8)}
          </button>
        ))}
      </div>
    </div>
  );
}
