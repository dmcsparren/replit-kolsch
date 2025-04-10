import StatsOverview from "@/components/dashboard/stats-overview";
import InventoryLevels from "@/components/dashboard/inventory-levels";
import EquipmentStatus from "@/components/dashboard/equipment-status";
import BrewingScheduleWidget from "@/components/dashboard/brewing-schedule";
import RecipeLibrary from "@/components/dashboard/recipe-library";

export default function Dashboard() {
  return (
    <>
      <StatsOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-in">
        <div className="lg:col-span-2 space-y-6">
          <InventoryLevels />
          <EquipmentStatus />
        </div>
        
        <div className="space-y-6">
          <BrewingScheduleWidget />
          <RecipeLibrary />
        </div>
      </div>
    </>
  );
}
