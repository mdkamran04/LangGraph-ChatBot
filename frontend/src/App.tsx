import { useSessions } from "./hooks/useSessions";
import { useChat } from "./hooks/useChat";

import { Sidebar } from "./components/Sidebar";
import { ChatLayout } from "./components/ChatLayout";
import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";


export default function App() {
  const { sessions, activeSessionId, setActiveSessionId, createNewSession, deleteSession } =
    useSessions();

  const { messages, input, setInput, loading, sendMessage, bottomRef } =
    useChat(activeSessionId ?? "");


  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelect={setActiveSessionId}
        onNew={createNewSession}
        onDelete={deleteSession}
      />

      <ChatLayout>
        <MessageList
          messages={messages}
          loading={loading}
          bottomRef={bottomRef as React.RefObject<HTMLDivElement>}
        />

        <ChatInput value={input} onChange={setInput} onSend={sendMessage} />
      </ChatLayout>
    </div>
  );
}
