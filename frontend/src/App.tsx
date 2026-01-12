import { ChatLayout } from "./components/ChatLayout";
import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";
import { useChat } from "./hooks/useChat";

export default function App() {
  const {
    messages,
    input,
    setInput,
    loading,
    sendMessage,
    bottomRef
  } = useChat();

  return (
    <ChatLayout>
      <MessageList
        messages={messages}
        loading={loading}
        bottomRef={bottomRef as React.RefObject<HTMLDivElement>}
      />
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={sendMessage}
      />
    </ChatLayout>
  );
}
