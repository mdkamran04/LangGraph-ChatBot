import { db } from "./client";
import { sessions, messages } from "./schema";
import { eq, desc } from "drizzle-orm";

/* ---------- Sessions ---------- */

export async function upsertSession(
  sessionId: string,
  title?: string
) {
  await db
    .insert(sessions)
    .values({
      id: sessionId,
      title,
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .onConflictDoUpdate({
      target: sessions.id,
      set: {
        updatedAt: Math.floor(Date.now() / 1000),
      },
    });
}

/* ---------- Messages ---------- */

export async function insertMessage(params: {
  id: string;
  sessionId: string;
  role: "user" | "ai" | "system";
  content: string;
}) {
  await db.insert(messages).values({
    id: params.id,
    sessionId: params.sessionId,
    role: params.role,
    content: params.content,
  });
}

export async function getMessagesBySession(
  sessionId: string,
  limit = 20
) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.sessionId, sessionId))
    .orderBy(desc(messages.createdAt))
    .limit(limit);
}
