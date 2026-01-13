import { AIMessage } from "@langchain/core/messages";
import { Groq } from "groq-sdk";
import type { ChatStateType } from "../state/chat.state";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function llmNode(state: ChatStateType) {
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: state.messages.map((m) => {
      const type = m._getType();
      const role = type === "ai" ? "assistant" : type === "human" ? "user" : "system";
      return {
        role: role as "user" | "assistant" | "system",
        content: m.content as string
      };
    }),
    temperature: 0.5
  });

  const content = completion.choices[0]?.message.content;
  
  if (!content) {
    throw new Error("No content received from LLM");
  }

  return {
    messages: [
      ...state.messages,
      new AIMessage(content)
    ]
  };
}
