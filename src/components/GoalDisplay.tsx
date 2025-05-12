
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target, ListChecks } from 'lucide-react';

interface GoalDisplayProps {
  goals: string[];
}

export default function GoalDisplay({ goals }: GoalDisplayProps) {
  return (
    <Card className="shadow-xl w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <Target className="mr-3 h-7 w-7" />
          My Goals
        </CardTitle>
        <CardDescription>
          Here's a list of your current and saved main goals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <ListChecks className="mx-auto h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No goals found yet.</p>
            <p>Start by entering a goal in the "My Tasks" section.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {goals.map((goal, index) => (
              <li key={index} className="p-4 bg-card/60 rounded-md shadow-sm border border-border">
                <p className="text-lg font-medium text-foreground">{goal}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
