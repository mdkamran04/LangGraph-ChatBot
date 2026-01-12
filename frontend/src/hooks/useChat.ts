import { useEffect, useRef, useState } from "react";
import type { Message } from "../types/chat";

const SESSION_ID = crypto.randomUUID();

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setLoading(true);

    // 1️⃣ Add user message + empty AI placeholder
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
      { role: "ai", content: "" }
    ]);

    const res = await fetch("http://localhost:3000/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: SESSION_ID,
        message: userText
      })
    });

    if (!res.body) {
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let accumulated = ""; // 👈 tracks what we have already rendered
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      if (!value) continue;

      const chunk = decoder.decode(value, { stream: true });

      if (!chunk) continue;

      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];

        if (last.role === "ai") {
          // ✅ deduplicate overlapping chunks
          if (chunk.startsWith(accumulated)) {
            last.content = chunk;
          } else {
            last.content += chunk.replace(accumulated, "");
          }

          accumulated = last.content;
        }

        return updated;
      });
    }

    setLoading(false);
  }

  return {
    messages,
    input,
    setInput,
    loading,
    sendMessage,
    bottomRef
  };
}
