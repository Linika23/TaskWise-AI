
'use server';
/**
 * @fileOverview Generates detailed steps for a given subtask title using AI.
 *
 * - generateStepsForSubtask - A function that generates a list of steps for a subtask.
 * - GenerateStepsForSubtaskInput - The input type for the generateStepsForSubtask function.
 * - GenerateStepsForSubtaskOutput - The return type for the generateStepsForSubtask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStepsForSubtaskInputSchema = z.object({
  taskTitle: z.string().describe('The title of the subtask to break down into steps.'),
});
export type GenerateStepsForSubtaskInput = z.infer<typeof GenerateStepsForSubtaskInputSchema>;

const GenerateStepsForSubtaskOutputSchema = z.object({
  steps: z.array(z.string()).describe('A list of actionable steps to complete the subtask.'),
});
export type GenerateStepsForSubtaskOutput = z.infer<typeof GenerateStepsForSubtaskOutputSchema>;

export async function generateStepsForSubtask(
  input: GenerateStepsForSubtaskInput
): Promise<GenerateStepsForSubtaskOutput> {
  return generateStepsForSubtaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStepsForSubtaskPrompt',
  input: {schema: GenerateStepsForSubtaskInputSchema},
  output: {schema: GenerateStepsForSubtaskOutputSchema},
  prompt: `You are a productivity assistant. Your task is to break down the given subtask into smaller, actionable steps.
Focus on clarity and conciseness for each step.
Return the steps as a JSON array of strings, where each string is a single step.

Subtask Title: {{{taskTitle}}}

Ensure the output is a valid JSON array of strings. For example:
{
  "steps": ["Step 1 description", "Step 2 description", "Step 3 description"]
}
`,
});

const generateStepsForSubtaskFlow = ai.defineFlow(
  {
    name: 'generateStepsForSubtaskFlow',
    inputSchema: GenerateStepsForSubtaskInputSchema,
    outputSchema: GenerateStepsForSubtaskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
