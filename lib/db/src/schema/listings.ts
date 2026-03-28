import { pgTable, text, integer, serial, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categoriesTable } from "./categories";
import { wilayasTable } from "./wilayas";

export const listingsTable = pgTable("listings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  categoryId: integer("category_id").notNull().references(() => categoriesTable.id),
  wilayaId: integer("wilaya_id").notNull().references(() => wilayasTable.id),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  website: text("website"),
  description: text("description").notNull(),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  priceRange: text("price_range").notNull().default("moderate"),
  coverImage: text("cover_image").notNull(),
  images: text("images").array().notNull().default([]),
  tags: text("tags").array().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  verified: boolean("verified").notNull().default(false),
  openingHours: text("opening_hours"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertListingSchema = createInsertSchema(listingsTable).omit({ id: true, createdAt: true, rating: true, reviewCount: true });
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listingsTable.$inferSelect;
