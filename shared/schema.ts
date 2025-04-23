import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
});

// Inventory item model
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  currentQuantity: decimal("current_quantity").notNull(),
  minimumQuantity: decimal("minimum_quantity").notNull(),
  unit: text("unit").notNull(),
  status: text("status").notNull(),
  forecast: text("forecast").notNull(),
  lastUpdated: timestamp("last_updated").notNull(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).pick({
  name: true,
  category: true,
  currentQuantity: true,
  minimumQuantity: true,
  unit: true,
  status: true,
  forecast: true,
  lastUpdated: true,
});

// Ingredient source model
export const ingredientSources = pgTable("ingredient_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  latitude: decimal("latitude").notNull(),
  longitude: decimal("longitude").notNull(),
  type: text("type").notNull(), // hop farm, malt house, etc.
  description: text("description"),
  website: text("website"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  image: text("image"), // URL to image
  suppliedIngredients: json("supplied_ingredients"), // Array of ingredients supplied
});

export const insertIngredientSourceSchema = createInsertSchema(ingredientSources).pick({
  name: true,
  address: true,
  city: true,
  country: true,
  latitude: true,
  longitude: true,
  type: true,
  description: true,
  website: true,
  contactEmail: true,
  contactPhone: true,
  image: true,
  suppliedIngredients: true,
});

// Equipment model
export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  currentBatch: text("current_batch"),
  utilization: integer("utilization"),
  maintenanceStatus: text("maintenance_status"),
  timeRemaining: text("time_remaining"),
});

export const insertEquipmentSchema = createInsertSchema(equipment).pick({
  name: true,
  type: true,
  status: true,
  currentBatch: true,
  utilization: true,
  maintenanceStatus: true,
  timeRemaining: true,
});

// Recipe model
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  abv: decimal("abv").notNull(),
  ibu: integer("ibu").notNull(),
  srm: decimal("srm").notNull(),
  ingredients: json("ingredients").notNull(),
  instructions: json("instructions").notNull(),
});

export const insertRecipeSchema = createInsertSchema(recipes).pick({
  name: true,
  type: true,
  description: true,
  abv: true,
  ibu: true,
  srm: true,
  ingredients: true,
  instructions: true,
});

// Brewing schedule model
export const brewingSchedules = pgTable("brewing_schedules", {
  id: serial("id").primaryKey(),
  recipeName: text("recipe_name").notNull(),
  batchNumber: text("batch_number").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull(),
  equipmentId: integer("equipment_id"),
});

export const insertBrewingScheduleSchema = createInsertSchema(brewingSchedules).pick({
  recipeName: true,
  batchNumber: true,
  startDate: true,
  endDate: true,
  status: true,
  equipmentId: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

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
