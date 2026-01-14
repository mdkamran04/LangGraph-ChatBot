import type { Message } from "../types/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[72%] px-5 py-3 text-[15px] leading-relaxed rounded-[22px] backdrop-blur-xl shadow-sm overflow-hidden ${
          isUser
            ? "bg-[#007AFF]/90 text-white rounded-br-md"
            : "bg-white/80 text-zinc-800 rounded-bl-md"
        }`}
      >
        {/* glass highlight */}
        <div
          className="
    pointer-events-none absolute inset-0 rounded-[22px]
    bg-linear-to-b from-white/40 to-transparent opacity-60
  "
        />

        {/* markdown content */}
        <div className="relative z-10 prose prose-sm max-w-none wrap-break-word">
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
                mx-0.5 rounded-md
                bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100
                px-1.5 py-0.5
                text-[13px] font-medium text-purple-800
                shadow-sm
              "
                    >
                      {children}
                    </code>
                  );
                }

                return (
                  <pre
                    className="
              group relative my-4 max-w-full overflow-x-auto rounded-2xl
              bg-gradient-to-br from-[#fdfbff] via-[#f3f0ff] to-[#eef2ff]
              p-4 text-[13px] text-slate-800
              shadow-lg ring-1 ring-indigo-200

              before:absolute before:inset-0 before:rounded-2xl
              before:bg-gradient-to-r
              before:from-pink-400/20
              before:via-purple-400/20
              before:to-indigo-400/20
              before:opacity-0 before:transition-opacity
              hover:before:opacity-100
            "
                  >
                    <code
                      className="
                block whitespace-pre font-mono leading-relaxed
                text-slate-900
                selection:bg-indigo-200
              "
                    >
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
