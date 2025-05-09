import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
});

// Inventory item model
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  quantity: decimal("quantity").notNull(),
  unit: text("unit").notNull(),
  threshold: decimal("threshold").notNull(),
  costPerUnit: decimal("cost_per_unit").notNull(),
  expirationDate: timestamp("expiration_date"),
  notes: text("notes"),
  supplier: text("supplier"),
  imageUrl: text("image_url"), // URL to image of the inventory item
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).pick({
  name: true,
  category: true,
  quantity: true,
  unit: true,
  threshold: true,
  costPerUnit: true,
  expirationDate: true,
  notes: true,
  supplier: true,
  imageUrl: true,
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
  capacity: decimal("capacity"),
  unitOfMeasure: text("unit_of_measure"),
  acquisitionDate: timestamp("acquisition_date"),
  lastMaintenanceDate: timestamp("last_maintenance_date"),
  maintenanceInterval: integer("maintenance_interval"),
  status: text("status").notNull(),
  notes: text("notes"),
});

export const insertEquipmentSchema = createInsertSchema(equipment).pick({
  name: true,
  type: true,
  capacity: true,
  unitOfMeasure: true,
  acquisitionDate: true,
  lastMaintenanceDate: true,
  maintenanceInterval: true,
  status: true,
  notes: true,
});

// Recipe model
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  batchSize: decimal("batch_size").notNull(),
  unitOfMeasure: text("unit_of_measure").notNull(),
  originalGravity: decimal("original_gravity").notNull(),
  finalGravity: decimal("final_gravity").notNull(),
  abv: decimal("abv").notNull(),
  ibu: integer("ibu").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  ingredients: json("ingredients").notNull(),
  imageUrl: text("image_url"), // URL to recipe image or beauty shot
  lastBrewed: timestamp("last_brewed"),
  notes: text("notes"),
});

export const insertRecipeSchema = createInsertSchema(recipes).pick({
  name: true,
  type: true,
  batchSize: true,
  unitOfMeasure: true,
  originalGravity: true,
  finalGravity: true,
  abv: true,
  ibu: true,
  description: true,
  instructions: true,
  ingredients: true,
  imageUrl: true,
  lastBrewed: true,
  notes: true,
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

// Ingredient price history model
export const ingredientPriceHistory = pgTable("ingredient_price_history", {
  id: serial("id").primaryKey(),
  ingredientId: integer("ingredient_id").notNull().references(() => inventoryItems.id),
  date: timestamp("date").notNull(),
  price: decimal("price").notNull(),
  supplier: text("supplier"),
  notes: text("notes"),
});

export const insertIngredientPriceHistorySchema = createInsertSchema(ingredientPriceHistory).pick({
  ingredientId: true,
  date: true,
  price: true,
  supplier: true,
  notes: true,
});

export type BrewingSchedule = typeof brewingSchedules.$inferSelect;
export type InsertBrewingSchedule = z.infer<typeof insertBrewingScheduleSchema>;
export type IngredientPriceHistory = typeof ingredientPriceHistory.$inferSelect;
export type InsertIngredientPriceHistory = z.infer<typeof insertIngredientPriceHistorySchema>;
