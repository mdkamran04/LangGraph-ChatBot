import { handleChat } from "./api/chat.route";
import { handleChatStream } from "./api/chat.stream.route";

Bun.serve({
  port: 3000,

  fetch: async (req) => {
    const url = new URL(req.url);

    // 🔹 CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    // 🔹 Normal chat
    if (req.method === "POST" && url.pathname === "/chat") {
      const res = await handleChat(req);

      return new Response(res.body, {
        status: res.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 🔹 Streaming chat
    if (req.method === "POST" && url.pathname === "/chat/stream") {
      const res = await handleChatStream(req);

      return new Response(res.body, {
        status: res.status,
        headers: {
          ...Object.fromEntries(res.headers),
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 🔹 Fallback
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});

console.log("Backend running on http://localhost:3000");
