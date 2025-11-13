import { items, ratings, type Item, type InsertItem, type InsertRating, type ItemWithRatings } from "@shared/schema";
import { db } from "./db";
import { eq, or, like, desc, sql } from "drizzle-orm";

export interface IStorage {
  getAllItems(): Promise<ItemWithRatings[]>;
  getItemById(id: number): Promise<Item | undefined>;
  getItemWithRatings(id: number): Promise<ItemWithRatings | undefined>;
  searchItems(query: string): Promise<ItemWithRatings[]>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: number, item: InsertItem): Promise<Item | undefined>;
  deleteItem(id: number): Promise<void>;
  addRating(rating: InsertRating): Promise<void>;
  getItemRatings(itemId: number): Promise<number[]>;
}

export class DatabaseStorage implements IStorage {
  async getAllItems(): Promise<ItemWithRatings[]> {
    const result = await db
      .select({
        id: items.id,
        titulo: items.titulo,
        autor: items.autor,
        ano: items.ano,
        genero: items.genero,
        detalhes: items.detalhes,
        createdAt: items.createdAt,
        averageRating: sql<number>`COALESCE(AVG(${ratings.rating}), 0)`.as('average_rating'),
        ratingsCount: sql<number>`COUNT(${ratings.id})`.as('ratings_count'),
      })
      .from(items)
      .leftJoin(ratings, eq(items.id, ratings.itemId))
      .groupBy(items.id)
      .orderBy(desc(items.createdAt));

    return result.map(row => ({
      ...row,
      averageRating: Number(row.averageRating) || 0,
      ratingsCount: Number(row.ratingsCount) || 0,
    }));
  }

  async getItemById(id: number): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item || undefined;
  }

  async getItemWithRatings(id: number): Promise<ItemWithRatings | undefined> {
    const result = await db
      .select({
        id: items.id,
        titulo: items.titulo,
        autor: items.autor,
        ano: items.ano,
        genero: items.genero,
        detalhes: items.detalhes,
        createdAt: items.createdAt,
        averageRating: sql<number>`COALESCE(AVG(${ratings.rating}), 0)`.as('average_rating'),
        ratingsCount: sql<number>`COUNT(${ratings.id})`.as('ratings_count'),
      })
      .from(items)
      .leftJoin(ratings, eq(items.id, ratings.itemId))
      .where(eq(items.id, id))
      .groupBy(items.id);

    if (result.length === 0) return undefined;

    const row = result[0];
    return {
      ...row,
      averageRating: Number(row.averageRating) || 0,
      ratingsCount: Number(row.ratingsCount) || 0,
    };
  }

  async searchItems(query: string): Promise<ItemWithRatings[]> {
    const searchPattern = `%${query.toLowerCase()}%`;
    
    const result = await db
      .select({
        id: items.id,
        titulo: items.titulo,
        autor: items.autor,
        ano: items.ano,
        genero: items.genero,
        detalhes: items.detalhes,
        createdAt: items.createdAt,
        averageRating: sql<number>`COALESCE(AVG(${ratings.rating}), 0)`.as('average_rating'),
        ratingsCount: sql<number>`COUNT(${ratings.id})`.as('ratings_count'),
      })
      .from(items)
      .leftJoin(ratings, eq(items.id, ratings.itemId))
      .where(
        or(
          sql`LOWER(${items.titulo}) LIKE ${searchPattern}`,
          sql`LOWER(${items.autor}) LIKE ${searchPattern}`
        )
      )
      .groupBy(items.id)
      .orderBy(desc(items.createdAt));

    return result.map(row => ({
      ...row,
      averageRating: Number(row.averageRating) || 0,
      ratingsCount: Number(row.ratingsCount) || 0,
    }));
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const [item] = await db
      .insert(items)
      .values(insertItem)
      .returning();
    return item;
  }

  async updateItem(id: number, insertItem: InsertItem): Promise<Item | undefined> {
    const [item] = await db
      .update(items)
      .set(insertItem)
      .where(eq(items.id, id))
      .returning();
    return item || undefined;
  }

  async deleteItem(id: number): Promise<void> {
    await db.delete(items).where(eq(items.id, id));
  }

  async addRating(rating: InsertRating): Promise<void> {
    await db.insert(ratings).values(rating);
  }

  async getItemRatings(itemId: number): Promise<number[]> {
    const result = await db
      .select({ rating: ratings.rating })
      .from(ratings)
      .where(eq(ratings.itemId, itemId));
    
    return result.map(r => r.rating);
  }
}

export const storage = new DatabaseStorage();
