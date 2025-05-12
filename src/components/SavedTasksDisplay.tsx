"use client";

import type { SavedGoal } from '@/app/page'; // Assuming page.tsx exports this type
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, Clock, Trash2, CalendarDays, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

interface SavedTasksDisplayProps {
  savedGoals: SavedGoal[];
  setSavedGoals: React.Dispatch<React.SetStateAction<SavedGoal[]>>;
}

export default function SavedTasksDisplay({ savedGoals, setSavedGoals }: SavedTasksDisplayProps) {
  const { toast } = useToast();

  if (savedGoals.length === 0) {
    return (
      <div className="text-center py-10 mt-8 bg-card rounded-lg shadow-md p-6">
        <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No Saved Plans Yet</h3>
        <p className="text-muted-foreground">
          Generate some subtasks for your goals and click "Save This Plan" to see them here.
        </p>
      </div>
    );
  }

  const handleDeleteGoal = (goalId: string) => {
    setSavedGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast({
      title: "Plan Deleted",
      description: "The saved task plan has been removed.",
      variant: "default"
    });
  };

  return (
    <div className="mt-12 w-full">
      <h2 className="text-3xl font-semibold mb-6 text-primary flex items-center">
        <CalendarDays className="mr-3 h-8 w-8" />
        Your Saved Plans
      </h2>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {savedGoals.map((goal) => (
          <AccordionItem key={goal.id} value={goal.id} className="bg-card border border-border rounded-lg shadow-md overflow-hidden">
            <AccordionTrigger className="p-4 hover:no-underline group text-left w-full">
              <div className="flex justify-between items-center w-full">
                <div className="flex-grow mr-2">
                  <h3 className="text-xl font-medium text-foreground">{goal.mainGoal}</h3>
                  <p className="text-xs text-muted-foreground">Saved on: {goal.savedAt}</p>
                </div>
                <div className="flex items-center">
                   <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); handleDeleteGoal(goal.id); }}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive p-1 rounded-md"
                    aria-label="Delete plan"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 ml-2" />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0 bg-background/30">
              <h4 className="text-sm font-semibold mt-2 mb-2 text-muted-foreground flex items-center"><ListChecks className="w-4 h-4 mr-2 text-primary"/>Subtasks:</h4>
              <div className="space-y-3">
                {goal.subtasks.map((subtask, subIndex) => (
                  <Card key={subIndex} className="bg-background/80 shadow-sm">
                    <CardHeader className="p-3">
                      <CardTitle className="text-md font-normal">{subtask.task}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Estimated time: {subtask.estimatedTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

