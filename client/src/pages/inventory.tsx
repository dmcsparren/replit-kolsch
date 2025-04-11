import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InventoryItem } from "@shared/schema";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, ScanLine, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import BarcodeScanner from "@/components/inventory/barcode-scanner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Inventory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Hops",
    currentQuantity: "0",
    minimumQuantity: "0",
    unit: "kg",
    status: "good",
    forecast: "Sufficient",
    lastUpdated: new Date(),
  });
  
  const { data: inventoryItems, isLoading } = useQuery<InventoryItem[]>({
    queryKey: ['/api/inventory'],
  });
  
  const createInventoryMutation = useMutation({
    mutationFn: async (newItem: Omit<InventoryItem, "id">) => {
      const res = await apiRequest("POST", "/api/inventory", newItem);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      toast({
        title: "Inventory item added",
        description: "The inventory item has been successfully added.",
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Failed to add inventory item",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const deleteInventoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/inventory/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      toast({
        title: "Inventory item deleted",
        description: "The inventory item has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete inventory item",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const resetForm = () => {
    setNewItem({
      name: "",
      category: "Hops",
      currentQuantity: "0",
      minimumQuantity: "0",
      unit: "kg",
      status: "good",
      forecast: "Sufficient",
      lastUpdated: new Date(),
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine the status based on current and minimum quantities
    const current = parseFloat(newItem.currentQuantity);
    const minimum = parseFloat(newItem.minimumQuantity);
    
    let status = "good";
    let forecast = "Sufficient";
    
    if (current <= minimum * 0.25) {
      status = "critical";
      forecast = "Order soon";
    } else if (current <= minimum * 0.5) {
      status = "warning";
      forecast = "2 weeks";
    }
    
    createInventoryMutation.mutate({
      ...newItem,
      currentQuantity: newItem.currentQuantity,
      minimumQuantity: newItem.minimumQuantity,
      status,
      forecast,
      lastUpdated: new Date(),
    });
  };
  
  const handleBarcodeDetected = (data: { name?: string; category?: string; quantity?: string; unit?: string }) => {
    // Open the add dialog and populate with scanned data
    setNewItem({
      ...newItem,
      name: data.name || newItem.name,
      category: data.category || newItem.category,
      currentQuantity: data.quantity || newItem.currentQuantity,
      unit: data.unit || newItem.unit
    });
    
    // Open the dialog to let the user complete any missing information
    setIsAddDialogOpen(true);
    
    toast({
      title: "Barcode scanned",
      description: `Detected: ${data.name || 'Unknown item'}`,
    });
  };
  
  // Convert string to number for calculations
  const getNumericValue = (value: string | number | null | undefined): number => {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    return parseFloat(value.toString()) || 0;
  };
  
  // Define table columns
  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "name",
      header: "Item Name",
      cell: ({ row }) => {
        const status = row.original.status;
        const statusColor = status === "critical" ? "bg-red-500" : 
                            status === "warning" ? "bg-yellow-500" : "bg-green-500";
        
        return (
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${statusColor} mr-2`}></div>
            <span className="font-medium">{row.getValue("name")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "currentQuantity",
      header: "Current Amount",
      cell: ({ row }) => {
        return (
          <span className="font-mono">
            {row.original.currentQuantity} {row.original.unit}
          </span>
        );
      },
    },
    {
      accessorKey: "minimumQuantity",
      header: "Minimum Level",
      cell: ({ row }) => {
        return (
          <span className="font-mono">
            {row.original.minimumQuantity} {row.original.unit}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const current = getNumericValue(row.original.currentQuantity);
        const minimum = getNumericValue(row.original.minimumQuantity);
        const percentage = Math.min(100, Math.max(5, Math.round((current / minimum) * 50)));
        
        const statusColor = status === "critical" ? "bg-red-500" : 
                            status === "warning" ? "bg-yellow-500" : "bg-green-500";
        
        return (
          <div className="w-24 bg-neutral-200 rounded-full h-2">
            <div className={`${statusColor} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
          </div>
        );
      },
    },
    {
      accessorKey: "forecast",
      header: "Forecast",
      cell: ({ row }) => {
        const forecast = row.getValue("forecast");
        const status = row.original.status;
        
        const badgeClass = status === "critical" ? "bg-red-100 text-red-700" : 
                           status === "warning" ? "bg-yellow-100 text-yellow-700" : 
                           "bg-green-100 text-green-700";
        
        return (
          <Badge variant="outline" className={`${badgeClass} border-0`}>
            {forecast as string}
          </Badge>
        );
      },
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
              onClick={() => deleteInventoryMutation.mutate(row.original.id)}
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
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div className="flex space-x-2">
          <BarcodeScanner onBarcodeDetected={handleBarcodeDetected} />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-dark">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hops">Hops</SelectItem>
                        <SelectItem value="Malt">Malt</SelectItem>
                        <SelectItem value="Yeast">Yeast</SelectItem>
                        <SelectItem value="Adjuncts">Adjuncts</SelectItem>
                        <SelectItem value="Packaging">Packaging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="currentQuantity" className="text-right">
                      Current Quantity
                    </Label>
                    <Input
                      id="currentQuantity"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newItem.currentQuantity}
                      onChange={(e) => setNewItem({ ...newItem, currentQuantity: e.target.value })}
                      className="col-span-2"
                      required
                    />
                    <Select
                      value={newItem.unit}
                      onValueChange={(value) => setNewItem({ ...newItem, unit: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="packs">packs</SelectItem>
                        <SelectItem value="units">units</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="minimumQuantity" className="text-right">
                      Minimum Level
                    </Label>
                    <Input
                      id="minimumQuantity"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newItem.minimumQuantity}
                      onChange={(e) => setNewItem({ ...newItem, minimumQuantity: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Item</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={inventoryItems || []}
            searchColumn="name"
            searchPlaceholder="Search inventory items..."
          />
        </CardContent>
      </Card>
    </div>
  );
}