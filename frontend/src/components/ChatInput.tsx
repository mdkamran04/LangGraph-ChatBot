export function ChatInput({
  value,
  onChange,
  onSend
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="p-4 bg-white/70 backdrop-blur border-t border-white/60">
      <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl rounded-full px-4 py-2 shadow-inner">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Message"
          className="flex-1 bg-transparent text-[15px] text-zinc-800 placeholder-zinc-400 outline-none"
        />
        <button
          onClick={onSend}
          className="w-9 h-9 rounded-full bg-[#007AFF] flex items-center justify-center text-white shadow-md active:scale-90 transition"
        >
          ↑
        </button>
      </div>
    </div>
  );
}
