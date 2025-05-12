
"use client";

import { useState, useMemo, useRef } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays, ListChecks } from 'lucide-react';
import type { ExtendedSubtask, SavedGoal } from '@/types';
import { parseISO, format, isEqual, startOfDay } from 'date-fns';
import type { DayModifiers } from 'react-day-picker';
import { Button } from './ui/button'; // Needed for PopoverTrigger asChild

export default function FullCalendarDisplay({ currentSubtasks, savedGoals }: FullCalendarDisplayProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date()); // For calendar's own selection state
  
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverTasks, setPopoverTasks] = useState<ExtendedSubtask[]>([]);
  const [popoverDate, setPopoverDate] = useState<Date | undefined>(undefined);
  
  // Ref for the PopoverTrigger. We'll use a dummy button and control it.
  const popoverTriggerRef = useRef<HTMLButtonElement>(null);


  const allTasksWithDeadlines = useMemo(() => {
    const tasks: ExtendedSubtask[] = [];
    currentSubtasks.forEach(subtask => {
      if (subtask.deadline) tasks.push(subtask);
    });
    savedGoals.forEach(goal => {
      goal.subtasks.forEach(subtask => {
        if (subtask.deadline) {
          // Avoid duplicates if a task is in both current and saved (though IDs should be unique)
          if (!tasks.find(t => t.id === subtask.id)) {
            tasks.push(subtask);
          }
        }
      });
    });
    return tasks;
  }, [currentSubtasks, savedGoals]);

  const deadlineDates = useMemo(() => {
    const allDeadlines: Date[] = [];
    const seenDateStrings = new Set<string>();

    allTasksWithDeadlines.forEach(subtask => {
      if (subtask.deadline && typeof subtask.deadline === 'string') {
        try {
          const date = parseISO(subtask.deadline);
          if (isNaN(date.getTime())) {
            console.warn("Invalid deadline date object after parsing:", subtask.deadline);
            return;
          }
          const dateOnly = startOfDay(date); // Normalize to start of day for comparison
          const dateString = format(dateOnly, 'yyyy-MM-dd'); 
          if (!seenDateStrings.has(dateString)) {
            allDeadlines.push(dateOnly);
            seenDateStrings.add(dateString);
          }
        } catch (e) {
          console.warn("Error parsing deadline date in FullCalendarDisplay:", subtask.deadline, e);
        }
      }
    });
    return allDeadlines;
  }, [allTasksWithDeadlines]);

  const modifiers = {
    hasDeadline: deadlineDates,
  };

  const modifiersClassNames = {
    hasDeadline: 'deadline-highlighted',
  };

  const handleDayClick = (day: Date, dayModifiers: DayModifiers) => {
    setSelectedDate(day); // Update calendar's own selected state
    const clickedDayNormalized = startOfDay(day);

    if (dayModifiers.hasDeadline) {
      const tasksForDay = allTasksWithDeadlines.filter(task => {
        if (!task.deadline) return false;
        try {
          return isEqual(startOfDay(parseISO(task.deadline)), clickedDayNormalized);
        } catch {
          return false;
        }
      });

      if (tasksForDay.length > 0) {
        // If popover is already open for this day, toggle it off.
        if (isPopoverOpen && popoverDate && isEqual(startOfDay(popoverDate), clickedDayNormalized)) {
          setIsPopoverOpen(false);
        } else {
          setPopoverTasks(tasksForDay);
          setPopoverDate(day); // Use the non-normalized day for display consistency
          setIsPopoverOpen(true);
        }
      } else {
        // hasDeadline was true, but no tasks found (should be rare, but good to handle)
        setIsPopoverOpen(false);
      }
    } else {
      // Clicked on a day with no deadlines
      setIsPopoverOpen(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <CalendarDays className="mr-3 h-7 w-7" />
          Calendar View
        </CardTitle>
        <CardDescription>
          View your schedule. Dates with task deadlines are marked with a dot. Click on a marked date to see tasks.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center p-4">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            {/* The Calendar itself or its container can be the conceptual trigger area.
                The PopoverContent will be positioned relative to this trigger.
                We use an invisible button that can be programmatically managed if needed,
                or simply make the calendar div the trigger.
                For simplicity, we'll make the Calendar component the trigger.
             */}
            <div className="relative"> {/* This div acts as the trigger */}
              <Calendar
                mode="single"
                selected={selectedDate}
                // onSelect={setSelectedDate} // We use onDayClick for more control
                onDayClick={handleDayClick}
                className="rounded-md border"
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 z-50" side="bottom" align="center">
            {popoverDate && (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none flex items-center text-primary">
                    <ListChecks className="mr-2 h-5 w-5" />
                    Tasks for {format(popoverDate, "PPP")}
                  </h4>
                  <hr/>
                </div>
                {popoverTasks.length > 0 ? (
                  <ul className="grid gap-2 max-h-60 overflow-y-auto pr-1">
                    {popoverTasks.map(task => (
                      <li key={task.id} className="text-sm p-2 bg-card/30 rounded-md shadow-sm">
                        <p className="font-medium">{task.task}</p>
                        <p className="text-xs text-muted-foreground">Est: {task.estimatedTime}</p>
                         {task.done && <span className="text-xs text-success">(Completed)</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No tasks scheduled for this day.</p>
                )}
              </div>
            )}
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
}

interface FullCalendarDisplayProps {
  currentSubtasks: ExtendedSubtask[];
  savedGoals: SavedGoal[];
}
