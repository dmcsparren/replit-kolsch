import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { 
  insertInventoryItemSchema, 
  insertEquipmentSchema, 
  insertRecipeSchema, 
  insertBrewingScheduleSchema,
  insertIngredientSourceSchema,
  insertIngredientPriceHistorySchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Signup route for new brewery accounts
  app.post("/api/signup", async (req: Request, res: Response) => {
    try {
      const { user, brewery } = req.body;

      // Validate required user fields
      if (!user.firstName || !user.lastName || !user.email || !user.username || !user.password) {
        return res.status(400).json({ message: "All user fields are required" });
      }

      // Validate required brewery fields
      if (!brewery.name || !brewery.type || !brewery.location) {
        return res.status(400).json({ message: "Brewery name, type, and location are required" });
      }

      // Generate unique brewery GUID
      const breweryId = randomUUID();
      const userId = randomUUID();

      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Create brewery account first
      const newBrewery = await storage.createBrewery({
        id: breweryId,
        name: brewery.name,
        type: brewery.type,
        location: brewery.location,
        foundedYear: brewery.foundedYear || null,
        website: brewery.website || null,
        phone: brewery.phone || null,
        brewingCapacity: brewery.brewingCapacity || null,
        specialties: brewery.specialties || null,
      });

      // Create user account linked to brewery
      const newUser = await storage.createUser({
        id: userId,
        username: user.username,
        email: user.email,
        password: hashedPassword,
        firstName: user.firstName,
        lastName: user.lastName,
        breweryId: breweryId,
        role: user.role || 'owner',
      });

      // Brewery account created successfully

      res.json({ 
        message: "Account created successfully",
        brewery: newBrewery,
        user: { ...newUser, password: undefined } // Don't return password
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.message.includes("unique") || error.message.includes("duplicate")) {
        return res.status(400).json({ message: "Username or email already exists" });
      }
      res.status(500).json({ message: "Failed to create account" });
    }
  });
  
  // Inventory routes
  app.get("/api/inventory", async (_req: Request, res: Response) => {
    try {
      const items = await storage.getInventoryItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory items" });
    }
  });
  
  app.get("/api/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const item = await storage.getInventoryItem(id);
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory item" });
    }
  });
  
  app.post("/api/inventory", async (req: Request, res: Response) => {
    try {
      const validatedData = insertInventoryItemSchema.parse(req.body);
      const newItem = await storage.createInventoryItem(validatedData);
      res.status(201).json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });
  
  app.put("/api/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const validatedData = insertInventoryItemSchema.partial().parse(req.body);
      const updatedItem = await storage.updateInventoryItem(id, validatedData);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update inventory item" });
    }
  });
  
  app.delete("/api/inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteInventoryItem(id);
      if (!success) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete inventory item" });
    }
  });
  
  // Equipment routes
  app.get("/api/equipment", async (_req: Request, res: Response) => {
    try {
      const equipmentItems = await storage.getAllEquipment();
      res.json(equipmentItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch equipment items" });
    }
  });
  
  app.get("/api/equipment/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const equipment = await storage.getEquipment(id);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });
  
  app.post("/api/equipment", async (req: Request, res: Response) => {
    try {
      const validatedData = insertEquipmentSchema.parse(req.body);
      const newEquipment = await storage.createEquipment(validatedData);
      res.status(201).json(newEquipment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid equipment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create equipment" });
    }
  });
  
  app.put("/api/equipment/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const validatedData = insertEquipmentSchema.partial().parse(req.body);
      const updatedEquipment = await storage.updateEquipment(id, validatedData);
      
      if (!updatedEquipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      res.json(updatedEquipment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid equipment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update equipment" });
    }
  });
  
  app.delete("/api/equipment/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteEquipment(id);
      if (!success) {
        return res.status(404).json({ message: "Equipment not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete equipment" });
    }
  });
  
  // Recipe routes
  app.get("/api/recipes", async (_req: Request, res: Response) => {
    try {
      const recipes = await storage.getAllRecipes();
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });
  
  app.get("/api/recipes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const recipe = await storage.getRecipe(id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });
  
  app.post("/api/recipes", async (req: Request, res: Response) => {
    try {
      const validatedData = insertRecipeSchema.parse(req.body);
      const newRecipe = await storage.createRecipe(validatedData);
      res.status(201).json(newRecipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recipe data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create recipe" });
    }
  });
  
  app.put("/api/recipes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const validatedData = insertRecipeSchema.partial().parse(req.body);
      const updatedRecipe = await storage.updateRecipe(id, validatedData);
      
      if (!updatedRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.json(updatedRecipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recipe data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update recipe" });
    }
  });
  
  app.delete("/api/recipes/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteRecipe(id);
      if (!success) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete recipe" });
    }
  });
  
  // Brewing schedule routes
  app.get("/api/schedules", async (_req: Request, res: Response) => {
    try {
      const schedules = await storage.getAllBrewingSchedules();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brewing schedules" });
    }
  });
  
  app.get("/api/schedules/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const schedule = await storage.getBrewingSchedule(id);
      if (!schedule) {
        return res.status(404).json({ message: "Brewing schedule not found" });
      }
      
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brewing schedule" });
    }
  });
  
  app.post("/api/schedules", async (req: Request, res: Response) => {
    try {
      const validatedData = insertBrewingScheduleSchema.parse(req.body);
      const newSchedule = await storage.createBrewingSchedule(validatedData);
      res.status(201).json(newSchedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid brewing schedule data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create brewing schedule" });
    }
  });
  
  app.put("/api/schedules/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const validatedData = insertBrewingScheduleSchema.partial().parse(req.body);
      const updatedSchedule = await storage.updateBrewingSchedule(id, validatedData);
      
      if (!updatedSchedule) {
        return res.status(404).json({ message: "Brewing schedule not found" });
      }
      
      res.json(updatedSchedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid brewing schedule data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update brewing schedule" });
    }
  });
  
  app.delete("/api/schedules/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteBrewingSchedule(id);
      if (!success) {
        return res.status(404).json({ message: "Brewing schedule not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete brewing schedule" });
    }
  });
  
  // Ingredient sources routes
  app.get("/api/ingredient-sources", async (_req: Request, res: Response) => {
    try {
      const sources = await storage.getAllIngredientSources();
      res.json(sources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ingredient sources" });
    }
  });
  
  app.get("/api/ingredient-sources/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const source = await storage.getIngredientSource(id);
      if (!source) {
        return res.status(404).json({ message: "Ingredient source not found" });
      }
      
      res.json(source);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ingredient source" });
    }
  });
  
  app.post("/api/ingredient-sources", async (req: Request, res: Response) => {
    try {
      const validatedData = insertIngredientSourceSchema.parse(req.body);
      const newSource = await storage.createIngredientSource(validatedData);
      res.status(201).json(newSource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ingredient source data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ingredient source" });
    }
  });
  
  app.put("/api/ingredient-sources/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const validatedData = insertIngredientSourceSchema.partial().parse(req.body);
      const updatedSource = await storage.updateIngredientSource(id, validatedData);
      
      if (!updatedSource) {
        return res.status(404).json({ message: "Ingredient source not found" });
      }
      
      res.json(updatedSource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ingredient source data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update ingredient source" });
    }
  });
  
  app.delete("/api/ingredient-sources/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deleteIngredientSource(id);
      if (!success) {
        return res.status(404).json({ message: "Ingredient source not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete ingredient source" });
    }
  });

  // Stats routes
  app.get("/api/stats", async (_req: Request, res: Response) => {
    try {
      const inventoryItems = await storage.getInventoryItems();
      const equipmentItems = await storage.getAllEquipment();
      const schedules = await storage.getAllBrewingSchedules();
      
      // Calculate the stats
      const batchesInProcess = schedules.filter(s => s.status === "In progress").length;
      const totalInventoryItems = inventoryItems.length;
      const lowStockItems = inventoryItems.filter(item => 
        item.status === "critical" || item.status === "warning"
      ).length;
      
      const totalEquipment = equipmentItems.length;
      const activeEquipment = equipmentItems.filter(e => e.status === "active").length;
      const equipmentUtilization = Math.floor((activeEquipment / totalEquipment) * 100);
      const maintenanceNeeded = equipmentItems.filter(e => e.maintenanceStatus === "maintenance").length;
      
      const scheduledBrews = schedules.filter(s => s.status === "Scheduled").length;
      const thisWeekBrews = schedules.filter(s => {
        const scheduleDate = new Date(s.startDate);
        const today = new Date();
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
        
        return scheduleDate >= today && scheduleDate <= endOfWeek;
      }).length;
      
      res.json({
        batchesInProcess,
        batchesInProcessChange: "+3",
        totalInventoryItems,
        lowStockItems,
        equipmentUtilization,
        maintenanceNeeded,
        scheduledBrews,
        thisWeekBrews
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Ingredient price history routes
  app.get("/api/price-history", async (_req: Request, res: Response) => {
    try {
      const history = await storage.getAllPriceHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch price history" });
    }
  });
  
  app.get("/api/price-history/ingredient/:id", async (req: Request, res: Response) => {
    try {
      const ingredientId = parseInt(req.params.id);
      if (isNaN(ingredientId)) {
        return res.status(400).json({ message: "Invalid ingredient ID format" });
      }
      
      const history = await storage.getPriceHistoryForIngredient(ingredientId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch price history for ingredient" });
    }
  });
  
  app.post("/api/price-history", async (req: Request, res: Response) => {
    try {
      const validatedData = insertIngredientPriceHistorySchema.parse(req.body);
      const newEntry = await storage.addPriceHistoryEntry(validatedData);
      res.status(201).json(newEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid price history data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create price history entry" });
    }
  });
  
  app.put("/api/price-history/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const validatedData = insertIngredientPriceHistorySchema.partial().parse(req.body);
      const updatedEntry = await storage.updatePriceHistoryEntry(id, validatedData);
      
      if (!updatedEntry) {
        return res.status(404).json({ message: "Price history entry not found" });
      }
      
      res.json(updatedEntry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid price history data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update price history entry" });
    }
  });
  
  app.delete("/api/price-history/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const success = await storage.deletePriceHistoryEntry(id);
      if (!success) {
        return res.status(404).json({ message: "Price history entry not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete price history entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
