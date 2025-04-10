import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, Calendar, InfoIcon, Package, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/stats'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: "Batches in Process",
      value: stats?.batchesInProcess || 0,
      change: stats?.batchesInProcessChange || "+0",
      icon: <Package className="h-6 w-6" />,
      iconBg: "bg-primary-light bg-opacity-20 text-primary",
      borderColor: "border-primary",
      changeColor: "text-green-600"
    },
    {
      label: "Inventory Items",
      value: stats?.totalInventoryItems || 0,
      change: `${stats?.lowStockItems || 0} items low in stock`,
      icon: <Package className="h-6 w-6" />,
      iconBg: "bg-secondary-light bg-opacity-20 text-secondary",
      borderColor: "border-secondary",
      changeColor: "text-neutral-500",
      changeIcon: <InfoIcon className="h-4 w-4 mr-1" />
    },
    {
      label: "Equipment Status",
      value: `${stats?.equipmentUtilization || 0}%`,
      change: `${stats?.maintenanceNeeded || 0} needs maintenance`,
      icon: <Settings className="h-6 w-6" />,
      iconBg: "bg-primary-dark bg-opacity-20 text-primary-dark",
      borderColor: "border-primary-dark",
      changeColor: stats?.maintenanceNeeded > 0 ? "text-red-600" : "text-green-600",
      changeIcon: <InfoIcon className="h-4 w-4 mr-1" />
    },
    {
      label: "Scheduled Brews",
      value: stats?.scheduledBrews || 0,
      change: `${stats?.thisWeekBrews || 0} this week`,
      icon: <Calendar className="h-6 w-6" />,
      iconBg: "bg-accent-light bg-opacity-20 text-accent",
      borderColor: "border-accent",
      changeColor: "text-green-600",
      changeIcon: <Calendar className="h-4 w-4 mr-1" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 fade-in">
      {statCards.map((card, index) => (
        <Card key={index} className={`border-l-4 ${card.borderColor}`}>
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-500 font-semibold">{card.label}</p>
                <h3 className="text-2xl font-bold text-neutral-800 mt-1">{card.value}</h3>
                <p className={`text-sm ${card.changeColor} mt-1 flex items-center`}>
                  {card.changeIcon || <ArrowUp className="h-4 w-4 mr-1" />}
                  {card.change}
                </p>
              </div>
              <div className={`p-3 rounded-full ${card.iconBg}`}>
                {card.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
