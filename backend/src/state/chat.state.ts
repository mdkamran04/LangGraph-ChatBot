import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const ChatState = Annotation.Root({
  messages: MessagesAnnotation.spec.messages,
  next: Annotation<string>()
});

export type ChatStateType = typeof ChatState.State;
