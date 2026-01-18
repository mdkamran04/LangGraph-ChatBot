import { useEffect, useState } from "react";

export type Session = {
  id: string;
  updatedAt: number;
};

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  async function loadSessions() {
    const res = await fetch("http://localhost:3000/sessions");
    const data = await res.json();
    setSessions(data);

    if (!activeSessionId && data.length > 0) {
      setActiveSessionId(data[0].id);
    }
  }

  function createNewSession() {
    const id = crypto.randomUUID();
    setActiveSessionId(id);
    setSessions((prev) => [{ id, updatedAt: Date.now() / 1000 }, ...prev]);
  }

  useEffect(() => {
    loadSessions();
  }, []);

  return {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createNewSession,
  };
}
