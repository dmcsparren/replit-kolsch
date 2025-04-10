import { 
  users, InsertUser, User,
  inventoryItems, InsertInventoryItem, InventoryItem,
  equipment, InsertEquipment, Equipment,
  recipes, InsertRecipe, Recipe,
  brewingSchedules, InsertBrewingSchedule, BrewingSchedule
} from "@shared/schema";
import { IStorage } from "./storage-interface";

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private inventory: Map<number, InventoryItem>;
  private equipment: Map<number, Equipment>;
  private recipes: Map<number, Recipe>;
  private schedules: Map<number, BrewingSchedule>;
  
  private userId: number;
  private inventoryId: number;
  private equipmentId: number;
  private recipeId: number;
  private scheduleId: number;
  
  constructor() {
    this.users = new Map();
    this.inventory = new Map();
    this.equipment = new Map();
    this.recipes = new Map();
    this.schedules = new Map();
    
    this.userId = 1;
    this.inventoryId = 1;
    this.equipmentId = 1;
    this.recipeId = 1;
    this.scheduleId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Inventory operations
  async getInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventory.values());
  }
  
  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    return this.inventory.get(id);
  }
  
  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const id = this.inventoryId++;
    const inventoryItem = { ...item, id };
    this.inventory.set(id, inventoryItem);
    return inventoryItem;
  }
  
  async updateInventoryItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem | undefined> {
    const existing = this.inventory.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...item };
    this.inventory.set(id, updated);
    return updated;
  }
  
  async deleteInventoryItem(id: number): Promise<boolean> {
    return this.inventory.delete(id);
  }
  
  // Equipment operations
  async getAllEquipment(): Promise<Equipment[]> {
    return Array.from(this.equipment.values());
  }
  
  async getEquipment(id: number): Promise<Equipment | undefined> {
    return this.equipment.get(id);
  }
  
  async createEquipment(equipmentItem: InsertEquipment): Promise<Equipment> {
    const id = this.equipmentId++;
    const newEquipment = { ...equipmentItem, id };
    this.equipment.set(id, newEquipment);
    return newEquipment;
  }
  
  async updateEquipment(id: number, equipmentItem: Partial<Equipment>): Promise<Equipment | undefined> {
    const existing = this.equipment.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...equipmentItem };
    this.equipment.set(id, updated);
    return updated;
  }
  
  async deleteEquipment(id: number): Promise<boolean> {
    return this.equipment.delete(id);
  }
  
  // Recipe operations
  async getAllRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }
  
  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }
  
  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const id = this.recipeId++;
    const newRecipe = { ...recipe, id };
    this.recipes.set(id, newRecipe);
    return newRecipe;
  }
  
  async updateRecipe(id: number, recipe: Partial<Recipe>): Promise<Recipe | undefined> {
    const existing = this.recipes.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...recipe };
    this.recipes.set(id, updated);
    return updated;
  }
  
  async deleteRecipe(id: number): Promise<boolean> {
    return this.recipes.delete(id);
  }
  
  // Brewing schedule operations
  async getAllBrewingSchedules(): Promise<BrewingSchedule[]> {
    return Array.from(this.schedules.values());
  }
  
  async getBrewingSchedule(id: number): Promise<BrewingSchedule | undefined> {
    return this.schedules.get(id);
  }
  
  async createBrewingSchedule(schedule: InsertBrewingSchedule): Promise<BrewingSchedule> {
    const id = this.scheduleId++;
    const newSchedule = { ...schedule, id };
    this.schedules.set(id, newSchedule);
    return newSchedule;
  }
  
  async updateBrewingSchedule(id: number, schedule: Partial<BrewingSchedule>): Promise<BrewingSchedule | undefined> {
    const existing = this.schedules.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...schedule };
    this.schedules.set(id, updated);
    return updated;
  }
  
  async deleteBrewingSchedule(id: number): Promise<boolean> {
    return this.schedules.delete(id);
  }
  
  // Initialize sample data
  private initializeData() {
    // Create a sample user
    this.createUser({
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
    
    sampleInventory.forEach(item => this.createInventoryItem(item));
    
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
    
    sampleEquipment.forEach(item => this.createEquipment(item));
    
    // Create sample recipes
    const sampleRecipes: InsertRecipe[] = [
      {
        name: "Summer Kölsch",
        type: "Flagship",
        description: "Light, crisp and refreshing German-style ale perfect for summer.",
        abv: "4.8",
        ibu: 22,
        srm: "3.5",
        ingredients: JSON.parse('["Pilsner Malt", "Vienna Malt", "Cascade Hops", "Kolsch Yeast"]'),
        instructions: JSON.parse('["Mash at 152°F for 60 minutes", "Boil for 60 minutes", "Ferment at 60°F for 10 days"]')
      },
      {
        name: "Vienna Lager",
        type: "Flagship",
        description: "Traditional amber lager with toasty malt character and moderate hop bitterness.",
        abv: "5.2",
        ibu: 25,
        srm: "12",
        ingredients: JSON.parse('["Vienna Malt", "Munich Malt", "Saaz Hops", "Lager Yeast"]'),
        instructions: JSON.parse('["Mash at 154°F for 60 minutes", "Boil for 90 minutes", "Ferment at 50°F for 14 days", "Lager for 4 weeks"]')
      },
      {
        name: "Hoppy Pale Ale",
        type: "Seasonal",
        description: "American pale ale with citrus forward hop profile.",
        abv: "5.8",
        ibu: 45,
        srm: "6",
        ingredients: JSON.parse('["Pale Malt", "Crystal Malt", "Cascade Hops", "Centennial Hops", "American Ale Yeast"]'),
        instructions: JSON.parse('["Mash at 152°F for 60 minutes", "Boil for 60 minutes", "Dry hop for 5 days", "Ferment at 68°F for 10 days"]')
      }
    ];
    
    sampleRecipes.forEach(recipe => this.createRecipe(recipe));
    
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
    
    sampleSchedules.forEach(schedule => this.createBrewingSchedule(schedule));
  }
}