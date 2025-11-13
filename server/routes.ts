import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertItemSchema, insertRatingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/items", async (req, res) => {
    try {
      const items = await storage.getAllItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  app.get("/api/items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid item ID" });
      }

      const item = await storage.getItemWithRatings(id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json(item);
    } catch (error) {
      console.error("Error fetching item:", error);
      res.status(500).json({ error: "Failed to fetch item" });
    }
  });

  app.get("/api/items/search/:query", async (req, res) => {
    try {
      const { query } = req.params;
      const items = await storage.searchItems(query);
      res.json(items);
    } catch (error) {
      console.error("Error searching items:", error);
      res.status(500).json({ error: "Failed to search items" });
    }
  });

  app.post("/api/items", async (req, res) => {
    try {
      const validatedData = insertItemSchema.parse(req.body);
      const item = await storage.createItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid item data", details: error.errors });
      }
      console.error("Error creating item:", error);
      res.status(500).json({ error: "Failed to create item" });
    }
  });

  app.patch("/api/items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid item ID" });
      }

      const validatedData = insertItemSchema.parse(req.body);
      const item = await storage.updateItem(id, validatedData);
      
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid item data", details: error.errors });
      }
      console.error("Error updating item:", error);
      res.status(500).json({ error: "Failed to update item" });
    }
  });

  app.delete("/api/items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid item ID" });
      }

      await storage.deleteItem(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  app.post("/api/ratings", async (req, res) => {
    try {
      const validatedData = insertRatingSchema.parse(req.body);
      await storage.addRating(validatedData);
      res.status(201).json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid rating data", details: error.errors });
      }
      console.error("Error adding rating:", error);
      res.status(500).json({ error: "Failed to add rating" });
    }
  });

  app.get("/api/items/:id/ratings", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid item ID" });
      }

      const ratingsData = await storage.getItemRatings(id);
      res.json(ratingsData);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.status(500).json({ error: "Failed to fetch ratings" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
