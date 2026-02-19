import express from "express";
import type { IncomingMessage, ServerResponse } from "http";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

const principlesTable = pgTable("principles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("general"),
  color: text("color").notNull().default("blue"),
  order: integer("order").notNull().default(0),
});

const tacticsTable = pgTable("tactics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  principleId: varchar("principle_id").notNull().references(() => principlesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  isEffective: boolean("is_effective").notNull().default(true),
  order: integer("order").notNull().default(0),
});

const insertPrincipleSchema = createInsertSchema(principlesTable).omit({ id: true });
const insertTacticSchema = createInsertSchema(tacticsTable).omit({ id: true });

const dbUrl = process.env.DATABASE_URL || "";
const needsSsl = dbUrl.includes("neon.tech") || dbUrl.includes("supabase") || process.env.VERCEL === "1";

const pool = new pg.Pool({
  connectionString: dbUrl,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
});

const db = drizzle(pool, { schema: { principles: principlesTable, tactics: tacticsTable } });

let initialized = false;

async function initIfNeeded() {
  if (initialized) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS principles (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'general',
        color TEXT NOT NULL DEFAULT 'blue',
        "order" INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS tactics (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        principle_id VARCHAR NOT NULL REFERENCES principles(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        is_effective BOOLEAN NOT NULL DEFAULT true,
        "order" INTEGER NOT NULL DEFAULT 0
      );
    `);

    const existing = await db.select().from(principlesTable);
    if (existing.length > 0) {
      initialized = true;
      return;
    }

    const seedPrinciples = [
      { title: "People buy when perceived value exceeds cost", description: "To sell more, you need to increase perceived value or reduce the cost they pay (in time, money, & effort). This is the fundamental law of every transaction.", category: "Sales", color: "orange", order: 0 },
      { title: "Humans are naturally drawn to stories", description: "Stories bypass the logical brain and speak directly to emotions. People remember stories 22x more than facts alone. Use narrative structure to persuade.", category: "Communication", color: "blue", order: 1 },
      { title: "People love to look at things", description: "The eyes love to figure stuff out. More of the brain is dedicated to processing vision than any other function. Visual content always outperforms text-only.", category: "Marketing", color: "green", order: 2 },
      { title: "People naturally focus on faces", description: "Humans are hardwired to notice and process faces before anything else. This evolutionary trait can be leveraged in thumbnails, ads, and content.", category: "Psychology", color: "purple", order: 3 },
      { title: "People feel compelled to return what they receive", description: "The reciprocity principle: when someone gives us something, we feel an obligation to give back. Free value creates a psychological debt.", category: "Psychology", color: "teal", order: 4 },
    ];

    const createdPrinciples = await db.insert(principlesTable).values(seedPrinciples).returning();

    const seedTactics = [
      { principleId: createdPrinciples[0].id, title: "Create an Instagram 'Story Highlights' reel of testimonials/client wins", description: "Social proof increases perceived value by showing real results others have achieved.", isEffective: true, order: 0 },
      { principleId: createdPrinciples[0].id, title: "List all benefits and their 'estimated value' in your sales pitch", description: "Stack the value so the total far exceeds the price point.", isEffective: true, order: 1 },
      { principleId: createdPrinciples[0].id, title: "Drop the price by $500 for a promotion", description: "Reducing cost is one side of the value equation. Use sparingly.", isEffective: true, order: 2 },
      { principleId: createdPrinciples[1].id, title: "Tell your origin story of struggle to success", description: "Personal transformation stories create emotional connection and relatability.", isEffective: true, order: 0 },
      { principleId: createdPrinciples[1].id, title: "Show 'before and after' as a teaser for thumbnails", description: "Transformation arcs are the most compelling story structure.", isEffective: true, order: 1 },
      { principleId: createdPrinciples[1].id, title: "Use a story as a way to teach a lesson", description: "Parables and case studies make abstract concepts concrete and memorable.", isEffective: true, order: 2 },
      { principleId: createdPrinciples[2].id, title: "Have moving visuals every 5 seconds in VSL videos", description: "Constant visual stimulation keeps attention and prevents drop-off.", isEffective: true, order: 0 },
      { principleId: createdPrinciples[2].id, title: "Use pictures on Miro instead of just text documents", description: "Visual presentations are processed 60,000x faster than text.", isEffective: true, order: 1 },
      { principleId: createdPrinciples[2].id, title: "Send a loom video for outreach instead of just text", description: "Video outreach stands out and leverages the visual processing preference.", isEffective: true, order: 2 },
      { principleId: createdPrinciples[3].id, title: "Use faces in your YouTube thumbnails", description: "YouTube currently requires thumbnails. Faces draw instant attention in a feed.", isEffective: true, order: 0 },
      { principleId: createdPrinciples[3].id, title: "Include team headshots on your landing page", description: "Faces build trust and humanize your brand.", isEffective: true, order: 1 },
      { principleId: createdPrinciples[4].id, title: "Send loom videos positioned as free value in cold emails", description: "Providing free, personalized value triggers reciprocity and starts conversations.", isEffective: true, order: 0 },
      { principleId: createdPrinciples[4].id, title: "Send personalized AND automated voice notes using AI", description: "Personal touches create stronger reciprocity than generic outreach.", isEffective: true, order: 1 },
    ];

    await db.insert(tacticsTable).values(seedTactics);
    initialized = true;
    console.log("Database seeded");
  } catch (e) {
    console.error("Init error:", e);
  }
}

const app = express();
app.use(express.json());

app.use(async (_req, _res, next) => {
  await initIfNeeded();
  next();
});

app.get("/api/principles", async (_req, res) => {
  try {
    const allPrinciples = await db.select().from(principlesTable).orderBy(principlesTable.order);
    const allTactics = await db.select().from(tacticsTable).orderBy(tacticsTable.order);
    const result = allPrinciples.map(p => ({
      ...p,
      tactics: allTactics.filter(t => t.principleId === p.id)
    }));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch principles" });
  }
});

app.get("/api/principles/:id", async (req, res) => {
  try {
    const [principle] = await db.select().from(principlesTable).where(eq(principlesTable.id, req.params.id));
    if (!principle) return res.status(404).json({ message: "Principle not found" });
    const principleTactics = await db.select().from(tacticsTable).where(eq(tacticsTable.principleId, req.params.id)).orderBy(tacticsTable.order);
    res.json({ ...principle, tactics: principleTactics });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch principle" });
  }
});

app.post("/api/principles", async (req, res) => {
  try {
    const parsed = insertPrincipleSchema.parse(req.body);
    const [created] = await db.insert(principlesTable).values(parsed).returning();
    res.status(201).json(created);
  } catch (error: any) {
    if (error.name === "ZodError") return res.status(400).json({ message: "Invalid data", errors: error.errors });
    res.status(500).json({ message: "Failed to create principle" });
  }
});

app.delete("/api/principles/:id", async (req, res) => {
  try {
    await db.delete(tacticsTable).where(eq(tacticsTable.principleId, req.params.id));
    await db.delete(principlesTable).where(eq(principlesTable.id, req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete principle" });
  }
});

app.post("/api/tactics", async (req, res) => {
  try {
    const parsed = insertTacticSchema.parse(req.body);
    const [created] = await db.insert(tacticsTable).values(parsed).returning();
    res.status(201).json(created);
  } catch (error: any) {
    if (error.name === "ZodError") return res.status(400).json({ message: "Invalid data", errors: error.errors });
    res.status(500).json({ message: "Failed to create tactic" });
  }
});

app.delete("/api/tactics/:id", async (req, res) => {
  try {
    await db.delete(tacticsTable).where(eq(tacticsTable.id, req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete tactic" });
  }
});

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req as any, res as any);
}
