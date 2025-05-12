'use server';
/**
 * @fileOverview Generates subtasks for a given goal or task using AI.
 *
 * - generateSubtasks - A function that generates subtasks with estimated time allocations.
 * - GenerateSubtasksInput - The input type for the generateSubtasks function.
 * - GenerateSubtasksOutput - The return type for the generateSubtasks function.
 * - GenerateSubtasksInputSchema - The Zod schema for the input.
 * - GenerateSubtasksOutputSchema - The Zod schema for the output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateSubtasksInputSchema = z.object({
  goal: z.string().describe('The goal or task to break down into subtasks.'),
});
export type GenerateSubtasksInput = z.infer<typeof GenerateSubtasksInputSchema>;

export const GenerateSubtasksOutputSchema = z.object({
  subtasks: z
    .array(
      z.object({
        task: z.string().describe('A subtask required to achieve the goal.'),
        estimatedTime: z
          .string()
          .describe('Estimated time allocation for the subtask (e.g., 1 hour, 30 minutes).'),
      })
    )
    .describe('A list of subtasks with estimated time allocations.'),
});
export type GenerateSubtasksOutput = z.infer<typeof GenerateSubtasksOutputSchema>;

export async function generateSubtasks(input: GenerateSubtasksInput): Promise<GenerateSubtasksOutput> {
  return generateSubtasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSubtasksPrompt',
  input: {schema: GenerateSubtasksInputSchema},
  output: {schema: GenerateSubtasksOutputSchema},
  prompt: `You are a productivity expert. Your role is to break down goals into actionable subtasks with estimated time allocations.

  Given the following goal, generate a list of subtasks with estimated time allocations for each subtask. The time allocations should be realistic and sum up to a reasonable total time for the goal.

  Goal: {{{goal}}}

  Ensure the output is a valid JSON.
  `,
});

const generateSubtasksFlow = ai.defineFlow(
  {
    name: 'generateSubtasksFlow',
    inputSchema: GenerateSubtasksInputSchema,
    outputSchema: GenerateSubtasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

