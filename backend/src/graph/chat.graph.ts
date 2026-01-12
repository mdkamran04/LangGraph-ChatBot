import { StateGraph, START, END } from "@langchain/langgraph";
import { ChatState } from "../state/chat.state";
import { llmNode } from "../nodes/llm.node";
import { routerNode } from "../nodes/router.node";

export const chatGraph = new StateGraph(ChatState)
  .addNode("router", routerNode)
  .addNode("llm", llmNode)
  .addEdge(START, "router")
  .addConditionalEdges(
    "router",
    (state) => state.next,
    {
      llm: "llm",
      end: END
    }
  )
  .addEdge("llm", END)
  .compile();
