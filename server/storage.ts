import {
  type Principle, type InsertPrinciple,
  type Tactic, type InsertTactic,
  type PrincipleWithTactics,
  principles, tactics
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  getPrinciples(): Promise<PrincipleWithTactics[]>;
  getPrinciple(id: string): Promise<PrincipleWithTactics | undefined>;
  createPrinciple(principle: InsertPrinciple): Promise<Principle>;
  deletePrinciple(id: string): Promise<void>;
  createTactic(tactic: InsertTactic): Promise<Tactic>;
  deleteTactic(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getPrinciples(): Promise<PrincipleWithTactics[]> {
    const allPrinciples = await db.select().from(principles).orderBy(principles.order);
    const allTactics = await db.select().from(tactics).orderBy(tactics.order);
    return allPrinciples.map(p => ({
      ...p,
      tactics: allTactics.filter(t => t.principleId === p.id)
    }));
  }

  async getPrinciple(id: string): Promise<PrincipleWithTactics | undefined> {
    const [principle] = await db.select().from(principles).where(eq(principles.id, id));
    if (!principle) return undefined;
    const principleTactics = await db.select().from(tactics).where(eq(tactics.principleId, id)).orderBy(tactics.order);
    return { ...principle, tactics: principleTactics };
  }

  async createPrinciple(principle: InsertPrinciple): Promise<Principle> {
    const [created] = await db.insert(principles).values(principle).returning();
    return created;
  }

  async deletePrinciple(id: string): Promise<void> {
    await db.delete(tactics).where(eq(tactics.principleId, id));
    await db.delete(principles).where(eq(principles.id, id));
  }

  async createTactic(tactic: InsertTactic): Promise<Tactic> {
    const [created] = await db.insert(tactics).values(tactic).returning();
    return created;
  }

  async deleteTactic(id: string): Promise<void> {
    await db.delete(tactics).where(eq(tactics.id, id));
  }
}

export const storage = new DatabaseStorage();
