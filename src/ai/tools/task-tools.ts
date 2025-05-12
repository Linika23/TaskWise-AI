'use server';
/**
 * @fileOverview AI tools related to task management for Genkit.
 *
 * - generateSubtasksTool - A Genkit tool to break down a goal into subtasks.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { generateSubtasks, GenerateSubtasksInputSchema, GenerateSubtasksOutputSchema } from '@/ai/flows/generate-subtasks';

export const generateSubtasksTool = ai.defineTool(
  {
    name: 'generateSubtasksTool',
    description: 'Breaks down a user-provided goal into a list of actionable subtasks with estimated time allocations. Use this when a user explicitly asks to break down a goal, plan a task, or generate subtasks.',
    inputSchema: GenerateSubtasksInputSchema,
    outputSchema: GenerateSubtasksOutputSchema,
  },
  async (input) => {
    // Call the existing generateSubtasks flow
    return await generateSubtasks(input);
  }
);
