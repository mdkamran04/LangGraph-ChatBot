import { chatGraph } from "../graph";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import {
  upsertSession,
  insertMessage,
  getMessagesBySession,
} from "../db/queries";

type ChatRequestBody = {
  message: string;
  sessionId?: string;
};

export async function handleChat(req: Request) {
  const body = (await req.json()) as ChatRequestBody;
  const { message, sessionId } = body;

  const id = sessionId ?? "default";

  // keep exit handling exactly as-is
  if (
    message.toLowerCase().includes("bye") ||
    message.toLowerCase().includes("exit")
  ) {
    return new Response(
      JSON.stringify({
        reply:
          "Goodbye! Feel free to reach out anytime you have more questions. Take care!",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // 1️⃣ ensure session exists
  await upsertSession(id);

  // 2️⃣ save user message
  await insertMessage({
    id: crypto.randomUUID(),
    sessionId: id,
    role: "user",
    content: message,
  });

  // 3️⃣ load previous conversation from DB
  const history = await getMessagesBySession(id, 20);

  const langchainMessages = history
    .reverse()
    .map((m) =>
      m.role === "user"
        ? new HumanMessage(m.content)
        : new AIMessage(m.content)
    );

  // 4️⃣ run LangGraph
  const result = await chatGraph.invoke({
    messages: langchainMessages,
  });

  const aiContent = result.messages.at(-1)?.content as string;

  // 5️⃣ save AI response
  await insertMessage({
    id: crypto.randomUUID(),
    sessionId: id,
    role: "ai",
    content: aiContent,
  });

  return new Response(
    JSON.stringify({
      reply: aiContent,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
