import type { Message } from "../types/chat";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[72%] px-5 py-3 text-[15px] leading-relaxed rounded-[22px] backdrop-blur-xl shadow-sm ${
          isUser
            ? "bg-[#007AFF]/90 text-white rounded-br-md"
            : "bg-white/80 text-zinc-800 rounded-bl-md"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-linear-to-b from-white/40 to-transparent opacity-60" />
        <span className="relative z-10">{message.content}</span>
      </div>
    </div>
  );
}
