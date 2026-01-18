import { useEffect, useRef, useState } from "react";
import type { Message } from "../types/chat";

export function useChat(sessionId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 🔁 Load messages when session changes
  useEffect(() => {
    if (!sessionId) return;

    async function loadMessages() {
      setMessages([]);
      setLoading(true);

      const res = await fetch(
        `http://localhost:3000/messages?sessionId=${sessionId}`
      );

      const data = await res.json();
      setMessages(data);
      setLoading(false);
    }

    loadMessages();
  }, [sessionId]);

  // auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading || !sessionId) return;

    const userText = input;
    setInput("");
    setLoading(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: userText,
    };

    const aiMessage: Message = {
      id: crypto.randomUUID(),
      role: "ai",
      content: "",
    };

    // optimistic UI
    setMessages((prev) => [...prev, userMessage, aiMessage]);

    const res = await fetch("http://localhost:3000/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        message: userText,
      }),
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

      setMessages((prev) => {
        const lastIndex = prev.length - 1;
        const last = prev[lastIndex];

        if (!last || last.role !== "ai") return prev;

        const updated = [...prev];
        updated[lastIndex] = {
          ...last,
          content: last.content + chunk,
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
    bottomRef,
  };
}
