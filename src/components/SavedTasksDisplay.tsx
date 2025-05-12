
"use client";

import type { SavedGoal } from '@/app/page'; // Assuming page.tsx exports this type
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ListChecks, Clock, Trash2, CalendarDays, ChevronDown, Edit3, Sparkles as AiIcon, CalendarPlus } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import type { ExtendedSubtask } from './SubtaskList'; // Import ExtendedSubtask

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
  
  const toggleSubtaskDoneInSavedGoal = (goalId: string, subtaskId: string) => {
    setSavedGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === goalId
          ? {
              ...goal,
              subtasks: goal.subtasks.map(st =>
                st.id === subtaskId ? { ...st, done: !st.done } : st
              ),
            }
          : goal
      )
    );
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
                {goal.subtasks.map((subtask: ExtendedSubtask) => (
                  <Card key={subtask.id} className={cn("bg-background/80 shadow-sm", subtask.done && "opacity-70")}>
                    <CardHeader className="p-3 flex flex-row items-start gap-3 space-y-0">
                       <Checkbox
                        id={`saved-${goal.id}-${subtask.id}`}
                        checked={subtask.done}
                        onCheckedChange={() => toggleSubtaskDoneInSavedGoal(goal.id, subtask.id)}
                        aria-label={subtask.done ? "Mark task as not done" : "Mark task as done"}
                        className="mt-1"
                      />
                      <div className="flex-grow">
                        <label
                          htmlFor={`saved-${goal.id}-${subtask.id}`}
                           className={cn(
                            "text-md font-normal cursor-pointer",
                            subtask.done && "line-through text-muted-foreground"
                          )}
                        >
                          {subtask.task}
                        </label>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-2 h-3.5 w-3.5" />
                        <span>Estimated time: {subtask.estimatedTime}</span>
                      </div>
                       {/* Placeholder for action buttons if needed in saved view later */}
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

