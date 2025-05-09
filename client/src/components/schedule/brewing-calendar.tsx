import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { BrewingSchedule } from '@shared/schema';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Setup the localizer by providing the date-fns functions and locales
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse: (str: string, format: string, options?: any) => {
    return parse(str, format, new Date(), options);
  },
  startOfWeek,
  getDay,
  locales,
});

// Map brewing schedules to events for the calendar
const mapSchedulesToEvents = (schedules: BrewingSchedule[]) => {
  return schedules.map(schedule => {
    const start = new Date(schedule.startDate);
    const end = new Date(schedule.endDate);
    
    return {
      id: schedule.id,
      title: `${schedule.recipeName} (${schedule.batchNumber})`,
      start,
      end,
      status: schedule.status,
      allDay: false,
      resource: schedule
    };
  });
};

// Custom event styling
const eventStyleGetter = (event: any) => {
  let backgroundColor = '#3B82F6'; // Default blue color
  let textColor = '#ffffff';
  let borderColor = '#2563EB';
  
  if (event.status === 'In progress') {
    backgroundColor = '#F59E0B'; // Amber for in-progress
    borderColor = '#D97706';
  } else if (event.status === 'Completed') {
    backgroundColor = '#10B981'; // Green for completed
    borderColor = '#059669';
  }
  
  return {
    style: {
      backgroundColor,
      color: textColor,
      borderColor,
      borderRadius: '4px',
      opacity: 0.9,
      display: 'block',
      padding: '4px',
      fontWeight: 500,
      fontSize: '0.875rem'
    }
  };
};

// Calendar toolbar with custom views/navigation
const CustomToolbar = ({ label, onNavigate, onView, views }: any) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onNavigate('TODAY')}
          className="mr-2"
        >
          Today
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onNavigate('PREV')}
          className="mr-2"
        >
          Back
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onNavigate('NEXT')}
        >
          Next
        </Button>
      </div>
      <h2 className="text-lg font-semibold">{label}</h2>
      <div>
        {views.map((view: string) => (
          <Button 
            key={view}
            variant="outline" 
            size="sm" 
            onClick={() => onView(view)}
            className="ml-2 capitalize"
          >
            {view}
          </Button>
        ))}
      </div>
    </div>
  );
};

interface BrewingCalendarProps {
  schedules: BrewingSchedule[];
  onSelectEvent?: (schedule: BrewingSchedule) => void;
  onDeleteSchedule?: (scheduleId: number) => void;
}

export default function BrewingCalendar({ 
  schedules, 
  onSelectEvent,
  onDeleteSchedule 
}: BrewingCalendarProps) {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<BrewingSchedule | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  
  const events = mapSchedulesToEvents(schedules);
  
  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event.resource);
    setShowEventDialog(true);
    if (onSelectEvent) {
      onSelectEvent(event.resource);
    }
  };
  
  const handleDeleteSchedule = () => {
    if (selectedEvent && onDeleteSchedule) {
      onDeleteSchedule(selectedEvent.id);
      setShowEventDialog(false);
      toast({
        title: "Schedule removed",
        description: "The brewing session has been removed from the calendar.",
      });
    }
  };
  
  return (
    <>
      <div className="h-[600px] mt-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          views={['month', 'week', 'day', 'agenda']}
          defaultView={Views.WEEK}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar
          }}
        />
      </div>
      
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.recipeName}</DialogTitle>
            <DialogDescription>Brewing session details</DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Batch:</div>
              <div>{selectedEvent?.batchNumber}</div>
              
              <div className="text-muted-foreground">Status:</div>
              <div>{selectedEvent?.status}</div>
              
              <div className="text-muted-foreground">Start:</div>
              <div>{selectedEvent ? format(new Date(selectedEvent.startDate), 'PPP p') : ''}</div>
              
              <div className="text-muted-foreground">End:</div>
              <div>{selectedEvent ? format(new Date(selectedEvent.endDate), 'PPP p') : ''}</div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>
              Close
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteSchedule}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}