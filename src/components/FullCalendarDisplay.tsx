
"use client";

import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from 'lucide-react';

export default function FullCalendarDisplay() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <CalendarDays className="mr-3 h-7 w-7" />
          Calendar View
        </CardTitle>
        <CardDescription>
          View your schedule and deadlines. Click on a date to select it.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          // Optional: to show more months by default, though styling might be needed
          // numberOfMonths={2} 
          // initialFocus
        />
      </CardContent>
    </Card>
  );
}
