
"use client";

import type { TrackedGoal } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { format, isPast, isToday } from 'date-fns';
import { Timer, TrendingUp, Flag, CalendarDays, ClipboardList, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalDisplayProps {
  goals: TrackedGoal[];
  onToggleComplete: (goalId: string) => void;
}

export default function GoalDisplay({ goals, onToggleComplete }: GoalDisplayProps) {
  const sortedGoals = [...goals].sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
  
  const shortTermGoals = sortedGoals.filter(g => g.type === 'short');
  const longTermGoals = sortedGoals.filter(g => g.type === 'long');

  const renderGoalList = (goalList: TrackedGoal[], title: string, icon: React.ReactNode) => (
    <Card className="shadow-xl w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          {icon}
          <span className="ml-3">{title}</span>
        </CardTitle>
        <CardDescription>
          {`Manage your ${title.toLowerCase()}. Click "Add New Goal" above to add more.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {goalList.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <ClipboardList className="mx-auto h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No {title.toLowerCase()} yet.</p>
            <p className="text-sm">Click the "Add New Goal" button above to get started!</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {goalList.map((goal) => {
              const targetDate = new Date(goal.targetDate);
              const isOverdue = !goal.completed && isPast(targetDate) && !isToday(targetDate);
              return (
                <li key={goal.id}>
                  <Card className={cn(
                    "shadow-md transition-all hover:shadow-lg", 
                    goal.completed && "bg-card/70 opacity-80",
                    isOverdue && "border-destructive/50"
                  )}>
                    <CardHeader className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={`goal-${goal.id}`}
                          checked={goal.completed}
                          onCheckedChange={() => onToggleComplete(goal.id)}
                          aria-label={goal.completed ? "Mark goal as not completed" : "Mark goal as completed"}
                          className="mt-1 shrink-0"
                        />
                        <div className="flex-grow">
                          <label
                            htmlFor={`goal-${goal.id}`}
                            className={cn(
                              "text-lg font-semibold cursor-pointer text-foreground",
                              goal.completed && "line-through text-muted-foreground"
                            )}
                          >
                            {goal.title}
                          </label>
                          {goal.targetDate && (
                             <p className={cn(
                                "text-xs text-muted-foreground mt-0.5 flex items-center", 
                                goal.completed && "line-through",
                                isOverdue && "text-destructive font-medium"
                              )}>
                              <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                              Target: {format(targetDate, "MMM d, yyyy")}
                              {isOverdue && <AlertTriangle className="h-3.5 w-3.5 ml-1.5 text-destructive" />}
                            </p>
                          )}
                        </div>
                        <Flag className={cn("h-5 w-5 shrink-0", goal.completed ? "text-muted-foreground" : isOverdue ? "text-destructive" : "text-primary")} />
                      </div>
                    </CardHeader>
                    {goal.description && (
                      <CardContent className="p-4 pt-0">
                        <p className={cn("text-sm text-muted-foreground", goal.completed && "line-through")}>
                          {goal.description}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {renderGoalList(shortTermGoals, "Short-Term Goals", <Timer className="h-7 w-7" />)}
      {renderGoalList(longTermGoals, "Long-Term Goals", <TrendingUp className="h-7 w-7" />)}
    </div>
  );
}
