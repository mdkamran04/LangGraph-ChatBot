import { chatGraph } from "../graph";
import { HumanMessage } from "@langchain/core/messages";
import { llmStreamNode } from "../nodes/llm.stream.node";
import { ChatState } from "../state/chat.state";
import { StateGraph, START, END } from "@langchain/langgraph";

export async function handleChatStream(req: Request) {

    const body = await req.json() as { message: string };
    const { message } = body;

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const streamingGraph = new StateGraph(ChatState)
                .addNode("llm_stream", (state) =>
                    llmStreamNode(state, (token) => {
                        controller.enqueue(encoder.encode(token));
                    })
                )
                .addEdge(START, "llm_stream")
                .addEdge("llm_stream", END)
                .compile();

            await streamingGraph.invoke({
                messages: [new HumanMessage(message)]
            });

            controller.close();
        }
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Transfer-Encoding": "chunked"
        }
    });
}
