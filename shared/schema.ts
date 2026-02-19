import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const principles = pgTable("principles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("general"),
  color: text("color").notNull().default("blue"),
  order: integer("order").notNull().default(0),
});

export const tactics = pgTable("tactics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  principleId: varchar("principle_id").notNull().references(() => principles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  isEffective: boolean("is_effective").notNull().default(true),
  order: integer("order").notNull().default(0),
});

export const insertPrincipleSchema = createInsertSchema(principles).omit({ id: true });
export const insertTacticSchema = createInsertSchema(tactics).omit({ id: true });

export type InsertPrinciple = z.infer<typeof insertPrincipleSchema>;
export type Principle = typeof principles.$inferSelect;
export type InsertTactic = z.infer<typeof insertTacticSchema>;
export type Tactic = typeof tactics.$inferSelect;

export type PrincipleWithTactics = Principle & { tactics: Tactic[] };
