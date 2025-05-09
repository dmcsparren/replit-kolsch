import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Plus, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format, addHours, parseISO, isEqual, isToday, isTomorrow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BrewingSchedule, Recipe } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import BrewingCalendar from "@/components/schedule/brewing-calendar";
import "@/components/schedule/calendar-styles.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function SchedulePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("15:00");
  const [selectedRecipe, setSelectedRecipe] = useState<string>("");
  
  const { data: schedules, isLoading: isLoadingSchedules } = useQuery<BrewingSchedule[]>({
    queryKey: ['/api/schedules'],
  });
  
  const { data: recipes, isLoading: isLoadingRecipes } = useQuery<Recipe[]>({
    queryKey: ['/api/recipes'],
  });
  
  const createScheduleMutation = useMutation({
    mutationFn: async (newSchedule: any) => {
      const res = await apiRequest("POST", "/api/schedules", newSchedule);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
      toast({
        title: "Brew scheduled",
        description: "The brewing session has been successfully scheduled.",
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Failed to schedule brew",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/schedules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
      toast({
        title: "Schedule removed",
        description: "The scheduled brew has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove schedule",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const resetForm = () => {
    setDate(new Date());
    setStartTime("09:00");
    setEndTime("15:00");
    setSelectedRecipe("");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRecipe) {
      toast({
        title: "Missing recipe",
        description: "Please select a recipe for this brew session.",
        variant: "destructive",
      });
      return;
    }
    
    const startDateTime = new Date(date);
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    startDateTime.setHours(startHours, startMinutes, 0);
    
    const endDateTime = new Date(date);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    endDateTime.setHours(endHours, endMinutes, 0);
    
    if (endDateTime <= startDateTime) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }
    
    // Find the selected recipe name
    const recipe = recipes?.find(r => r.id.toString() === selectedRecipe);
    if (!recipe) return;
    
    const nextBatchNumber = `Batch #${Math.floor(1000 + Math.random() * 9000)}`;
    
    createScheduleMutation.mutate({
      recipeName: recipe.name,
      batchNumber: nextBatchNumber,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      status: "Scheduled",
      equipmentId: null,
    });
  };
  
  // Group schedules by date
  const schedulesByDate = schedules?.reduce<{ [key: string]: BrewingSchedule[] }>((acc, schedule) => {
    const dateKey = format(new Date(schedule.startDate), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(schedule);
    return acc;
  }, {}) || {};
  
  // Format schedule date for display
  const formatScheduleDateHeading = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, 'MMMM d, yyyy');
  };
  
  // Format time range for display
  const formatTimeRange = (start: Date | string, end: Date | string) => {
    return `${format(new Date(start), 'h:mm a')} - ${format(new Date(end), 'h:mm a')}`;
  };
  
  if (isLoadingSchedules) {
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
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Brewing Schedule</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="h-4 w-4 mr-2" />
              New Brew
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Brew</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recipe" className="text-right">
                    Recipe
                  </Label>
                  <Select
                    value={selectedRecipe}
                    onValueChange={setSelectedRecipe}
                  >
                    <SelectTrigger id="recipe" className="col-span-3">
                      <SelectValue placeholder="Select recipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingRecipes ? (
                        <SelectItem value="" disabled>Loading recipes...</SelectItem>
                      ) : (
                        recipes?.map(recipe => (
                          <SelectItem key={recipe.id} value={recipe.id.toString()}>
                            {recipe.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(date) => date && setDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startTime" className="text-right">
                    Start Time
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full"
                      required
                    />
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endTime" className="text-right">
                    End Time
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full"
                      required
                    />
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Schedule Brew</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          {schedules && schedules.length > 0 ? (
            <BrewingCalendar 
              schedules={schedules} 
              onDeleteSchedule={(id) => deleteScheduleMutation.mutate(id)}
            />
          ) : (
            <div className="text-center p-10 border-2 border-dashed rounded-md">
              <h3 className="font-medium text-lg mb-2">No Brewing Sessions</h3>
              <p className="text-muted-foreground">
                Schedule your first brewing session to see it in the calendar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Brewing Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.keys(schedulesByDate).length === 0 ? (
              <div className="text-center p-6">
                <p className="text-muted-foreground">No brewing sessions scheduled.</p>
              </div>
            ) : (
              Object.entries(schedulesByDate)
                .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                .map(([dateStr, daySchedules]) => (
                  <div key={dateStr} className="space-y-3">
                    <h3 className="font-semibold text-lg">{formatScheduleDateHeading(dateStr)}</h3>
                    {daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className={`border-l-4 ${
                          schedule.status === "In progress" ? "border-primary-light" : "border-secondary"
                        } p-3 ${
                          schedule.status === "In progress" ? "bg-primary-light bg-opacity-5" : "bg-secondary bg-opacity-5"
                        } rounded-r-lg`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-neutral-800">{schedule.recipeName}</h4>
                            <p className="text-sm text-neutral-500 mt-1">
                              {formatTimeRange(schedule.startDate, schedule.endDate)}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge
                              variant="outline"
                              className={
                                schedule.status === "In progress"
                                  ? "bg-primary bg-opacity-10 text-primary border-0"
                                  : "bg-neutral-200 text-neutral-700 border-0"
                              }
                            >
                              {schedule.status}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-destructive" 
                              onClick={() => deleteScheduleMutation.mutate(schedule.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-neutral-500">{schedule.batchNumber}</span>
                          <Button variant="link" size="sm" className="text-xs p-0 h-auto text-neutral-600 hover:text-neutral-900">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
