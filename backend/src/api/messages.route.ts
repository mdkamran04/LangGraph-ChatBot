import { getMessagesBySession } from "../db/queries";

export async function handleGetMessages(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");

  if (!sessionId) {
    return new Response(
      JSON.stringify({ error: "sessionId is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const messages = await getMessagesBySession(sessionId, 100);

  return new Response(JSON.stringify(messages.reverse()), {
    headers: { "Content-Type": "application/json" },
  });
}
