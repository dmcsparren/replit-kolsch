import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { InventoryItem, BrewingSchedule, Equipment } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Download, FileText, Filter } from "lucide-react";

export default function ReportsPage() {
  const [reportPeriod, setReportPeriod] = useState("month");
  
  const { data: inventoryItems, isLoading: isLoadingInventory } = useQuery<InventoryItem[]>({
    queryKey: ['/api/inventory'],
  });
  
  const { data: schedules, isLoading: isLoadingSchedules } = useQuery<BrewingSchedule[]>({
    queryKey: ['/api/schedules'],
  });
  
  const { data: equipment, isLoading: isLoadingEquipment } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
  });
  
  const isLoading = isLoadingInventory || isLoadingSchedules || isLoadingEquipment;
  
  // Prepare inventory data for charts
  const prepareInventoryByCategory = () => {
    if (!inventoryItems) return [];
    
    const categories: Record<string, number> = {};
    inventoryItems.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = 0;
      }
      categories[item.category]++;
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };
  
  // Prepare equipment utilization data
  const prepareEquipmentUtilization = () => {
    if (!equipment) return [];
    
    return equipment.map(item => ({
      name: item.name,
      utilization: item.utilization,
    }));
  };
  
  // Prepare status distribution data
  const prepareStatusDistribution = () => {
    if (!inventoryItems) return [];
    
    const statusCounts: Record<string, number> = { critical: 0, warning: 0, good: 0 };
    inventoryItems.forEach(item => {
      statusCounts[item.status]++;
    });
    
    return [
      { name: "Critical", value: statusCounts.critical, color: "#ef4444" },
      { name: "Warning", value: statusCounts.warning, color: "#f59e0b" },
      { name: "Good", value: statusCounts.good, color: "#10b981" },
    ];
  };
  
  // Prepare brewing activity data (mock data for now)
  const prepareBrewingActivity = () => {
    return [
      { name: "Jan", brews: 5 },
      { name: "Feb", brews: 7 },
      { name: "Mar", brews: 6 },
      { name: "Apr", brews: 9 },
      { name: "May", brews: 8 },
      { name: "Jun", brews: 11 },
    ];
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Brewery Reports</h1>
        <div className="flex items-center space-x-2">
          <Select
            value={reportPeriod}
            onValueChange={setReportPeriod}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Inventory by Category</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <FileText className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prepareInventoryByCategory()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Items" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Equipment Utilization</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <FileText className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={prepareEquipmentUtilization()}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip formatter={(value) => [`${value}%`, "Utilization"]} />
                <Bar dataKey="utilization" name="Utilization %" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Inventory Status Distribution</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <FileText className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={prepareStatusDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {prepareStatusDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Brewing Activity</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <FileText className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prepareBrewingActivity()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="brews" name="Brewing Sessions" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Inventory Value Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-10 border-2 border-dashed rounded-md">
            <h3 className="font-medium text-lg mb-2">Advanced Reporting</h3>
            <p className="text-muted-foreground">
              Detailed financial and inventory value reports would be available here with export capabilities.
            </p>
            <Button className="mt-4">
              <Download className="h-4 w-4 mr-2" />
              Generate Full Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
