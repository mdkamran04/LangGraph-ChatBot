import { AIMessage } from "@langchain/core/messages";
import { Groq } from "groq-sdk";
import type { ChatStateType } from "../state/chat.state";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function llmStreamNode(
  state: ChatStateType,
  onToken?: (token: string) => void
) {
  const stream = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: state.messages.map((m) => {
      const type = m._getType();
      const role =
        type === "ai" ? "assistant" :
        type === "human" ? "user" :
        "system";

      return {
        role,
        content: m.content as string
      };
    }),
    temperature: 0.7,
    stream: true
  });

  let fullText = "";

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content ?? "";
    fullText += token;
    onToken?.(token);
  }

  if (!fullText) {
    throw new Error("No content received from streaming LLM");
  }

  return {
    messages: [
      ...state.messages,
      new AIMessage(fullText)
    ]
  };
}
