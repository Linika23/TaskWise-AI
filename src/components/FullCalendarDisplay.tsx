
"use client";

import { useState, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from 'lucide-react';
import type { ExtendedSubtask, SavedGoal } from '@/types';
import { parseISO, format } from 'date-fns';

interface FullCalendarDisplayProps {
  currentSubtasks: ExtendedSubtask[];
  savedGoals: SavedGoal[];
}

export default function FullCalendarDisplay({ currentSubtasks, savedGoals }: FullCalendarDisplayProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const deadlineDates = useMemo(() => {
    const allDeadlines: Date[] = [];
    const seenDateStrings = new Set<string>(); // To store YYYY-MM-DD strings to avoid duplicate Date objects for the same day

    const processSubtask = (subtask: ExtendedSubtask) => {
      if (subtask.deadline && typeof subtask.deadline === 'string') {
        try {
          const date = parseISO(subtask.deadline);
          // Check if date is valid before formatting
          if (isNaN(date.getTime())) {
            console.warn("Invalid deadline date object after parsing:", subtask.deadline);
            return;
          }
          const dateString = format(date, 'yyyy-MM-dd'); 
          if (!seenDateStrings.has(dateString)) {
            allDeadlines.push(date);
            seenDateStrings.add(dateString);
          }
        } catch (e) {
          console.warn("Error parsing deadline date in FullCalendarDisplay:", subtask.deadline, e);
        }
      }
    };

    currentSubtasks.forEach(processSubtask);
    savedGoals.forEach(goal => {
      goal.subtasks.forEach(processSubtask);
    });
    
    return allDeadlines;
  }, [currentSubtasks, savedGoals]);

  const modifiers = {
    hasDeadline: deadlineDates,
  };

  const modifiersClassNames = {
    hasDeadline: 'deadline-highlighted',
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <CalendarDays className="mr-3 h-7 w-7" />
          Calendar View
        </CardTitle>
        <CardDescription>
          View your schedule. Dates with task deadlines are marked with a dot.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          // Optional: to show more months by default, though styling might be needed
          // numberOfMonths={2} 
          // initialFocus
        />
      </CardContent>
    </Card>
  );
}
