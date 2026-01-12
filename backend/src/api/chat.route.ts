import { chatGraph } from "../graph";
import { HumanMessage } from "@langchain/core/messages";
import { getSession, saveSession } from "../state/session.store";

type ChatRequestBody = {
  message: string;
  sessionId?: string;
};

export async function handleChat(req: Request) {
  const body = (await req.json()) as ChatRequestBody;
  const { message, sessionId } = body;

  const id = sessionId ?? "default";

  // keep your exit handling exactly as-is
  if (
    message.toLowerCase().includes("bye") ||
    message.toLowerCase().includes("exit")
  ) {
    return new Response(
      JSON.stringify({
        reply:
          "Goodbye! Feel free to reach out anytime you have more questions. Take care!"
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // load previous conversation (if any)
  const previousState = getSession(id);

  const result = await chatGraph.invoke({
    messages: previousState
      ? [...previousState.messages, new HumanMessage(message)]
      : [new HumanMessage(message)]
  });

  // save updated conversation
  saveSession(id, result);

  return new Response(
    JSON.stringify({
      reply: result.messages.at(-1)?.content
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
