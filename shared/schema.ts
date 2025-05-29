import { pgTable, text, serial, integer, boolean, timestamp, decimal, json, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Brewery accounts table
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

// Users table with brewery association
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

// Add inventory brewery relationship
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

// Update other tables to include brewery relationship
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

export const insertUserSchema = createInsertSchema(users);
export const insertBrewerySchema = createInsertSchema(breweries);

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Brewery = typeof breweries.$inferSelect;
export type InsertBrewery = z.infer<typeof insertBrewerySchema>;

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
  imageUrl: text("image_url"), // URL to image of the inventory item
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
  status: text("status").notNull(),
  maintenanceStatus: text("maintenance_status"),
  currentBatch: text("current_batch"),
  timeRemaining: text("time_remaining"),
  utilization: integer("utilization"),
});

export const insertEquipmentSchema = createInsertSchema(equipment).pick({
  name: true,
  type: true,
  status: true,
  maintenanceStatus: true,
  currentBatch: true,
  timeRemaining: true,
  utilization: true,
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
  instructions: json("instructions").notNull(),
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
