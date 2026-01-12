import type { ChatStateType } from "../state/chat.state";

export function routerNode(state: ChatStateType) {
  const lastMessage = state.messages[state.messages.length - 1];
  const text = (lastMessage?.content as string).toLowerCase();

  if (text.includes("bye") || text.includes("exit")) {
    return { next: "end" };
  }

  return { next: "llm" };
}
