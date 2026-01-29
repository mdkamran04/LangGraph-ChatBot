# LangMiwi Chat App

A full-stack AI chat application built with LangGraph, Bun, React, and Supabase
. The project demonstrates how to design and ship a production-style conversational AI system with streaming responses, persistent memory, and a clean, scalable frontend architecture.

## Overview

This application provides a ChatGPT-style interface backed by a LangGraph agent. It supports real-time streaming responses, multiple chat sessions, persistent conversation history, and a polished sidebar UI for managing chats. The focus of the project is correctness, architecture, and real-world system design rather than a minimal demo.

## Features

* **Streaming Responses:** Real-time token streaming from the LLM to the frontend using LangChain streams and Server-Sent Events (SSE) logic.
* **Session Management:** Create, switch between, and delete distinct chat sessions.
* **Persistent Memory:** All conversations are stored in a local Supabase
 database, allowing context retention across page reloads.
* **LangGraph Orchestration:** Uses stateful graph architecture to manage conversation flow and LLM interactions.
* **High-Performance Backend:** Built on Bun for fast runtime execution and rapid package management.
* **Type-Safe Database:** Utilizes Drizzle ORM for type-safe SQL interactions and schema management.

## Tech Stack

### Frontend

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **State Management:** React Hooks
* **HTTP Client:** Native Fetch API with ReadableStream support

### Backend

* **Runtime:** Bun
* **AI Orchestration:** LangGraph / LangChain
* **LLM Provider:** Groq (via LangChain integration)
* **Database:** Supabase

* **ORM:** Drizzle ORM

## Architecture

The system is split into a React frontend and a Bun backend. The backend exposes a REST API and uses LangGraph to orchestrate LLM calls.

```text
Frontend (React)
  |
  |  POST /chat (initiate)
  |  POST /chat/stream (consume stream)
  |  GET  /sessions
  |  GET  /messages
  |  DELETE /sessions
  |
Backend (Bun)
  |
  |-- LangGraph StateGraph
  |     |-- LLM Node (streaming / non-streaming)
  |
  |-- Supabase
 (Drizzle ORM)
  |     |-- sessions
  |     |-- messages
  |
  |-- REST API Layer

```

## Project Structure

### Backend

```text
backend/
├─ src/
│  ├─ api/
│  │  ├─ chat.route.ts          # Handles non-streaming chat requests
│  │  ├─ chat.stream.route.ts   # Handles streaming responses
│  │  ├─ sessions.route.ts      # CRUD for chat sessions
│  │  ├─ messages.route.ts      # Retrieval of message history
│  │  └─ delete-session.route.ts
│  │
│  ├─ db/
│  │  ├─ client.ts              # Supabase
 connection setup
│  │  ├─ schema.ts              # Drizzle table definitions
│  │  └─ queries.ts             # DB helper functions
│  │
│  ├─ graph/
│  │  └─ index.ts               # LangGraph graph definition & compilation
│  │
│  ├─ nodes/
│  │  └─ llm.stream.node.ts     # The processing node for the LLM
│  │
│  ├─ state/
│  │  └─ chat.state.ts          # Definition of the graph state (channels)
│  │
│  └─ server.ts                 # Entry point and server configuration
│
├─ drizzle/                     # Migration files
├─ drizzle.config.ts            # ORM config
└─ package.json

```

### Frontend

```text
frontend/
├─ src/
│  ├─ components/
│  │  ├─ Sidebar.tsx            # Session navigation
│  │  ├─ ChatLayout.tsx         # Main layout wrapper
│  │  ├─ MessageList.tsx        # Scrollable message container
│  │  ├─ MessageBubble.tsx      # Individual message rendering
│  │  └─ ChatInput.tsx          # Text area and submission logic
│  │
│  ├─ hooks/
│  │  ├─ useChat.ts             # Custom hook for chat logic & streaming
│  │  └─ useSessions.ts         # Custom hook for session management
│  │
│  ├─ types/
│  │  └─ chat.ts                # TypeScript interfaces
│  │
│  └─ App.tsx
│
├─ index.html
└─ main.tsx

```

## Chat Flow

1. **Initialization:** The user creates a new session or selects an existing one via `Sidebar`.
2. **Input:** User types a message. The frontend optimistically updates the UI and sends a request to the backend.
3. **State Loading:** The backend retrieves the conversation history from Supabase
 for the active `sessionId`.
4. **Graph Execution:**
* The `StateGraph` is initialized with the retrieved history.
* The user's new message is injected into the state.
* The graph transitions to the `model` node.


5. **Streaming:** The LLM generates tokens. The backend streams these tokens immediately to the frontend via a `ReadableStream` response.
6. **Persistence:** Once the generation is complete, the new user message and the full AI response are committed to the Supabase
 database via Drizzle.

## Memory Strategy

This application implements **Long-term Persistence** using a relational database.

* **Database Record:** Every interaction is stored in the `messages` table, keyed by `sessionId`.
* **Context Injection:** When the LangGraph agent runs, it does not rely on in-memory arrays that vanish on server restart. Instead, the backend fetches the last  messages from the database and hydrates the `messages` channel in the LangGraph state.
* **Scalability:** This approach allows the application to handle multiple concurrent users and sessions without memory leaks associated with keeping state objects in RAM.

## Getting Started

### Prerequisites

* [Bun](https://bun.sh/) (v1.0 or later)
* Node.js (optional, for frontend tooling compatibility)
* A valid Groq API Key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend

```


2. Install dependencies:
```bash
bun install

```


3. Create a `.env` file in the root of `backend`:
```env
GROQ_API_KEY=your_api_key_here
DATABASE_URL=file:local.db

```


4. Generate and push database migrations:
```bash
bun drizzle-kit generate
bun drizzle-kit push

```


5. Start the server:
```bash
bun src/server.ts

```


*The backend runs at `http://localhost:3000*`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend

```


2. Install dependencies:
```bash
npm install

```


3. Start the development server:
```bash
npm run dev

```


*The frontend runs at `http://localhost:5173*`

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/chat/stream` | Sends a message and receives a streamed response. Requires `sessionId` and `message` in body. |
| `GET` | `/api/sessions` | Retrieves a list of all chat sessions for the sidebar. |
| `POST` | `/api/sessions` | Creates a new chat session. |
| `DELETE` | `/api/sessions/:id` | Deletes a specific session and its associated messages. |
| `GET` | `/api/messages/:id` | Retrieves full chat history for a specific session ID. |

## Engineering Notes

* **Why Bun?** Bun was chosen for its rapid startup time and native support for TypeScript, reducing the need for complex build steps on the backend.
* **LangGraph over standard Chains:** LangGraph provides cyclic graph capabilities, which allows for more complex agentic behaviors (like retry loops or tool calling) to be added in the future without rewriting the core logic.
* **Drizzle ORM:** Chosen for its lightweight footprint and SQL-like syntax, ensuring that database queries remain performant and explicit.

## Future Improvements

* **Tool Usage:** Integrate search or calculator tools into the LangGraph nodes.
* **RAG Integration:** Add a vector database (e.g., pgvector or Chroma) to support document Q&A.
* **Authentication:** Implement user authentication to secure sessions per user.
* **Model Selection:** Allow users to switch between Llama3, Mixtral, and Gemma via the UI.

## License

MIT License