import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "ai";
  content: string;
};

const SESSION_ID = crypto.randomUUID();

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: SESSION_ID,
        message: userMessage.content
      })
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "ai", content: data.reply }]);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f2f4f8] via-white to-[#eef2ff] flex items-center justify-center px-4">
      
      <div className="w-full max-w-3xl h-[85vh] rounded-4xl bg-white/60 backdrop-blur-2xl border border-white/70 shadow-[0_30px_90px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 bg-white/70 backdrop-blur border-b border-white/60">
          <h1 className="text-[17px] font-semibold text-zinc-800">
            LangGraph
          </h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-[72%] px-5 py-3 text-[15px] leading-relaxed rounded-[22px] backdrop-blur-xl shadow-sm ${
                  m.role === "user"
                    ? "bg-[#007AFF]/90 text-white rounded-br-md"
                    : "bg-white/80 text-zinc-800 rounded-bl-md"
                }`}
              >
                {/* inner glass highlight */}
                <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-linear-to-b from-white/40 to-transparent opacity-60" />
                <span className="relative z-10">{m.content}</span>
              </div>
            </div>
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

        {/* Input */}
        <div className="p-4 bg-white/70 backdrop-blur border-t border-white/60">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl rounded-full px-4 py-2 shadow-inner">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Message"
              className="flex-1 bg-transparent text-[15px] text-zinc-800 placeholder-zinc-400 outline-none"
            />

            <button
              onClick={sendMessage}
              className="w-9 h-9 rounded-full bg-[#007AFF] flex items-center justify-center text-white shadow-md active:scale-90 transition"
            >
              ↑
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
