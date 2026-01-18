import { HumanMessage } from "@langchain/core/messages";
import { StateGraph, START, END } from "@langchain/langgraph";
import { ChatState } from "../state/chat.state";
import { llmStreamNode } from "../nodes/llm.stream.node";
import {
  upsertSession,
  insertMessage,
  getMessagesBySession,
} from "../db/queries";

export async function handleChatStream(req: Request) {
  const body = (await req.json()) as {
    message: string;
    sessionId: string;
  };

  const { message, sessionId } = body;
  const encoder = new TextEncoder();

  // 1️⃣ generate title ONLY from first message
  const title =
    message.length > 40 ? message.slice(0, 40) + "…" : message;

  // ensure session exists (title only applied on first insert)
  await upsertSession(sessionId, title);


  // 2️⃣ save user message
  await insertMessage({
    id: crypto.randomUUID(),
    sessionId,
    role: "user",
    content: message,
  });

  // 3️⃣ load history from DB
  const history = await getMessagesBySession(sessionId, 20);

  let fullAIResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const streamingGraph = new StateGraph(ChatState)
          .addNode("llm_stream", (state) =>
            llmStreamNode(state, (token: string) => {
              fullAIResponse += token;
              controller.enqueue(encoder.encode(token));
            })
          )
          .addEdge(START, "llm_stream")
          .addEdge("llm_stream", END)
          .compile();

        await streamingGraph.invoke({
          messages: [
            ...history.reverse().map((m) => new HumanMessage(m.content)),
            new HumanMessage(message),
          ],
        });

        // 4️⃣ save final AI message
        if (fullAIResponse.trim()) {
          await insertMessage({
            id: crypto.randomUUID(),
            sessionId,
            role: "ai",
            content: fullAIResponse,
          });
        }

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
