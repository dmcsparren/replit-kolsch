import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  json,
  numeric
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Brewery accounts table with unique GUID
export const breweries = pgTable("breweries", {
  id: varchar("id").primaryKey().notNull(), // Unique GUID
  name: varchar("name").notNull(),
  type: varchar("type").notNull(),
  location: varchar("location").notNull(),
  foundedYear: integer("founded_year"),
  website: varchar("website"),
  phone: varchar("phone"),
  brewingCapacity: varchar("brewing_capacity"),
  specialties: varchar("specialties"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Users table with brewery association and required fields
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").notNull().unique(),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  breweryId: varchar("brewery_id").references(() => breweries.id),
  role: varchar("role").notNull().default("member"), // owner, admin, member
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inventory items with brewery relationship
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  breweryId: varchar("brewery_id").references(() => breweries.id),
  name: varchar("name").notNull(),
  quantity: integer("quantity").notNull(),
  unit: varchar("unit").notNull(),
  location: varchar("location"),
  expirationDate: timestamp("expiration_date"),
  cost: numeric("cost", { precision: 10, scale: 2 }),
  supplier: varchar("supplier"),
  barcode: varchar("barcode"),
  category: varchar("category"),
  notes: text("notes"),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ingredient sources with brewery relationship
export const ingredientSources = pgTable("ingredient_sources", {
  id: serial("id").primaryKey(),
  breweryId: varchar("brewery_id").references(() => breweries.id),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(),
  supplier: varchar("supplier").notNull(),
  location: varchar("location").notNull(),
  contact: varchar("contact"),
  rating: integer("rating"),
  notes: text("notes"),
  latitude: numeric("latitude", { precision: 10, scale: 8 }),
  longitude: numeric("longitude", { precision: 11, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Equipment with brewery relationship
export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  breweryId: varchar("brewery_id").references(() => breweries.id),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(),
  capacity: varchar("capacity"),
  status: varchar("status").notNull().default("available"),
  location: varchar("location"),
  purchaseDate: timestamp("purchase_date"),
  lastMaintenance: timestamp("last_maintenance"),
  nextMaintenance: timestamp("next_maintenance"),
  notes: text("notes"),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Recipes with brewery relationship
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  breweryId: varchar("brewery_id").references(() => breweries.id),
  name: varchar("name").notNull(),
  style: varchar("style").notNull(),
  batchSize: numeric("batch_size", { precision: 10, scale: 2 }).notNull(),
  targetAbv: numeric("target_abv", { precision: 4, scale: 2 }),
  targetIbu: integer("target_ibu"),
  ingredients: jsonb("ingredients").notNull(),
  instructions: text("instructions").notNull(),
  fermentationTemp: varchar("fermentation_temp"),
  fermentationTime: varchar("fermentation_time"),
  notes: text("notes"),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Brewing schedules with brewery relationship
export const brewingSchedules = pgTable("brewing_schedules", {
  id: serial("id").primaryKey(),
  breweryId: varchar("brewery_id").references(() => breweries.id),
  title: varchar("title").notNull(),
  description: text("description"),
  recipeId: integer("recipe_id").references(() => recipes.id),
  equipmentId: integer("equipment_id").references(() => equipment.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: varchar("status").notNull().default("scheduled"),
  batchSize: numeric("batch_size", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Price history with brewery relationship
export const ingredientPriceHistory = pgTable("ingredient_price_history", {
  id: serial("id").primaryKey(),
  breweryId: varchar("brewery_id").references(() => breweries.id),
  ingredientId: integer("ingredient_id").references(() => inventoryItems.id),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  supplier: varchar("supplier"),
  date: timestamp("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schema validation
export const insertUserSchema = createInsertSchema(users);
export const insertBrewerySchema = createInsertSchema(breweries);
export const insertInventoryItemSchema = createInsertSchema(inventoryItems).pick({
  name: true,
  quantity: true,
  unit: true,
  location: true,
  expirationDate: true,
  cost: true,
  supplier: true,
  barcode: true,
  category: true,
  notes: true,
  imageUrl: true,
});
export const insertIngredientSourceSchema = createInsertSchema(ingredientSources).pick({
  name: true,
  type: true,
  supplier: true,
  location: true,
  contact: true,
  rating: true,
  notes: true,
  latitude: true,
  longitude: true,
});
export const insertEquipmentSchema = createInsertSchema(equipment).pick({
  name: true,
  type: true,
  capacity: true,
  status: true,
  location: true,
  purchaseDate: true,
  lastMaintenance: true,
  nextMaintenance: true,
  notes: true,
  imageUrl: true,
});
export const insertRecipeSchema = createInsertSchema(recipes).pick({
  name: true,
  style: true,
  batchSize: true,
  targetAbv: true,
  targetIbu: true,
  ingredients: true,
  instructions: true,
  fermentationTemp: true,
  fermentationTime: true,
  notes: true,
  imageUrl: true,
});
export const insertBrewingScheduleSchema = createInsertSchema(brewingSchedules).pick({
  title: true,
  description: true,
  recipeId: true,
  equipmentId: true,
  startDate: true,
  endDate: true,
  status: true,
  batchSize: true,
  notes: true,
});
export const insertIngredientPriceHistorySchema = createInsertSchema(ingredientPriceHistory).pick({
  ingredientId: true,
  price: true,
  supplier: true,
  date: true,
  notes: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type Brewery = typeof breweries.$inferSelect;
export type InsertBrewery = z.infer<typeof insertBrewerySchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type IngredientSource = typeof ingredientSources.$inferSelect;
export type InsertIngredientSource = z.infer<typeof insertIngredientSourceSchema>;
export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type BrewingSchedule = typeof brewingSchedules.$inferSelect;
export type InsertBrewingSchedule = z.infer<typeof insertBrewingScheduleSchema>;
export type IngredientPriceHistory = typeof ingredientPriceHistory.$inferSelect;
export type InsertIngredientPriceHistory = z.infer<typeof insertIngredientPriceHistorySchema>;