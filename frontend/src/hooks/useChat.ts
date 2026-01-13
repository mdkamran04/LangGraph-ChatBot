import { useEffect, useRef, useState } from "react";
import type { Message } from "../types/chat";

// Persist sessionId across requests
const SESSION_ID =
  sessionStorage.getItem("sessionId") ??
  (() => {
    const id = crypto.randomUUID();
    sessionStorage.setItem("sessionId", id);
    return id;
  })();

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

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: userText
    };

    const aiMessage: Message = {
      id: crypto.randomUUID(),
      role: "ai",
      content: ""
    };

    // Add user + empty AI message
    setMessages((prev) => [...prev, userMessage, aiMessage]);

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

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;

      const chunk = decoder.decode(value, { stream: true });
      if (!chunk) continue;

      // ✅ PURE, IMMUTABLE UPDATE (StrictMode-safe)
      setMessages((prev) => {
        const lastIndex = prev.length - 1;
        const last = prev[lastIndex];

        if (!last || last.role !== "ai") return prev;

        const updated = [...prev];
        updated[lastIndex] = {
          ...last,
          content: last.content + chunk
        };

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
