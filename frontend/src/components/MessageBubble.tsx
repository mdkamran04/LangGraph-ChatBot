import type { Message } from "../types/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[72%]
          px-5 py-3
          text-[15px] leading-relaxed
          rounded-2xl
          shadow-[0_4px_14px_rgba(0,0,0,0.08)]
          ${
            isUser
              ? "bg-[#007AFF] text-white rounded-br-md"
              : "bg-white text-zinc-800 rounded-bl-md"
          }
        `}
      >
        <div className="prose prose-sm max-w-none prose-p:my-1">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({
                inline,
                children,
              }: {
                inline?: boolean;
                children?: React.ReactNode;
              }) {
                if (inline) {
                  return (
                    <code
                      className="
                        rounded-md
                        bg-black/5
                        px-1.5 py-0.5
                        text-[13px]
                        font-mono
                        text-zinc-800
                      "
                    >
                      {children}
                    </code>
                  );
                }

                return (
                  <pre
                    className="
                      my-3 overflow-x-auto
                      rounded-xl
                      bg-[#f4f5f7]
                      p-4
                      text-[13px]
                      text-zinc-800
                      shadow-inner
                    "
                  >
                    <code className="block whitespace-pre font-mono leading-relaxed">
                      {children}
                    </code>
                  </pre>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
