import type { Message } from "../types/chat";
import { MessageBubble } from "./MessageBubble";

export function MessageList({
  messages,
  loading,
  bottomRef
}: {
  messages: Message[];
  loading: boolean;
  bottomRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
      {messages.map((m, i) => (
        <MessageBubble key={m.id} message={m} />

      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="px-5 py-3 rounded-[22px] bg-white/70 backdrop-blur text-sm text-zinc-500 shadow animate-pulse">
            Typing…
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
