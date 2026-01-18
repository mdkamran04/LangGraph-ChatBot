import type { Message } from "../types/chat";
import { MessageBubble } from "./MessageBubble";

export function MessageList({
  messages,
  loading,
  bottomRef,
}: {
  messages: Message[];
  loading: boolean;
  bottomRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 scroll-smooth">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="px-5 py-3 rounded-[22px] bg-white text-sm text-zinc-500 shadow-[0_4px_14px_rgba(0,0,0,0.08)] animate-pulse">
            Typing…
          </div>
        </div>
      )}

      {/* scroll anchor */}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
