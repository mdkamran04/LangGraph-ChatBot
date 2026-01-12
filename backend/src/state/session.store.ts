import type { ChatStateType } from "./chat.state";

const sessions = new Map<string, ChatStateType>();

export function getSession(sessionId: string): ChatStateType | undefined {
  return sessions.get(sessionId);
}

export function saveSession(sessionId: string, state: ChatStateType) {
  sessions.set(sessionId, state);
}
