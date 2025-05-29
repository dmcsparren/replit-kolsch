import {
  users,
  breweries,
  inventoryItems,
  ingredientSources,
  equipment,
  recipes,
  brewingSchedules,
  ingredientPriceHistory,
  type User,
  type Brewery,
  type InventoryItem,
  type InsertInventoryItem,
  type IngredientSource,
  type InsertIngredientSource,
  type Equipment,
  type InsertEquipment,
  type Recipe,
  type InsertRecipe,
  type BrewingSchedule,
  type InsertBrewingSchedule,
  type IngredientPriceHistory,
  type InsertIngredientPriceHistory
} from "@shared/schema";
import { IStorage } from "./storage-interface";
import { db } from "./db";
import { eq } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with empty constructor - data initialization happens in routes
  }

  // User operations for authentication
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createUser(userData: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Brewery operations
  async createBrewery(breweryData: any): Promise<Brewery> {
    const [brewery] = await db
      .insert(breweries)
      .values(breweryData)
      .returning();
    return brewery;
  }

  async getBrewery(id: string): Promise<Brewery | undefined> {
    const [brewery] = await db.select().from(breweries).where(eq(breweries.id, id));
    return brewery;
  }

  async initializeBreweryData(breweryId: string): Promise<void> {
    // Initialize brewery account - data will be added by users through the interface
    console.log(`Brewery ${breweryId} initialized successfully`);
  }

  // Inventory operations filtered by brewery
  async getInventoryItems(): Promise<InventoryItem[]> {
    const items = await db.select().from(inventoryItems);
    return items;
  }

  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return item;
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const [newItem] = await db
      .insert(inventoryItems)
      .values(item)
      .returning();
    return newItem;
  }

  async updateInventoryItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem | undefined> {
    const [updatedItem] = await db
      .update(inventoryItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(inventoryItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    const result = await db.delete(inventoryItems).where(eq(inventoryItems.id, id));
    return result.rowCount > 0;
  }

  // Ingredient source operations
  async getAllIngredientSources(): Promise<IngredientSource[]> {
    const sources = await db.select().from(ingredientSources);
    return sources;
  }

  async getIngredientSource(id: number): Promise<IngredientSource | undefined> {
    const [source] = await db.select().from(ingredientSources).where(eq(ingredientSources.id, id));
    return source;
  }

  async createIngredientSource(source: InsertIngredientSource): Promise<IngredientSource> {
    const [newSource] = await db
      .insert(ingredientSources)
      .values(source)
      .returning();
    return newSource;
  }

  async updateIngredientSource(id: number, source: Partial<IngredientSource>): Promise<IngredientSource | undefined> {
    const [updatedSource] = await db
      .update(ingredientSources)
      .set({ ...source, updatedAt: new Date() })
      .where(eq(ingredientSources.id, id))
      .returning();
    return updatedSource;
  }

  async deleteIngredientSource(id: number): Promise<boolean> {
    const result = await db.delete(ingredientSources).where(eq(ingredientSources.id, id));
    return result.rowCount > 0;
  }

  // Equipment operations
  async getAllEquipment(): Promise<Equipment[]> {
    const equipmentList = await db.select().from(equipment);
    return equipmentList;
  }

  async getEquipment(id: number): Promise<Equipment | undefined> {
    const [equipmentItem] = await db.select().from(equipment).where(eq(equipment.id, id));
    return equipmentItem;
  }

  async createEquipment(equipmentItem: InsertEquipment): Promise<Equipment> {
    const [newEquipment] = await db
      .insert(equipment)
      .values(equipmentItem)
      .returning();
    return newEquipment;
  }

  async updateEquipment(id: number, equipmentItem: Partial<Equipment>): Promise<Equipment | undefined> {
    const [updatedEquipment] = await db
      .update(equipment)
      .set({ ...equipmentItem, updatedAt: new Date() })
      .where(eq(equipment.id, id))
      .returning();
    return updatedEquipment;
  }

  async deleteEquipment(id: number): Promise<boolean> {
    const result = await db.delete(equipment).where(eq(equipment.id, id));
    return result.rowCount > 0;
  }

  // Recipe operations
  async getAllRecipes(): Promise<Recipe[]> {
    const recipeList = await db.select().from(recipes);
    return recipeList;
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    return recipe;
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const [newRecipe] = await db
      .insert(recipes)
      .values(recipe)
      .returning();
    return newRecipe;
  }

  async updateRecipe(id: number, recipe: Partial<Recipe>): Promise<Recipe | undefined> {
    const [updatedRecipe] = await db
      .update(recipes)
      .set({ ...recipe, updatedAt: new Date() })
      .where(eq(recipes.id, id))
      .returning();
    return updatedRecipe;
  }

  async deleteRecipe(id: number): Promise<boolean> {
    const result = await db.delete(recipes).where(eq(recipes.id, id));
    return result.rowCount > 0;
  }

  // Brewing schedule operations
  async getAllBrewingSchedules(): Promise<BrewingSchedule[]> {
    const schedules = await db.select().from(brewingSchedules);
    return schedules;
  }

  async getBrewingSchedule(id: number): Promise<BrewingSchedule | undefined> {
    const [schedule] = await db.select().from(brewingSchedules).where(eq(brewingSchedules.id, id));
    return schedule;
  }

  async createBrewingSchedule(schedule: InsertBrewingSchedule): Promise<BrewingSchedule> {
    const [newSchedule] = await db
      .insert(brewingSchedules)
      .values(schedule)
      .returning();
    return newSchedule;
  }

  async updateBrewingSchedule(id: number, schedule: Partial<BrewingSchedule>): Promise<BrewingSchedule | undefined> {
    const [updatedSchedule] = await db
      .update(brewingSchedules)
      .set({ ...schedule, updatedAt: new Date() })
      .where(eq(brewingSchedules.id, id))
      .returning();
    return updatedSchedule;
  }

  async deleteBrewingSchedule(id: number): Promise<boolean> {
    const result = await db.delete(brewingSchedules).where(eq(brewingSchedules.id, id));
    return result.rowCount > 0;
  }

  // Price history operations
  async getPriceHistoryForIngredient(ingredientId: number): Promise<IngredientPriceHistory[]> {
    const history = await db.select().from(ingredientPriceHistory).where(eq(ingredientPriceHistory.ingredientId, ingredientId));
    return history;
  }

  async getAllPriceHistory(): Promise<IngredientPriceHistory[]> {
    const history = await db.select().from(ingredientPriceHistory);
    return history;
  }

  async addPriceHistoryEntry(entry: InsertIngredientPriceHistory): Promise<IngredientPriceHistory> {
    const [newEntry] = await db
      .insert(ingredientPriceHistory)
      .values(entry)
      .returning();
    return newEntry;
  }

  async updatePriceHistoryEntry(id: number, entry: Partial<IngredientPriceHistory>): Promise<IngredientPriceHistory | undefined> {
    const [updatedEntry] = await db
      .update(ingredientPriceHistory)
      .set(entry)
      .where(eq(ingredientPriceHistory.id, id))
      .returning();
    return updatedEntry;
  }

  async deletePriceHistoryEntry(id: number): Promise<boolean> {
    const result = await db.delete(ingredientPriceHistory).where(eq(ingredientPriceHistory.id, id));
    return result.rowCount > 0;
  }
}