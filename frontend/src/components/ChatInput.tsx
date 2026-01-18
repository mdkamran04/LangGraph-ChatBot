export function ChatInput({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
}) {
  const handleSend = () => {
    if (!value.trim()) return;
    onSend();
  };

  return (
    <div
      className="
        shrink-0
        px-4 py-3
        bg-[#f4f5f7]
        border-t border-black/5
      "
    >
      <div
        className="
          flex items-center gap-3
          rounded-full
          bg-white
          px-4 py-2
          shadow-[0_4px_14px_rgba(0,0,0,0.08)]
        "
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Message"
          className="
            flex-1
            bg-transparent
            text-[15px]
            text-zinc-800
            placeholder-zinc-400
            outline-none
          "
        />

        <button
          onClick={handleSend}
          disabled={!value.trim()}
          className="
            w-9 h-9 rounded-full
            bg-[#007AFF]
            text-white
            flex items-center justify-center
            shadow-md
            transition
            active:scale-90
            disabled:opacity-40
            disabled:cursor-not-allowed
          "
        >
          ↑
        </button>
      </div>
    </div>
  );
}
