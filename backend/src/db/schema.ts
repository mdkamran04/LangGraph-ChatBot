import {
  pgTable,
  text,
  timestamp,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/* ========== Sessions (Threads) ========== */
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(), // sessionId / threadId
  title: text("title"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});

/* ========== Messages ========== */
export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),

    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id, {
        onDelete: "cascade",
      }),

    role: text("role").notNull(), // user | ai | system
    content: text("content").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    roleCheck: check(
      "role_check",
      sql`${table.role} in ('user', 'ai', 'system')`
    ),
  })
);
