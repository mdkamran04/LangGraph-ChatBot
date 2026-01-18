import { handleChat } from "./api/chat.route";
import { handleChatStream } from "./api/chat.stream.route";
import { handleDeleteSession } from "./api/delete-session.route";
import { handleGetMessages } from "./api/messages.route";
import { handleGetSessions } from "./api/sessions.route";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};


Bun.serve({
  port: 3000,

  fetch: async (req) => {
    const url = new URL(req.url);

    // 🔹 Preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    let res: Response;

    if (req.method === "POST" && url.pathname === "/chat") {
      res = await handleChat(req);
    } else if (req.method === "POST" && url.pathname === "/chat/stream") {
      res = await handleChatStream(req);
    } else if (req.method === "GET" && url.pathname === "/sessions") {
      res = await handleGetSessions();
    } else if (req.method === "GET" && url.pathname === "/messages") {
      res = await handleGetMessages(req);
    }
    else if (req.method === "DELETE" && url.pathname === "/sessions") {
      res = await handleDeleteSession(req);
    }
    else {
      res = new Response("Not Found", { status: 404 });
    }

    // 🔹 Attach CORS headers to every response
    const headers = new Headers(res.headers);
    Object.entries(CORS_HEADERS).forEach(([k, v]) =>
      headers.set(k, v)
    );

    return new Response(res.body, {
      status: res.status,
      headers,
    });
  },
});

console.log("Backend running on http://localhost:3000");
