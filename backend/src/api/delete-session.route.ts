import { db } from "../db/client";
import { sessions, messages } from "../db/schema";
import { eq } from "drizzle-orm";

export async function handleDeleteSession(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("sessionId");

  if (!sessionId) {
    return new Response("sessionId required", { status: 400 });
  }

  await db.delete(messages).where(eq(messages.sessionId, sessionId));
  await db.delete(sessions).where(eq(sessions.id, sessionId));

  return new Response(null, { status: 204 });
}
