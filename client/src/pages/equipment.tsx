import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Equipment } from "@shared/schema";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash, FlaskRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
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
import { Progress } from "@/components/ui/progress";

export default function EquipmentPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "kettle",
    status: "active",
    currentBatch: "",
    utilization: 0,
    maintenanceStatus: "good",
    timeRemaining: "",
  });
  
  const { data: equipmentItems, isLoading } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
  });
  
  const createEquipmentMutation = useMutation({
    mutationFn: async (newEquipment: Omit<Equipment, "id">) => {
      const res = await apiRequest("POST", "/api/equipment", newEquipment);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/equipment'] });
      toast({
        title: "Equipment added",
        description: "The equipment has been successfully added.",
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Failed to add equipment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const deleteEquipmentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/equipment/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/equipment'] });
      toast({
        title: "Equipment deleted",
        description: "The equipment has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete equipment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const resetForm = () => {
    setNewEquipment({
      name: "",
      type: "kettle",
      status: "active",
      currentBatch: "",
      utilization: 0,
      maintenanceStatus: "good",
      timeRemaining: "",
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEquipmentMutation.mutate(newEquipment);
  };
  
  // Define table columns
  const columns: ColumnDef<Equipment>[] = [
    {
      accessorKey: "name",
      header: "Equipment Name",
      cell: ({ row }) => {
        const status = row.original.status;
        const statusColor = status === "active" ? "bg-green-500" : "bg-red-500";
        
        return (
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${statusColor} mr-2`}></div>
            <span className="font-medium">{row.getValue("name")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return <span className="capitalize">{type}</span>;
      },
    },
    {
      accessorKey: "currentBatch",
      header: "Current Batch",
      cell: ({ row }) => {
        const currentBatch = row.getValue("currentBatch") as string;
        return currentBatch ? currentBatch : <span className="text-neutral-400">—</span>;
      },
    },
    {
      accessorKey: "utilization",
      header: "Utilization",
      cell: ({ row }) => {
        const utilization = row.getValue("utilization") as number;
        return (
          <div className="w-full max-w-xs">
            <Progress value={utilization} className="h-2" />
            <div className="text-xs mt-1 text-right">{utilization}%</div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        
        return (
          <Badge
            variant="outline"
            className={
              status === "active"
                ? "bg-green-100 text-green-700 border-0"
                : "bg-red-100 text-red-700 border-0"
            }
          >
            {status === "active" ? "Active" : "Offline"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "timeRemaining",
      header: "Time Remaining",
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
              onClick={() => deleteEquipmentMutation.mutate(row.original.id)}
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
        <h1 className="text-2xl font-bold">Equipment Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Equipment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newEquipment.name}
                    onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={newEquipment.type}
                    onValueChange={(value) => setNewEquipment({ ...newEquipment, type: value })}
                  >
                    <SelectTrigger id="type" className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kettle">Brew Kettle</SelectItem>
                      <SelectItem value="fermenter">Fermenter</SelectItem>
                      <SelectItem value="mash-tun">Mash Tun</SelectItem>
                      <SelectItem value="brite-tank">Brite Tank</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={newEquipment.status}
                    onValueChange={(value) => setNewEquipment({ ...newEquipment, status: value })}
                  >
                    <SelectTrigger id="status" className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newEquipment.status === "active" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="currentBatch" className="text-right">
                      Current Batch
                    </Label>
                    <Input
                      id="currentBatch"
                      value={newEquipment.currentBatch}
                      onChange={(e) => setNewEquipment({ ...newEquipment, currentBatch: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g. Batch #1242"
                    />
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="utilization" className="text-right">
                    Utilization (%)
                  </Label>
                  <Input
                    id="utilization"
                    type="number"
                    min="0"
                    max="100"
                    value={newEquipment.utilization}
                    onChange={(e) => setNewEquipment({ ...newEquipment, utilization: parseInt(e.target.value) })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maintenanceStatus" className="text-right">
                    Maintenance
                  </Label>
                  <Select
                    value={newEquipment.maintenanceStatus}
                    onValueChange={(value) => setNewEquipment({ ...newEquipment, maintenanceStatus: value })}
                  >
                    <SelectTrigger id="maintenanceStatus" className="col-span-3">
                      <SelectValue placeholder="Select maintenance status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good">Good Condition</SelectItem>
                      <SelectItem value="maintenance">Needs Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="timeRemaining" className="text-right">
                    Time Remaining
                  </Label>
                  <Input
                    id="timeRemaining"
                    value={newEquipment.timeRemaining}
                    onChange={(e) => setNewEquipment({ ...newEquipment, timeRemaining: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g. 4h 22m remaining"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Equipment</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {equipmentItems?.map((item) => (
          <Card key={item.id} className="border border-neutral-200">
            <CardContent className="p-4 flex justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <span className={`inline-block w-3 h-3 ${item.status === "active" ? "bg-green-500" : "bg-red-500"} rounded-full mr-2`}></span>
                  <h3 className="font-medium">{item.name}</h3>
                </div>
                <p className="text-sm text-neutral-500 mb-1">
                  Currently: <span className={item.status === "active" ? "text-neutral-800" : "text-red-600"}>
                    {item.status === "active" ? `In use (${item.currentBatch})` : "Maintenance"}
                  </span>
                </p>
                <p className="text-sm text-neutral-500 mb-3">
                  Utilization: <span className="text-neutral-800">{item.utilization}%</span>
                </p>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className={
                      item.status === "active"
                        ? "bg-green-100 text-green-700 border-0"
                        : "bg-red-100 text-red-700 border-0"
                    }
                  >
                    {item.status === "active" ? "Active" : "Offline"}
                  </Badge>
                  <span className="text-xs text-neutral-500">
                    {item.timeRemaining}
                  </span>
                </div>
              </div>
              <FlaskRound className={`h-10 w-10 ${item.status === "active" ? "text-secondary-light" : "text-neutral-300"}`} />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Equipment List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={equipmentItems || []}
            searchColumn="name"
            searchPlaceholder="Search equipment..."
          />
        </CardContent>
      </Card>
    </>
  );
}
