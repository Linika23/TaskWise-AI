import type { GenerateSubtasksOutput } from '@/ai/flows/generate-subtasks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface SubtaskListProps {
  subtasks: GenerateSubtasksOutput['subtasks'];
}

export default function SubtaskList({ subtasks }: SubtaskListProps) {
  if (!subtasks || subtasks.length === 0) {
    return null; // Or a message indicating no subtasks
  }

  return (
    <div className="space-y-4">
      {subtasks.map((subtask, index) => (
        <Card key={index} className="bg-card shadow-md transition-all hover:shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">{subtask.task}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>Estimated time: {subtask.estimatedTime}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
