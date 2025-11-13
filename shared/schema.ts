import { sql } from "drizzle-orm";
import { pgTable, serial, text, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  titulo: text("titulo").notNull(),
  autor: text("autor").notNull(),
  ano: integer("ano").notNull(),
  genero: text("genero").notNull(),
  detalhes: text("detalhes").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull().references(() => items.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const itemsRelations = relations(items, ({ many }) => ({
  ratings: many(ratings),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  item: one(items, {
    fields: [ratings.itemId],
    references: [items.id],
  }),
}));

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
}).extend({
  titulo: z.string().min(1, "Título é obrigatório"),
  autor: z.string().min(1, "Autor/Diretor é obrigatório"),
  ano: z.number().min(1000, "Ano inválido").max(new Date().getFullYear() + 10, "Ano muito distante"),
  genero: z.string().min(1, "Gênero é obrigatório"),
  detalhes: z.string().default(""),
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  createdAt: true,
}).extend({
  itemId: z.number().int().positive(),
  rating: z.number().int().min(1, "Avaliação mínima é 1").max(5, "Avaliação máxima é 5"),
});

export type InsertItem = z.infer<typeof insertItemSchema>;
export type Item = typeof items.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = typeof ratings.$inferSelect;

export type ItemWithRatings = Item & {
  averageRating: number;
  ratingsCount: number;
};
