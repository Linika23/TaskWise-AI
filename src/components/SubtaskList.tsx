
import type { GenerateSubtasksOutput } from '@/ai/flows/generate-subtasks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Edit3, Trash2, Sparkles as AiIcon, CalendarPlus, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ExtendedSubtask = GenerateSubtasksOutput['subtasks'][0] & {
  id: string;
  done: boolean;
};

interface SubtaskListProps {
  subtasks: ExtendedSubtask[];
  onToggleDone: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  onBreakIntoSteps: (taskId: string) => void;
  onSetDeadline: (taskId: string) => void;
}

export default function SubtaskList({ 
  subtasks, 
  onToggleDone, 
  onDeleteTask, 
  onEditTask, 
  onBreakIntoSteps, 
  onSetDeadline 
}: SubtaskListProps) {
  if (!subtasks || subtasks.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No subtasks generated yet.</p>;
  }

  return (
    <div className="space-y-4">
      {subtasks.map((subtask) => (
        <Card 
          key={subtask.id} 
          className={cn(
            "bg-card shadow-md transition-all hover:shadow-lg",
            subtask.done && "bg-card/70 opacity-80"
          )}
        >
          <CardHeader className="p-4 flex flex-row items-start gap-3 space-y-0">
            <Checkbox
              id={`task-${subtask.id}`}
              checked={subtask.done}
              onCheckedChange={() => onToggleDone(subtask.id)}
              aria-label={subtask.done ? "Mark task as not done" : "Mark task as done"}
              className="mt-1"
            />
            <div className="flex-grow">
              <label
                htmlFor={`task-${subtask.id}`}
                className={cn(
                  "text-lg font-medium cursor-pointer",
                  subtask.done && "line-through text-muted-foreground"
                )}
              >
                {subtask.task}
              </label>
              <CardDescription className={cn("text-sm", subtask.done && "line-through")}>
                <Clock className="mr-1.5 h-3.5 w-3.5 inline-block relative -top-px" />
                Estimated time: {subtask.estimatedTime}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-wrap gap-2 items-center justify-end">
              <Button variant="ghost" size="sm" onClick={() => onEditTask(subtask.id)} aria-label="Edit task">
                <Edit3 className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onBreakIntoSteps(subtask.id)} aria-label="Break into steps with AI">
                <AiIcon className="h-4 w-4 mr-1" /> Steps
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onSetDeadline(subtask.id)} aria-label="Set deadline">
                <CalendarPlus className="h-4 w-4 mr-1" /> Deadline
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDeleteTask(subtask.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10" aria-label="Delete task">
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

