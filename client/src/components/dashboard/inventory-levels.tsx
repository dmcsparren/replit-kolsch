import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Package2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { InventoryItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function InventoryLevels() {
  const [sortBy, setSortBy] = useState<"critical" | "category" | "name">(
    "critical",
  );

  const { data: inventoryItems, isLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
  });

  const sortedItems = () => {
    if (!inventoryItems) return [];

    const items = [...inventoryItems];
    if (sortBy === "critical") {
      return items.sort((a, b) => {
        const statusOrder = { critical: 0, warning: 1, good: 2 };
        return (
          statusOrder[a.status as keyof typeof statusOrder] -
          statusOrder[b.status as keyof typeof statusOrder]
        );
      });
    } else if (sortBy === "category") {
      return items.sort((a, b) => a.category.localeCompare(b.category));
    } else {
      return items.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "good":
        return "bg-green-500";
      default:
        return "bg-neutral-500";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "good":
        return "bg-green-500";
      default:
        return "bg-neutral-200";
    }
  };

  const getForecastBadge = (forecast: string) => {
    if (!forecast) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-0">
          Unknown
        </Badge>
      );
    }
    if (forecast === "Order soon") {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-700 border-0">
          {forecast}
        </Badge>
      );
    } else if (forecast?.includes("weeks")) {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-100 text-yellow-700 border-0"
        >
          {forecast}
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-700 border-0"
        >
          {forecast}
        </Badge>
      );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">
          Inventory Levels
        </CardTitle>
        <div className="flex space-x-2">
          <Button size="sm" className="bg-secondary hover:bg-secondary-dark">
            <Package2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Order</span> Supplies
          </Button>
          <Button size="sm" variant="outline">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <div className="font-medium text-sm text-neutral-500">Sort by:</div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="ghost"
              className={
                sortBy === "critical"
                  ? "bg-primary bg-opacity-10 text-primary"
                  : ""
              }
              onClick={() => setSortBy("critical")}
            >
              Critical
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={
                sortBy === "category"
                  ? "bg-primary bg-opacity-10 text-primary"
                  : ""
              }
              onClick={() => setSortBy("category")}
            >
              Category
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={
                sortBy === "name" ? "bg-primary bg-opacity-10 text-primary" : ""
              }
              onClick={() => setSortBy("name")}
            >
              A-Z
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b pb-3"
              >
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm font-semibold text-neutral-500 border-b border-neutral-200">
                  <th className="pb-3 pr-2">Item</th>
                  <th className="pb-3 pr-2">Category</th>
                  <th className="pb-3 pr-2">Current</th>
                  <th className="pb-3 pr-2">Status</th>
                  <th className="pb-3 pr-2">Forecast</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems()
                  .slice(0, 5)
                  .map((item) => (
                    <tr key={item.id} className="border-b border-neutral-100">
                      <td className="py-3 pr-2">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full ${getStatusColor(item.status)} mr-2`}
                          ></div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-2 text-sm text-neutral-600">
                        {item.category}
                      </td>
                      <td className="py-3 pr-2">
                        <span className="text-sm font-mono">
                          {item.currentQuantity} {item.unit}
                        </span>
                      </td>
                      <td className="py-3 pr-2">
                        <div className="w-24 bg-neutral-200 rounded-full h-2">
                          <div
                            className={`${getStatusBgColor(item.status)} h-2 rounded-full`}
                            style={{
                              width: `${Math.min(100, Math.max(5, Math.round((Number(item.currentQuantity) / Number(item.minimumQuantity)) * 50)))}%`,
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-3 pr-2">
                        {getForecastBadge(item.forecast)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-center mt-5">
          <Link href="/inventory">
            <Button
              variant="link"
              className="text-primary hover:text-primary-dark"
            >
              View All Inventory
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
