import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Equipment } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FlaskRound } from "lucide-react";

export default function EquipmentStatus() {
  const { data: equipment, isLoading } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
  });
  
  // Function to get the appropriate status badge
  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge variant="outline" className="bg-green-100 text-green-700 border-0">Active</Badge>;
    } else {
      return <Badge variant="outline" className="bg-red-100 text-red-700 border-0">Offline</Badge>;
    }
  };
  
  // Function to get the appropriate icon color
  const getIconColor = (status: string) => {
    if (status === "active") {
      return "text-secondary-light";
    } else {
      return "text-neutral-300";
    }
  };
  
  // Function to get the appropriate status indicator color
  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-500" : "bg-red-500";
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">Equipment Status</CardTitle>
        <Button variant="outline" size="sm">
          Manage Equipment
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {equipment?.map((item) => (
              <div key={item.id} className="border border-neutral-200 rounded-lg p-4 flex justify-between relative">
                <div>
                  <div className="flex items-center mb-2">
                    <span className={`inline-block w-3 h-3 ${getStatusColor(item.status)} rounded-full mr-2`}></span>
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
                    {getStatusBadge(item.status)}
                    <span className="text-xs text-neutral-500">
                      {item.timeRemaining}
                    </span>
                  </div>
                </div>
                <FlaskRound className={`h-10 w-10 ${getIconColor(item.status)}`} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
