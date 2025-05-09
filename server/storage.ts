import { 
  users, InsertUser, User,
  inventoryItems, InsertInventoryItem, InventoryItem,
  ingredientSources, InsertIngredientSource, IngredientSource,
  equipment, InsertEquipment, Equipment,
  recipes, InsertRecipe, Recipe,
  brewingSchedules, InsertBrewingSchedule, BrewingSchedule,
  ingredientPriceHistory, InsertIngredientPriceHistory, IngredientPriceHistory
} from "@shared/schema";
import { IStorage } from './storage-interface';
import { db } from './db';
import { eq } from 'drizzle-orm';

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize the database with sample data if it's empty
    this.initializeData().catch(err => {
      console.error("Failed to initialize database:", err);
    });
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
    const [user] = await db.insert(users).values(insertUser).returning();
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
    const [inventoryItem] = await db.insert(inventoryItems).values(item).returning();
    return inventoryItem;
  }

  async updateInventoryItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem | undefined> {
    const [updated] = await db
      .update(inventoryItems)
      .set(item)
      .where(eq(inventoryItems.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    const result = await db.delete(inventoryItems).where(eq(inventoryItems.id, id));
    return true; // In a real application, you'd check if any rows were affected
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
    const [newSource] = await db.insert(ingredientSources).values(source).returning();
    return newSource;
  }

  async updateIngredientSource(id: number, source: Partial<IngredientSource>): Promise<IngredientSource | undefined> {
    const [updated] = await db
      .update(ingredientSources)
      .set(source)
      .where(eq(ingredientSources.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteIngredientSource(id: number): Promise<boolean> {
    await db.delete(ingredientSources).where(eq(ingredientSources.id, id));
    return true;
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
    const [newEquipment] = await db.insert(equipment).values(equipmentItem).returning();
    return newEquipment;
  }

  async updateEquipment(id: number, equipmentItem: Partial<Equipment>): Promise<Equipment | undefined> {
    const [updated] = await db
      .update(equipment)
      .set(equipmentItem)
      .where(eq(equipment.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteEquipment(id: number): Promise<boolean> {
    await db.delete(equipment).where(eq(equipment.id, id));
    return true;
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
    const [newRecipe] = await db.insert(recipes).values(recipe).returning();
    return newRecipe;
  }

  async updateRecipe(id: number, recipe: Partial<Recipe>): Promise<Recipe | undefined> {
    const [updated] = await db
      .update(recipes)
      .set(recipe)
      .where(eq(recipes.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteRecipe(id: number): Promise<boolean> {
    await db.delete(recipes).where(eq(recipes.id, id));
    return true;
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
    const [newSchedule] = await db.insert(brewingSchedules).values(schedule).returning();
    return newSchedule;
  }

  async updateBrewingSchedule(id: number, schedule: Partial<BrewingSchedule>): Promise<BrewingSchedule | undefined> {
    const [updated] = await db
      .update(brewingSchedules)
      .set(schedule)
      .where(eq(brewingSchedules.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteBrewingSchedule(id: number): Promise<boolean> {
    await db.delete(brewingSchedules).where(eq(brewingSchedules.id, id));
    return true;
  }
  
  // Ingredient price history operations
  async getPriceHistoryForIngredient(ingredientId: number): Promise<IngredientPriceHistory[]> {
    return await db.select()
      .from(ingredientPriceHistory)
      .where(eq(ingredientPriceHistory.ingredientId, ingredientId))
      .orderBy(ingredientPriceHistory.date);
  }
  
  async getAllPriceHistory(): Promise<IngredientPriceHistory[]> {
    return await db.select().from(ingredientPriceHistory).orderBy(ingredientPriceHistory.date);
  }
  
  async addPriceHistoryEntry(entry: InsertIngredientPriceHistory): Promise<IngredientPriceHistory> {
    const [newEntry] = await db.insert(ingredientPriceHistory).values(entry).returning();
    return newEntry;
  }
  
  async updatePriceHistoryEntry(id: number, entry: Partial<IngredientPriceHistory>): Promise<IngredientPriceHistory | undefined> {
    const [updated] = await db
      .update(ingredientPriceHistory)
      .set(entry)
      .where(eq(ingredientPriceHistory.id, id))
      .returning();
    return updated || undefined;
  }
  
  async deletePriceHistoryEntry(id: number): Promise<boolean> {
    await db.delete(ingredientPriceHistory).where(eq(ingredientPriceHistory.id, id));
    return true;
  }

  // Initialize sample data
  async initializeData() {
    // Create a sample user if none exists
    const existingUsers = await db.select().from(users);
    if (existingUsers.length === 0) {
      await this.createUser({
        username: "sam",
        password: "password",
        name: "Sam Brewer",
        role: "Brewmaster"
      });
      
      // Create sample inventory items
      const sampleInventory: InsertInventoryItem[] = [
        {
          name: "Cascade Hops",
          category: "Hops",
          currentQuantity: "5",
          minimumQuantity: "20",
          unit: "kg",
          status: "critical",
          forecast: "Order soon",
          lastUpdated: new Date()
        },
        {
          name: "Pilsner Malt",
          category: "Malt",
          currentQuantity: "75",
          minimumQuantity: "100",
          unit: "kg",
          status: "warning",
          forecast: "2 weeks",
          lastUpdated: new Date()
        },
        {
          name: "Yeast - Kölsch",
          category: "Yeast",
          currentQuantity: "24",
          minimumQuantity: "10",
          unit: "packs",
          status: "good",
          forecast: "Sufficient",
          lastUpdated: new Date()
        },
        {
          name: "Vienna Malt",
          category: "Malt",
          currentQuantity: "120",
          minimumQuantity: "50",
          unit: "kg",
          status: "good",
          forecast: "Sufficient",
          lastUpdated: new Date()
        },
        {
          name: "Saaz Hops",
          category: "Hops",
          currentQuantity: "8",
          minimumQuantity: "15",
          unit: "kg",
          status: "warning",
          forecast: "3 weeks",
          lastUpdated: new Date()
        }
      ];
      
      for (const item of sampleInventory) {
        await this.createInventoryItem(item);
      }
      
      // Create sample ingredient sources
      const sampleIngredientSources: InsertIngredientSource[] = [
        {
          name: "Yakima Valley Hops",
          address: "702 N 1st Ave",
          city: "Yakima",
          country: "USA",
          latitude: "46.6021",
          longitude: "-120.5059",
          type: "Hop Farm",
          description: "Premium hop farm in the Pacific Northwest",
          website: "https://yakimavalleyhops.com",
          contactEmail: "info@yakimavalleyhops.com",
          contactPhone: "+1-800-555-1234",
          image: "https://example.com/yakima-hops.jpg",
          suppliedIngredients: ["Cascade Hops", "Centennial Hops", "Simcoe Hops"]
        },
        {
          name: "Bamberg Malthouse",
          address: "Malzstraße 5",
          city: "Bamberg",
          country: "Germany",
          latitude: "49.8988",
          longitude: "10.9028",
          type: "Malt House",
          description: "Traditional German malt producer",
          website: "https://bambergmalt.de",
          contactEmail: "kontakt@bambergmalt.de",
          contactPhone: "+49-951-555-6789",
          image: "https://example.com/bamberg-malt.jpg",
          suppliedIngredients: ["Pilsner Malt", "Vienna Malt", "Munich Malt"]
        },
        {
          name: "Bohemian Hop Gardens",
          address: "Žatec 438",
          city: "Žatec",
          country: "Czech Republic",
          latitude: "50.3271",
          longitude: "13.5456",
          type: "Hop Farm",
          description: "Historic Saaz hop producer from Czech Republic",
          website: "https://bohemianhops.cz",
          contactEmail: "info@bohemianhops.cz",
          contactPhone: "+420-414-555-7890",
          image: "https://example.com/bohemian-hops.jpg",
          suppliedIngredients: ["Saaz Hops"]
        },
        {
          name: "White Labs",
          address: "9495 Candida St",
          city: "San Diego",
          country: "USA",
          latitude: "32.8328",
          longitude: "-117.1408",
          type: "Yeast Lab",
          description: "Premium liquid yeast producer",
          website: "https://whitelabs.com",
          contactEmail: "info@whitelabs.com",
          contactPhone: "+1-888-555-9876",
          image: "https://example.com/white-labs.jpg",
          suppliedIngredients: ["Kölsch Yeast", "American Ale Yeast", "Lager Yeast"]
        },
        {
          name: "Canterbury Malting",
          address: "123 Barley Rd",
          city: "Canterbury",
          country: "UK",
          latitude: "51.2798",
          longitude: "1.0828",
          type: "Malt House",
          description: "Traditional English malt producer",
          website: "https://canterburymalt.co.uk",
          contactEmail: "sales@canterburymalt.co.uk",
          contactPhone: "+44-1227-555-4321",
          image: "https://example.com/canterbury-malt.jpg",
          suppliedIngredients: ["Pale Malt", "Crystal Malt", "Maris Otter"]
        }
      ];
      
      for (const source of sampleIngredientSources) {
        await this.createIngredientSource(source);
      }
      
      // Create sample equipment
      const sampleEquipment: InsertEquipment[] = [
        {
          name: "Brew Kettle #1",
          type: "kettle",
          status: "active",
          currentBatch: "Batch #1242",
          utilization: 76,
          maintenanceStatus: "good",
          timeRemaining: "4h 22m remaining"
        },
        {
          name: "Fermenter #2",
          type: "fermenter",
          status: "active",
          currentBatch: "Batch #1238",
          utilization: 89,
          maintenanceStatus: "good",
          timeRemaining: "2d 6h remaining"
        },
        {
          name: "Mash Tun #1",
          type: "mash-tun",
          status: "offline",
          currentBatch: "",
          utilization: 0,
          maintenanceStatus: "maintenance",
          timeRemaining: "1d 3h estimated"
        },
        {
          name: "Fermenter #1",
          type: "fermenter",
          status: "active",
          currentBatch: "Batch #1240",
          utilization: 92,
          maintenanceStatus: "good",
          timeRemaining: "1d 12h remaining"
        }
      ];
      
      for (const item of sampleEquipment) {
        await this.createEquipment(item);
      }
      
      // Create sample recipes
      const sampleRecipes: InsertRecipe[] = [
        {
          name: "Summer Kölsch",
          type: "Flagship",
          description: "Light, crisp and refreshing German-style ale perfect for summer.",
          abv: "4.8",
          ibu: 22,
          srm: "3.5",
          ingredients: ["Pilsner Malt", "Vienna Malt", "Cascade Hops", "Kolsch Yeast"],
          instructions: ["Mash at 152°F for 60 minutes", "Boil for 60 minutes", "Ferment at 60°F for 10 days"]
        },
        {
          name: "Vienna Lager",
          type: "Flagship",
          description: "Traditional amber lager with toasty malt character and moderate hop bitterness.",
          abv: "5.2",
          ibu: 25,
          srm: "12",
          ingredients: ["Vienna Malt", "Munich Malt", "Saaz Hops", "Lager Yeast"],
          instructions: ["Mash at 154°F for 60 minutes", "Boil for 90 minutes", "Ferment at 50°F for 14 days", "Lager for 4 weeks"]
        },
        {
          name: "Hoppy Pale Ale",
          type: "Seasonal",
          description: "American pale ale with citrus forward hop profile.",
          abv: "5.8",
          ibu: 45,
          srm: "6",
          ingredients: ["Pale Malt", "Crystal Malt", "Cascade Hops", "Centennial Hops", "American Ale Yeast"],
          instructions: ["Mash at 152°F for 60 minutes", "Boil for 60 minutes", "Dry hop for 5 days", "Ferment at 68°F for 10 days"]
        }
      ];
      
      for (const recipe of sampleRecipes) {
        await this.createRecipe(recipe);
      }
      
      // Create sample brewing schedules
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const may18 = new Date(today);
      may18.setDate(18);
      may18.setMonth(4); // May is 4 (0-based index)
      
      const may20 = new Date(today);
      may20.setDate(20);
      may20.setMonth(4); // May is 4 (0-based index)
      
      const sampleSchedules: InsertBrewingSchedule[] = [
        {
          recipeName: "Summer Kölsch",
          batchNumber: "Batch #1242",
          startDate: today,
          endDate: new Date(today.getTime() + 6 * 60 * 60 * 1000), // 6 hours later
          status: "In progress",
          equipmentId: 1
        },
        {
          recipeName: "Vienna Lager",
          batchNumber: "Batch #1243",
          startDate: tomorrow,
          endDate: new Date(tomorrow.getTime() + 6 * 60 * 60 * 1000), // 6 hours later
          status: "Scheduled",
          equipmentId: null
        },
        {
          recipeName: "Hoppy Pale Ale",
          batchNumber: "Batch #1244",
          startDate: may18,
          endDate: new Date(may18.getTime() + 6 * 60 * 60 * 1000), // 6 hours later
          status: "Scheduled",
          equipmentId: null
        },
        {
          recipeName: "Wheat Beer",
          batchNumber: "Batch #1245",
          startDate: may20,
          endDate: new Date(may20.getTime() + 6 * 60 * 60 * 1000), // 6 hours later
          status: "Scheduled",
          equipmentId: null
        }
      ];
      
      for (const schedule of sampleSchedules) {
        await this.createBrewingSchedule(schedule);
      }
    }
  }
}

export const storage = new DatabaseStorage();
