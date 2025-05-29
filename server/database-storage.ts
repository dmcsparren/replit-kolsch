import { 
  users, 
  inventoryItems, 
  ingredientSources, 
  equipment, 
  recipes, 
  brewingSchedules, 
  ingredientPriceHistory,
  type User, 
  type InsertUser, 
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
    this.initializeData();
  }



  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Inventory operations
  async getInventoryItems(): Promise<InventoryItem[]> {
    return await db.select().from(inventoryItems);
  }

  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return item || undefined;
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
      .set(item)
      .where(eq(inventoryItems.id, id))
      .returning();
    return updatedItem || undefined;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    const result = await db
      .delete(inventoryItems)
      .where(eq(inventoryItems.id, id))
      .returning({ id: inventoryItems.id });
    return result.length > 0;
  }

  // Ingredient source operations
  async getAllIngredientSources(): Promise<IngredientSource[]> {
    return await db.select().from(ingredientSources);
  }

  async getIngredientSource(id: number): Promise<IngredientSource | undefined> {
    const [source] = await db.select().from(ingredientSources).where(eq(ingredientSources.id, id));
    return source || undefined;
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
      .set(source)
      .where(eq(ingredientSources.id, id))
      .returning();
    return updatedSource || undefined;
  }

  async deleteIngredientSource(id: number): Promise<boolean> {
    const result = await db
      .delete(ingredientSources)
      .where(eq(ingredientSources.id, id))
      .returning({ id: ingredientSources.id });
    return result.length > 0;
  }

  // Equipment operations
  async getAllEquipment(): Promise<Equipment[]> {
    return await db.select().from(equipment);
  }

  async getEquipment(id: number): Promise<Equipment | undefined> {
    const [item] = await db.select().from(equipment).where(eq(equipment.id, id));
    return item || undefined;
  }

  async createEquipment(equipmentItem: InsertEquipment): Promise<Equipment> {
    const [newItem] = await db
      .insert(equipment)
      .values(equipmentItem)
      .returning();
    return newItem;
  }

  async updateEquipment(id: number, equipmentItem: Partial<Equipment>): Promise<Equipment | undefined> {
    const [updatedItem] = await db
      .update(equipment)
      .set(equipmentItem)
      .where(eq(equipment.id, id))
      .returning();
    return updatedItem || undefined;
  }

  async deleteEquipment(id: number): Promise<boolean> {
    const result = await db
      .delete(equipment)
      .where(eq(equipment.id, id))
      .returning({ id: equipment.id });
    return result.length > 0;
  }

  // Recipe operations
  async getAllRecipes(): Promise<Recipe[]> {
    return await db.select().from(recipes);
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    return recipe || undefined;
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
      .set(recipe)
      .where(eq(recipes.id, id))
      .returning();
    return updatedRecipe || undefined;
  }

  async deleteRecipe(id: number): Promise<boolean> {
    const result = await db
      .delete(recipes)
      .where(eq(recipes.id, id))
      .returning({ id: recipes.id });
    return result.length > 0;
  }

  // Brewing schedule operations
  async getAllBrewingSchedules(): Promise<BrewingSchedule[]> {
    return await db.select().from(brewingSchedules);
  }

  async getBrewingSchedule(id: number): Promise<BrewingSchedule | undefined> {
    const [schedule] = await db.select().from(brewingSchedules).where(eq(brewingSchedules.id, id));
    return schedule || undefined;
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
      .set(schedule)
      .where(eq(brewingSchedules.id, id))
      .returning();
    return updatedSchedule || undefined;
  }

  async deleteBrewingSchedule(id: number): Promise<boolean> {
    const result = await db
      .delete(brewingSchedules)
      .where(eq(brewingSchedules.id, id))
      .returning({ id: brewingSchedules.id });
    return result.length > 0;
  }

  // Ingredient price history operations
  async getPriceHistoryForIngredient(ingredientId: number): Promise<IngredientPriceHistory[]> {
    return await db
      .select()
      .from(ingredientPriceHistory)
      .where(eq(ingredientPriceHistory.ingredientId, ingredientId));
  }

  async getAllPriceHistory(): Promise<IngredientPriceHistory[]> {
    return await db.select().from(ingredientPriceHistory);
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
    return updatedEntry || undefined;
  }

  async deletePriceHistoryEntry(id: number): Promise<boolean> {
    const result = await db
      .delete(ingredientPriceHistory)
      .where(eq(ingredientPriceHistory.id, id))
      .returning({ id: ingredientPriceHistory.id });
    return result.length > 0;
  }

  // Initialize data for first-time use
  async initializeData() {
    try {
      // Check if we need to seed the database
      const userCount = await db.select().from(users);
      if (userCount.length > 0) {
        return; // Database is already populated
      }

      console.log("Initializing database with sample data...");

      // User creation now handled by authentication system

      // Add example inventory items
      const now = new Date();
      await this.createInventoryItem({
        name: "Cascade Hops",
        category: "Hops",
        currentQuantity: "25",
        minimumQuantity: "5",
        unit: "kg",
        status: "In Stock",
        forecast: "Stable",
        lastUpdated: now,
        imageUrl: null
      });

      await this.createInventoryItem({
        name: "Pilsner Malt",
        category: "Grain",
        currentQuantity: "200",
        minimumQuantity: "50",
        unit: "kg",
        status: "In Stock",
        forecast: "Stable",
        lastUpdated: now,
        imageUrl: null
      });

      // Add example equipment
      await this.createEquipment({
        name: "Brew Kettle #1",
        type: "kettle",
        status: "operational",
        maintenanceStatus: "good",
        currentBatch: "Summer Kolsch",
        timeRemaining: "1:30h",
        utilization: 80
      });

      await this.createEquipment({
        name: "Fermenter Tank A",
        type: "fermenter",
        status: "operational",
        maintenanceStatus: "good",
        currentBatch: "Vienna Lager",
        timeRemaining: "3 days",
        utilization: 75
      });

      // Add example recipe
      await this.createRecipe({
        name: "Summer Kolsch",
        type: "Kolsch",
        batchSize: "500",
        unitOfMeasure: "L",
        originalGravity: "1.048",
        finalGravity: "1.010",
        abv: "5.0",
        ibu: 25,
        description: "A crisp, clean traditional German Kolsch.",
        instructions: [
          "Mash at 65°C for 60 min.",
          "Boil for 60 min with hop additions at 60 and 15 min.", 
          "Ferment at 15°C for two weeks, then lager for two weeks at 2°C."
        ],
        ingredients: [
          { name: "Pilsner Malt", amount: 90, unit: "kg" },
          { name: "Vienna Malt", amount: 10, unit: "kg" },
          { name: "Hallertau Hops", amount: 800, unit: "g" },
          { name: "Kolsch Yeast", amount: 4, unit: "packs" }
        ],
        imageUrl: null,
        lastBrewed: null,
        notes: "A crowd favorite in summer months."
      });

      // Add example brew schedule
      const startDate = new Date();
      startDate.setHours(10, 0, 0, 0);
      const endDate = new Date();
      endDate.setHours(16, 0, 0, 0);

      await this.createBrewingSchedule({
        recipeName: "Summer Kolsch",
        batchNumber: "Batch #4327",
        startDate: startDate,
        endDate: endDate,
        status: "In progress",
        equipmentId: 1
      });

      console.log("Database initialization complete.");
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }
}