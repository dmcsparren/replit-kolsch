import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Recipe } from "@shared/schema";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Search, Trash, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ui/image-upload";

export default function RecipesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    type: "Flagship",
    description: "",
    abv: "5.0",
    ibu: "25",
    srm: "5.0",
    ingredients: [] as string[],
    instructions: [] as string[],
    imageUrl: "",
  });
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [currentInstruction, setCurrentInstruction] = useState("");
  
  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: ['/api/recipes'],
  });
  
  const createRecipeMutation = useMutation({
    mutationFn: async (newRecipe: any) => {
      const res = await apiRequest("POST", "/api/recipes", newRecipe);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      toast({
        title: "Recipe added",
        description: "The recipe has been successfully added.",
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Failed to add recipe",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const deleteRecipeMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/recipes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      toast({
        title: "Recipe deleted",
        description: "The recipe has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete recipe",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const resetForm = () => {
    setNewRecipe({
      name: "",
      type: "Flagship",
      description: "",
      abv: "5.0",
      ibu: "25",
      srm: "5.0",
      ingredients: [],
      instructions: [],
      imageUrl: "",
    });
    setCurrentIngredient("");
    setCurrentInstruction("");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRecipeMutation.mutate({
      ...newRecipe,
      abv: parseFloat(newRecipe.abv),
      ibu: parseInt(newRecipe.ibu),
      srm: parseFloat(newRecipe.srm),
    });
  };
  
  const addIngredient = () => {
    if (currentIngredient.trim()) {
      setNewRecipe({
        ...newRecipe,
        ingredients: [...newRecipe.ingredients, currentIngredient.trim()]
      });
      setCurrentIngredient("");
    }
  };
  
  const removeIngredient = (index: number) => {
    setNewRecipe({
      ...newRecipe,
      ingredients: newRecipe.ingredients.filter((_, i) => i !== index)
    });
  };
  
  const addInstruction = () => {
    if (currentInstruction.trim()) {
      setNewRecipe({
        ...newRecipe,
        instructions: [...newRecipe.instructions, currentInstruction.trim()]
      });
      setCurrentInstruction("");
    }
  };
  
  const removeInstruction = (index: number) => {
    setNewRecipe({
      ...newRecipe,
      instructions: newRecipe.instructions.filter((_, i) => i !== index)
    });
  };
  
  // Filter recipes based on search term
  const filteredRecipes = recipes?.filter(recipe => 
    recipe.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.style?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Define table columns
  const columns: ColumnDef<Recipe>[] = [
    {
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl = row.getValue("imageUrl") as string | undefined;
        return (
          <div className="flex justify-center">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Recipe" 
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-gray-300" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Recipe Name",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <Badge
            variant="outline"
            className={
              type === "Flagship"
                ? "bg-primary-light bg-opacity-20 text-primary border-0"
                : "bg-yellow-100 text-yellow-700 border-0"
            }
          >
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return <span className="line-clamp-1">{description}</span>;
      },
    },
    {
      accessorKey: "abv",
      header: "ABV",
      cell: ({ row }) => {
        return <span>{row.getValue("abv")}%</span>;
      },
    },
    {
      accessorKey: "ibu",
      header: "IBU",
    },
    {
      accessorKey: "srm",
      header: "SRM",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-destructive"
              onClick={() => deleteRecipeMutation.mutate(row.original.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Recipe Library</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="h-4 w-4 mr-2" />
              Add Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Recipe</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="details">Recipe Details</TabsTrigger>
                  <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Recipe Name
                    </Label>
                    <Input
                      id="name"
                      value={newRecipe.name}
                      onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select
                      value={newRecipe.type}
                      onValueChange={(value) => setNewRecipe({ ...newRecipe, type: value })}
                    >
                      <SelectTrigger id="type" className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Flagship">Flagship</SelectItem>
                        <SelectItem value="Seasonal">Seasonal</SelectItem>
                        <SelectItem value="Experimental">Experimental</SelectItem>
                        <SelectItem value="Limited">Limited Edition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newRecipe.description}
                      onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
                      className="col-span-3"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-4 grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="abv">ABV (%)</Label>
                        <Input
                          id="abv"
                          type="number"
                          min="0"
                          step="0.1"
                          value={newRecipe.abv}
                          onChange={(e) => setNewRecipe({ ...newRecipe, abv: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="ibu">IBU</Label>
                        <Input
                          id="ibu"
                          type="number"
                          min="0"
                          value={newRecipe.ibu}
                          onChange={(e) => setNewRecipe({ ...newRecipe, ibu: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="srm">SRM</Label>
                        <Input
                          id="srm"
                          type="number"
                          min="0"
                          step="0.1"
                          value={newRecipe.srm}
                          onChange={(e) => setNewRecipe({ ...newRecipe, srm: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">
                      Recipe Image
                    </Label>
                    <div className="col-span-3">
                      <ImageUpload 
                        imageUrl={newRecipe.imageUrl}
                        onImageChange={(url) => setNewRecipe({ ...newRecipe, imageUrl: url || "" })}
                        label="Recipe Image"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ingredients" className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="ingredient">Add Ingredient</Label>
                      <Input
                        id="ingredient"
                        value={currentIngredient}
                        onChange={(e) => setCurrentIngredient(e.target.value)}
                        placeholder="e.g. 5kg Pilsner Malt"
                      />
                    </div>
                    <Button type="button" onClick={addIngredient}>Add</Button>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Ingredients List</h3>
                    {newRecipe.ingredients.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No ingredients added yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {newRecipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex justify-between items-center border-b pb-2">
                            <span>{ingredient}</span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-destructive"
                              onClick={() => removeIngredient(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="instructions" className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="instruction">Add Instruction</Label>
                      <Textarea
                        id="instruction"
                        value={currentInstruction}
                        onChange={(e) => setCurrentInstruction(e.target.value)}
                        placeholder="e.g. Mash at 152°F for 60 minutes"
                        rows={2}
                      />
                    </div>
                    <Button type="button" onClick={addInstruction}>Add</Button>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Brewing Instructions</h3>
                    {newRecipe.instructions.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No instructions added yet.</p>
                    ) : (
                      <ol className="space-y-2 list-decimal list-inside">
                        {newRecipe.instructions.map((instruction, index) => (
                          <li key={index} className="flex justify-between items-start border-b pb-2">
                            <span className="pl-2">{instruction}</span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-destructive ml-2"
                              onClick={() => removeInstruction(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Recipe</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {recipes?.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-md transition-shadow overflow-hidden">
            {recipe.imageUrl && (
              <div className="h-40 w-full overflow-hidden">
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.name}
                  className="h-full w-full object-cover" 
                />
              </div>
            )}
            {!recipe.imageUrl && (
              <div className="h-40 w-full bg-gray-100 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-300" />
              </div>
            )}
            <CardContent className="p-4">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium text-lg">{recipe.name}</h3>
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-700 border-0"
                >
                  {recipe.style}
                </Badge>
              </div>
              <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{recipe.notes || 'No description available'}</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-3 text-xs text-neutral-500">
                  <span>ABV: {recipe.targetAbv || 'N/A'}%</span>
                  <span>IBU: {recipe.targetIbu || 'N/A'}</span>
                  <span>Batch: {recipe.batchSize}L</span>
                </div>
                <Button variant="ghost" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Recipe List</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search recipes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredRecipes || []}
            searchColumn="name"
          />
        </CardContent>
      </Card>
    </>
  );
}
