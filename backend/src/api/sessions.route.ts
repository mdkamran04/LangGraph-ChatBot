import { db } from "../db/client";
import { sessions } from "../db/schema";
import { desc } from "drizzle-orm";

export async function handleGetSessions() {
  const rows = await db
    .select()
    .from(sessions)
    .orderBy(desc(sessions.updatedAt));

  return new Response(JSON.stringify(rows), {
    headers: { "Content-Type": "application/json" },
  });
}
