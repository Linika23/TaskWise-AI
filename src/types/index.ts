
import type { GenerateSubtasksOutput } from '@/ai/flows/generate-subtasks';

export interface TrackedGoal {
  id: string;
  title: string;
  description: string;
  type: "short" | "long";
  targetDate: string; // ISO string
  completed: boolean;
}

export type ExtendedSubtask = GenerateSubtasksOutput['subtasks'][0] & {
  id: string;
  done: boolean;
  deadline?: string; // Optional deadline string (ISO format)
};

export interface SavedGoal {
  id: string;
  mainGoal: string;
  subtasks: ExtendedSubtask[]; 
  savedAt: string;
}
