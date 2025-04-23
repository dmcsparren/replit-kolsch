import { 
  User, InsertUser,
  InventoryItem, InsertInventoryItem,
  IngredientSource, InsertIngredientSource,
  Equipment, InsertEquipment,
  Recipe, InsertRecipe,
  BrewingSchedule, InsertBrewingSchedule
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Inventory operations
  getInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItem(id: number): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: number): Promise<boolean>;
  
  // Ingredient source operations
  getAllIngredientSources(): Promise<IngredientSource[]>;
  getIngredientSource(id: number): Promise<IngredientSource | undefined>;
  createIngredientSource(source: InsertIngredientSource): Promise<IngredientSource>;
  updateIngredientSource(id: number, source: Partial<IngredientSource>): Promise<IngredientSource | undefined>;
  deleteIngredientSource(id: number): Promise<boolean>;
  
  // Equipment operations
  getAllEquipment(): Promise<Equipment[]>;
  getEquipment(id: number): Promise<Equipment | undefined>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: number, equipment: Partial<Equipment>): Promise<Equipment | undefined>;
  deleteEquipment(id: number): Promise<boolean>;
  
  // Recipe operations
  getAllRecipes(): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, recipe: Partial<Recipe>): Promise<Recipe | undefined>;
  deleteRecipe(id: number): Promise<boolean>;
  
  // Brewing schedule operations
  getAllBrewingSchedules(): Promise<BrewingSchedule[]>;
  getBrewingSchedule(id: number): Promise<BrewingSchedule | undefined>;
  createBrewingSchedule(schedule: InsertBrewingSchedule): Promise<BrewingSchedule>;
  updateBrewingSchedule(id: number, schedule: Partial<BrewingSchedule>): Promise<BrewingSchedule | undefined>;
  deleteBrewingSchedule(id: number): Promise<boolean>;
}