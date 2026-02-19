import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPrincipleSchema, insertTacticSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/principles", async (_req, res) => {
    try {
      const principles = await storage.getPrinciples();
      res.json(principles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch principles" });
    }
  });

  app.get("/api/principles/:id", async (req, res) => {
    try {
      const principle = await storage.getPrinciple(req.params.id);
      if (!principle) {
        return res.status(404).json({ message: "Principle not found" });
      }
      res.json(principle);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch principle" });
    }
  });

  app.post("/api/principles", async (req, res) => {
    try {
      const parsed = insertPrincipleSchema.parse(req.body);
      const principle = await storage.createPrinciple(parsed);
      res.status(201).json(principle);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create principle" });
    }
  });

  app.delete("/api/principles/:id", async (req, res) => {
    try {
      await storage.deletePrinciple(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete principle" });
    }
  });

  app.post("/api/tactics", async (req, res) => {
    try {
      const parsed = insertTacticSchema.parse(req.body);
      const tactic = await storage.createTactic(parsed);
      res.status(201).json(tactic);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tactic" });
    }
  });

  app.delete("/api/tactics/:id", async (req, res) => {
    try {
      await storage.deleteTactic(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tactic" });
    }
  });

  return httpServer;
}
